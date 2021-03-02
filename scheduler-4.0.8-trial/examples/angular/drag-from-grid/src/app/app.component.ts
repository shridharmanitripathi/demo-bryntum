/**
 * App Component script
 */
import { Component, ViewChild, AfterViewInit, Input } from '@angular/core';
import { SchedulerComponent } from 'bryntum-angular-shared';
import { GridComponent } from './grid/grid.component';
import schedulerConfig from './schedulerConfig';

// Bryntum umd lite bundle comes without polyfills to support Angular's zone.js
import { DateHelper, DragHelper, Rectangle, DomHelper, WidgetHelper, Toast } from 'bryntum-scheduler/scheduler.lite.umd.js';

@Component({
    selector    : 'app-root',
    templateUrl : './app.component.html',
    styleUrls   : ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

    @Input() autoRescheduleTasks: boolean = false;

    @ViewChild(SchedulerComponent, { static: true }) scheduler: SchedulerComponent;
    @ViewChild(GridComponent, { static: true }) gridComponent: GridComponent;

    schedulerConfig: any = schedulerConfig;

    ngAfterViewInit() {

        const
            scheduler = this.scheduler.schedulerInstance,
            grid = this.gridComponent.grid,
            eventStore = scheduler.eventStore
        ;

        grid.eventStore = eventStore;

        eventStore.on({
            update : ({ record, changes }) => {
                if ('resourceId' in changes && !record.resourceId) {
                    eventStore.remove(record);
                    grid.store.add(record);
                }
                if (this.autoRescheduleTasks) {
                    this.rescheduleOverlappingTasks(record);
                }
            },
            add    : ({ records }) => {
                if (this.autoRescheduleTasks) {
                    records.forEach((eventRecord) => this.rescheduleOverlappingTasks(eventRecord));
                }
            }
        });

        this.initDrag(scheduler, grid);

        setTimeout(() => {
            Toast.show({
                timeout : 3500,
                html    : 'Please note that this example uses the Bryntum Grid, which is licensed separately.'
            });
        }, 500);

    }

    onToggle(pressed) {
        this.autoRescheduleTasks = pressed;
    }

    initDrag(scheduler, grid) {
        const drag = new DragHelper({
            cloneTarget        : true,
            mode               : 'translateXY',
            // Only allow drops on the schedule area
            dropTargetSelector : '.b-timeline-subgrid',

            // Only allow drag of row elements inside on the unplanned grid
            targetSelector : '.b-grid-row',
            constrain      : false,
            outerElement   : grid.element
        });

        drag.on({
            dragstart : ({ event, context }) => {
                const
                    me = drag,
                    mouseX = context.clientX,
                    proxy = context.element,
                    task = grid.getRecordFromElement(context.grabbed),
                    newWidth = scheduler.timeAxisViewModel.getDistanceForDuration(task.durationMS)
                ;

                // save a reference to the task so we can access it later
                context.task = task;

                // Mutate dragged element (grid row) into an event bar
                proxy.classList.remove('b-grid-row');
                proxy.classList.add('b-sch-event-wrap');
                proxy.classList.add('b-unassigned-class');
                proxy.innerHTML = task.name;

                // If the new width is narrower than the grabbed element...
                if (context.grabbed.offsetWidth > newWidth) {
                    const proxyRect = Rectangle.from(context.grabbed);

                    // If the mouse is off (nearly or) the end, centre the element on the mouse
                    if (mouseX > proxyRect.x + newWidth - 20) {
                        context.newX = context.elementStartX = context.elementX = mouseX - newWidth / 2;
                        DomHelper.setTranslateX(proxy, context.newX);
                    }
                }

                proxy.style.width = `${newWidth}px`;

                // Prevent tooltips from showing while dragging
                scheduler.element.classList.add('b-dragging-event');

            },
            drag      : ({ event, context }) => {
                const
                    me = drag,
                    date = scheduler.getDateFromCoordinate(DomHelper.getTranslateX(context.element), 'round', false),
                    resource = context.target && scheduler.resolveResourceRecord(context.target)
                ;

                // Don't allow drops anywhere, only allow drops if the drop is on the time axis and on top of a Resource
                context.valid = context.valid && Boolean(date && resource);

                // Save reference to resource so we can use it in onTaskDrop
                context.resource = resource;
            },
            drop      : ({ context, event }) => {
                const
                    me = drag,
                    task = context.task,
                    target = context.target
                ;

                // If drop was done in a valid location, set the startDate and transfer the task to the Scheduler event store
                if (context.valid && target) {
                    const date = scheduler.getDateFromCoordinate(DomHelper.getTranslateX(context.element), 'round', false),
                        // Try resolving event record from target element, to determine if drop was on another event
                        targetEventRecord = scheduler.resolveEventRecord(context.target);

                    if (date) {
                        // Remove from grid first so that the data change
                        // below does not fire events into the grid.
                        grid.store.remove(task);

                        task.setStartDate(date, true);
                        // task.startDate = date;
                        task.resource = context.resource;
                        scheduler.eventStore.add(task);
                    }

                    // Dropped on a scheduled event, display toast
                    if (targetEventRecord) {
                        WidgetHelper.toast(`Dropped on ${targetEventRecord.name}`);
                    }

                    context.finalize();
                } else {
                    me.abort();
                }

                scheduler.element.classList.remove('b-dragging-event');

            }
        });
    }

    rescheduleOverlappingTasks(eventRecord) {
        if (eventRecord.resource) {
            const
                futureEvents  = [],
                earlierEvents = [];

            // Split tasks into future and earlier tasks
            eventRecord.resource.events.forEach(event => {
                if (event !== eventRecord) {
                    if (event.startDate >= eventRecord.startDate) {
                        futureEvents.push(event);
                    }
                    else {
                        earlierEvents.push(event);
                    }
                }
            });

            if (futureEvents.length || earlierEvents.length) {
                futureEvents.sort((a, b) => a.startDate > b.startDate ? 1 : -1);
                earlierEvents.sort((a, b) => a.startDate > b.startDate ? -1 : 1);

                futureEvents.forEach((ev, i) => {
                    const prev = futureEvents[i - 1] || eventRecord;

                    ev.startDate = DateHelper.max(prev.endDate, ev.startDate);
                });

                // Walk backwards and remove any overlap
                [eventRecord, ...earlierEvents].forEach((ev, i, all) => {
                    const prev = all[i - 1];

                    if (ev.endDate > Date.now() && ev !== eventRecord && prev) {
                        ev.setEndDate(DateHelper.min(prev.startDate, ev.endDate), true);
                    }
                });
            }
        }
    }

}


