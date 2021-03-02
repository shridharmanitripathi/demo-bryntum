/*!
 *
 * Bryntum Scheduler 4.0.8 (TRIAL VERSION)
 *
 * Copyright(c) 2021 Bryntum AB
 * https://bryntum.com/contact
 * https://bryntum.com/license
 *
 */
import { Component, OnInit, OnChanges, ElementRef, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
// UMD bundle is used to support IE11 browser. If you don't need it just use import from 'bryntum-scheduler' instead
import { Scheduler, EventModel } from 'bryntum-scheduler/scheduler.lite.umd.js';

@Component({
    selector : 'scheduler',
    template : '<div class="scheduler-container" style="height: 100%"></div>'
})
export class SchedulerComponent implements OnInit, OnChanges {

    private elementRef: ElementRef;
    public schedulerInstance: Scheduler;

    // Available features
    private featureInputs = [
        'cellEdit',
        'cellMenu',
        'cellTooltip',
        'columnLines',
        'columnPicker',
        'columnReorder',
        'columnResize',
        'dependencies',
        'eventDrag',
        'eventDragCreate',
        'eventEdit',
        'eventFilter',
        'eventMenu',
        'eventResize',
        'eventTooltip',
        'filter',
        'filterBar',
        'group',
        'groupSummary',
        'headerMenu',
        'labels',
        'nonWorkingTime',
        'regionResize',
        'scheduleTooltip',
        'search',
        'sort',
        'stripe',
        'summary',
        'timeAxisHeaderMenu',
        'timeRanges',
        'tree'
    ];

    // Available configs
    private configInputs = [
        'autoHeight',
        'eventBodyTemplate',
        'eventStore',
        'resources',
        'assignmentStore',
        'barMargin',
        'columns',
        'crudManager',
        'dependencyStore',
        'emptyText',
        'endDate',
        'eventColor',
        'eventLayout',
        'eventRenderer',
        'events',
        'eventStyle',
        'height',
        'minHeight',
        'minWidth',
        'readOnly',
        'resourceImagePath',
        'resourceStore',
        'responsiveLevels',
        'rowHeight',
        'startDate',
        'viewPreset',
        'width'
    ];

    // Configs
    @Input() autoHeight: boolean = false;
    @Input() barMargin: number = 5;
    @Input() columns: object[];
    @Input() emptyText: string;
    @Input() endDate: any;
    @Input() eventBodyTemplate: any;
    @Input() eventColor: string;
    @Input() eventLayout: string;
    @Input() eventRenderer: any;
    @Input() events: object[];
    @Input() eventStyle: string;
    @Input() height: number | string;
    @Input() minHeight: number | string;
    @Input() minWidth: number | string;
    @Input() readOnly: boolean = false;
    @Input() resourceImagePath: string;
    @Input() resources: object[];
    @Input() responsiveLevels: any;
    @Input() rowHeight: number = 50;
    @Input() startDate: any;
    @Input() viewPreset: string = 'hourAndDay';
    @Input() width: number | string;

    @Input() assignmentStore: object;
    @Input() crudManager: object;
    @Input() dependencyStore: object;
    @Input() eventStore: object;
    @Input() resourceStore: object;

    // Features, only used for initialization
    @Input() cellEdit: boolean | object = true;
    @Input() cellMenu: boolean | object;
    @Input() cellTooltip: boolean | object = true;
    @Input() columnLines: boolean | object = true;
    @Input() columnPicker: boolean = true;
    @Input() columnReorder: boolean = true;
    @Input() columnResize: boolean = true;
    @Input() dependencies: boolean | object = false;
    @Input() eventDrag: boolean | object = true;
    @Input() eventDragCreate: boolean | object = true;
    @Input() eventEdit: boolean | object = true;
    @Input() eventFilter: boolean | object = true;
    @Input() eventMenu: boolean | object = true;
    @Input() eventResize: boolean | object = true;
    @Input() eventTooltip: boolean | object = true;
    @Input() filter: boolean | object;
    @Input() filterBar: boolean | object;
    @Input() group: boolean | object | string = true;
    @Input() groupSummary: boolean | object;
    @Input() headerMenu: boolean | object;
    @Input() labels: boolean | object;
    @Input() nonWorkingTime: boolean;
    @Input() regionResize: boolean;
    @Input() scheduleTooltip: boolean | object = true;
    @Input() search: boolean;
    @Input() sort: boolean | object | string = true;
    @Input() stripe: boolean;
    @Input() summary: boolean | object;
    @Input() timeAxisHeaderMenu: boolean | object;
    @Input() timeRanges: boolean | object[] = true;
    @Input() tree: boolean;

    @Output() selectedEvent: string = '';
    @Output() onSchedulerEvents = new EventEmitter<object>();

    constructor(element: ElementRef) {
        // Needed later, used as target when rendering Bryntum Grid
        this.elementRef = element;
    }

    ngOnInit() {
        const
            // Features config object
            featureConfig = {},
            // Grid config object
            config = {
                // Render scheduler to components element
                appendTo : this.elementRef.nativeElement.firstElementChild,

                // Listeners, will relay events
                listeners : {
                    catchAll(event) {
                        if (event.type === 'eventselectionchange') {
                            this.selectedEvent = event.selected.length ? event.selected[0].name : '';
                        }

                        this.onSchedulerEvents.emit(event);
                    },

                    thisObj : this
                },

                features : featureConfig
            };

        // Pass configs on to scheduler
        this.configInputs.forEach(configName => {
            if (configName in this) {
                config[configName] = this[configName];
            }
        });

        // Pass feature configs on to scheduler
        this.featureInputs.forEach(featureName => {
            if (featureName in this) {
                featureConfig[featureName] = this[featureName];
            }
        });

    const engine = this.schedulerInstance = new Scheduler(config);

        // Relay events from eventStore and resourceStore, making them a bit easier to catch in your app.
        // The events are prefixed with 'events' and 'resources', turning and 'add' event into either 'eventsAdd' or
        // 'resourcesAdd'
        engine.eventStore.relayAll(engine, 'events');
        engine.resourceStore.relayAll(engine, 'resources');
    }

    ngOnChanges(changes: SimpleChanges) {

        const me = this;

    if (me.schedulerInstance) {
            // Iterate over all changes
            Object.entries(changes).forEach(([name, { currentValue }]) => {
                // Apply changes that match configs to grid
                if (me.configInputs.includes(name)) {
          me.schedulerInstance[name] = currentValue;
                }

                if (me.featureInputs.includes(name)) {
          me.schedulerInstance[name] = currentValue;
                }
            });
        }
    }

    removeEvent() {
    const scheduler = this.schedulerInstance;
        scheduler.eventStore.remove(scheduler.selectedEvents);
        this.selectedEvent = '';
    }

    addEvent() {
    const scheduler = this.schedulerInstance;

        const event = new scheduler.eventStore.modelClass({
            resourceId   : scheduler.resourceStore.first.id,
            startDate    : scheduler.startDate,
            duration     : 1,
            durationUnit : 'h',
            name         : 'New task',
            eventType    : 'Meeting'
        }) as EventModel;

        scheduler.editEvent(event);
    }
}