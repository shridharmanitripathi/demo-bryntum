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

// Bryntum umd lite bundle comes without polyfills to support Angular's zone.js
import { Scheduler, EventModel } from 'bryntum-scheduler/scheduler.lite.umd.js';

@Component({
    selector : 'scheduler',
    template : '<div></div>'
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
    private configInputs = ['autoHeight',
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
    @Input() events: object[];
    @Input() eventColor: string;
    @Input() eventLayout: string;
    @Input() eventStyle: string;
    @Input() eventRenderer: any;
    @Input() height: number | string;
    @Input() minHeight: number | string;
    @Input() minWidth: number | string;
    @Input() resourceImagePath: string;
    @Input() resources: object[];
    @Input() readOnly: boolean = false;
    @Input() responsiveLevels: any;
    @Input() rowHeight: number = 50;
    @Input() startDate: any;
    @Input() viewPreset: string = 'hourAndDay';
    @Input() width: number | string;

    // Features, only used for initialization
    @Input() cellEdit: boolean | object = true;
    @Input() cellMenu: boolean | object = true;
    @Input() columnLines: boolean | object = true;
    @Input() dependencies: boolean | object = false;
    @Input() eventDrag: boolean | object = true;
    @Input() eventDragCreate: boolean | object = true;
    @Input() eventEdit: boolean | object = true;
    @Input() eventFilter: boolean | object = true;
    @Input() eventMenu: boolean | object = true;
    @Input() eventResize: boolean | object = true;
    @Input() eventTooltip: boolean | object = true;
    @Input() group: boolean | object | string = true;
    @Input() groupSummary: boolean | object;
    @Input() headerMenu: boolean | object = true;
    @Input() labels: boolean | object;
    @Input() nonWorkingTime: boolean;
    @Input() scheduleTooltip: boolean | object = true;
    @Input() sort: boolean | object | string = true;
    @Input() stripe: boolean;
    @Input() summary: boolean | object;
    @Input() timeAxisHeaderMenu: boolean | object;
    @Input() timeRanges: boolean | object[] = true;


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

        // Relay events from eventStore and resourceStore, making them a bit easier to catch in your app
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
