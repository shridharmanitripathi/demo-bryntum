/*!
 *
 * Bryntum Scheduler 4.0.8 (TRIAL VERSION)
 *
 * Copyright(c) 2021 Bryntum AB
 * https://bryntum.com/contact
 * https://bryntum.com/license
 *
 */
/**
 * Angular wrapper for Scheduler
 * Taken from the original example and adjusted
 */
import { Component, OnInit, OnChanges, ElementRef, Input, Output, EventEmitter, SimpleChanges, OnDestroy } from '@angular/core';

// Bryntum umd lite bundle comes without polyfills to support Angular's zone.js
import { Scheduler, AssignmentModel, AssignmentStore, EventModel } from 'bryntum-scheduler/scheduler.lite.umd.js';

@Component({
    selector : 'bry-scheduler',
    template : ''
})
export class SchedulerComponent implements OnInit, OnChanges, OnDestroy {

    private elementRef: ElementRef;
    public schedulerInstance: Scheduler;

    private featureRe: RegExp = /Feature$/;

    /* #region features */
    private features: string[] = [
        'cellEditFeature',
        'cellMenuFeature',
        'cellTooltipFeature',
        'columnDragToolbarFeature',
        'columnLinesFeature',
        'columnPickerFeature',
        'columnReorderFeature',
        'columnResizeFeature',
        'dependenciesFeature',
        'dependencyEditFeature',
        'eventDragCreateFeature',
        'eventDragFeature',
        'eventDragSelectFeature',
        'eventEditFeature',
        'eventFilterFeature',
        'eventMenuFeature',
        'eventResizeFeature',
        'eventTooltipFeature',
        'filterBarFeature',
        'filterFeature',
        'groupFeature',
        'groupSummaryFeature',
        'headerMenuFeature',
        'headerZoomFeature',
        'labelsFeature',
        'nonWorkingTimeFeature',
        'panFeature',
        'pdfExportFeature',
        'quickFindFeature',
        'regionResizeFeature',
        'resourceTimeRangesFeature',
        'rowReorderFeature',
        'scheduleMenuFeature',
        'scheduleTooltipFeature',
        'searchFeature',
        'simpleEventEditFeature',
        'sortFeature',
        'stripeFeature',
        'summaryFeature',
        'timeAxisHeaderMenuFeature',
        'timeRangesFeature',
        'treeFeature'
    ];
    /* #endregion */

    /* #region configs */
    private configs: string[] = [
        'allowOverlap',
        'animateRemovingRows',
        'assignments',
        'assignmentStore',
        'autoAdjustTimeAxis',
        'autoHeight',
        'barMargin',
        'columnLines',
        'columns',
        'contextMenuTriggerEvent',
        'createEventOnDblClick',
        'crudManager',
        'defaultResourceImageName',
        'dependencyStore',
        'disableGridRowModelWarning',
        'displayDateFormat',
        'emptyText',
        'enableDeleteKey',
        'enableEventAnimations',
        'enableTextSelection',
        'endDate',
        'endParamName',
        'eventBarTextField',
        'eventBodyTemplate',
        'eventColor',
        'eventLayout',
        'eventRenderer',
        'events',
        'eventSelectionDisabled',
        'eventStore',
        'eventStyle',
        'fillLastColumn',
        'fillTicks',
        'fullRowRefresh',
        'hasVisibleEvents',
        'height',
        'hideHeaders',
        'horizontalEventSorterFn',
        'loadMask',
        'longPressTime',
        'maintainSelectionOnDatasetChange',
        'managedEventSizing',
        'maxHeight',
        'maxWidth',
        'maxZoomLevel',
        'milestoneAlign',
        'milestoneCharWidth',
        'milestoneLayoutMode',
        'minHeight',
        'minWidth',
        'minZoomLevel',
        'mode',
        'multiEventSelect',
        'partner',
        'passStartEndParameters',
        'readOnly',
        'removeUnassignedEvent',
        'resizeToFitIncludesHeader',
        'resourceColumns',
        'resourceImagePath',
        'resourceMargin',
        'resources',
        'resourceStore',
        'resourceTimeRanges',
        'responsiveLevels',
        'rowHeight',
        'scrollLeft',
        'scrollTop',
        'selectedEvents',
        'selectionMode',
        'showDirty',
        'snap',
        'snapRelativeToEventStartDate',
        'startDate',
        'startParamName',
        'subGridConfigs',
        'tickWidth',
        'timeRanges',
        'timeResolution',
        'triggerSelectionChangeOnRemove',
        'useInitialAnimation',
        'viewportCenterDate',
        'viewPreset',
        'weekStartDay',
        'width',
        'workingTime',
        'zoomLevel',
        'zoomOnMouseWheel',
        'zoomOnTimeAxisDoubleClick',

        // schedulerId maps to id of the underlying scheduler
        'schedulerId',

        // only for examples, delete if you don't need them
        'transitionDuration'
    ];
    /* #endregion */

    /* #region Configs */
    // schedulerId translates to id for the scheduler engine
    @Input() schedulerId: string;

    @Input() allowOverlap: boolean = true;
    @Input() animateRemovingRows: boolean;
    @Input() assignments: AssignmentModel[] | object[];
    @Input() assignmentStore: AssignmentStore | object;
    @Input() autoAdjustTimeAxis: boolean = true;
    @Input() autoHeight: boolean = false;
    @Input() barMargin: number = 5;
    @Input() columnLines: boolean = true;
    @Input() columns: object[];
    @Input() contextMenuTriggerEvent: string;
    @Input() createEventOnDblClick: boolean = true;
    @Input() crudManager: object;
    @Input() defaultResourceImageName: string;
    @Input() dependencyStore: object;
    @Input() disableGridRowModelWarning: boolean = false;
    @Input() displayDateFormat: string;
    @Input() emptyText: string;
    @Input() enableDeleteKey: boolean = true;
    @Input() enableEventAnimations: boolean = true;
    @Input() enableTextSelection: boolean = false;
    @Input() endDate: any;
    @Input() endParamName: string;
    @Input() eventBarTextField: string = 'name';
    @Input() eventBodyTemplate: any;
    @Input() eventColor: string = 'green';
    @Input() eventLayout: string;
    @Input() eventRenderer: any;
    @Input() events: object[];
    @Input() eventSelectionDisabled: boolean = false;
    @Input() eventStore: object;
    @Input() eventStyle: string = 'plain';
    @Input() fillLastColumn: boolean = true;
    @Input() fillTicks: boolean;
    @Input() fullRowRefresh: boolean = true;
    @Input() hasVisibleEvents: boolean;
    @Input() height: number | string;
    @Input() hideHeaders: boolean = false;
    @Input() horizontalEventSorterFn: any;
    @Input() loadMask: string = 'Loading...';
    @Input() longPressTime: number = 400;
    @Input() maintainSelectionOnDatasetChange: boolean = true;
    @Input() managedEventSizing: boolean = true;
    @Input() maxHeight: number | string;
    @Input() maxWidth: number | string;
    @Input() maxZoomLevel: number;
    @Input() milestoneAlign: string;
    @Input() milestoneCharWidth: number = 10;
    @Input() milestoneLayoutMode: string = 'default';
    @Input() minHeight: number | string;
    @Input() minWidth: number | string;
    @Input() minZoomLevel: number;
    @Input() mode: string;
    @Input() multiEventSelect: boolean;
    @Input() partner: any;
    @Input() passStartEndParameters: boolean;
    @Input() readOnly: boolean = false;
    @Input() removeUnassignedEvent: boolean = true;
    @Input() resizeToFitIncludesHeader: boolean = true;
    @Input() resourceColumns: any;
    @Input() resourceImagePath: string;
    @Input() resourceMargin: number;
    @Input() resources: object[];
    @Input() resourceStore: object;
    @Input() resourceTimeRanges: object;
    @Input() responsiveLevels: any;
    @Input() rowHeight: number = 50;
    @Input() scrollLeft: number;
    @Input() scrollTop: number;
    @Input() selectedEvents: EventModel[];
    @Input() selectionMode: object;
    @Input() showDirty: boolean = false;
    @Input() snap: boolean;
    @Input() snapRelativeToEventStartDate: boolean = false;
    @Input() startDate: any;
    @Input() startParamName: string;
    @Input() subGridConfigs: object;
    @Input() tickWidth: number;
    @Input() timeRanges: object | boolean;
    @Input() timeResolution: object;
    @Input() triggerSelectionChangeOnRemove: boolean = false;
    @Input() useInitialAnimation: boolean | string = true;
    @Input() viewportCenterDate: any;
    @Input() viewPreset: object | string = 'hourAndDay';
    @Input() weekStartDay: number;
    @Input() width: number | string;
    @Input() workingTime: object;
    @Input() zoomLevel: number;
    @Input() zoomOnMouseWheel: boolean = true;
    @Input() zoomOnTimeAxisDoubleClick: boolean = true;
    /* #endregion */

    /* #region Features, only used for initialization */
    @Input() cellEditFeature: boolean | object = true;
    @Input() cellMenuFeature: boolean | object;
    @Input() cellTooltipFeature: boolean | object = true;
    @Input() columnDragToolbarFeature: boolean | object = true;
    @Input() columnLinesFeature: boolean | object = true;
    @Input() columnPickerFeature: boolean = true;
    @Input() columnReorderFeature: boolean = true;
    @Input() columnResizeFeature: boolean = true;
    @Input() dependenciesFeature: boolean | object = false;
    @Input() dependencyEditFeature: boolean | object = false;
    @Input() eventDragCreateFeature: boolean | object = true;
    @Input() eventDragFeature: boolean | object = true;
    @Input() eventDragSelectFeature: boolean;
    @Input() eventEditFeature: boolean | object = true;
    @Input() eventFilterFeature: boolean | object = true;
    @Input() eventMenuFeature: boolean | object = true;
    @Input() eventResizeFeature: boolean | object = true;
    @Input() eventTooltipFeature: boolean | object = true;
    @Input() filterBarFeature: boolean | object;
    @Input() filterFeature: boolean | object;
    @Input() groupFeature: boolean | object | string = true;
    @Input() groupSummaryFeature: boolean | object;
    @Input() headerMenuFeature: boolean | object;
    @Input() headerZoomFeature: boolean;
    @Input() labelsFeature: boolean | object;
    @Input() nonWorkingTimeFeature: boolean;
    @Input() panFeature: boolean | object;
    @Input() pdfExportFeature: boolean | object;
    @Input() quickFindFeature: boolean | object;
    @Input() regionResizeFeature: boolean;
    @Input() resourceTimeRangesFeature: boolean;
    @Input() rowReorderFeature: boolean;
    @Input() scheduleMenuFeature: boolean | object = true;
    @Input() scheduleTooltipFeature: boolean | object = true;
    @Input() searchFeature: boolean;
    @Input() simpleEventEdit: boolean | object;
    @Input() sortFeature: boolean | object | string = true;
    @Input() stripeFeature: boolean;
    @Input() summaryFeature: boolean | object;
    @Input() timeAxisHeaderMenuFeature: boolean | object;
    @Input() timeRangesFeature: boolean | object[] = true;
    @Input() treeFeature: boolean;
    /* #endregion */

    // for examples only, delete
    @Input() transitionDuration: number;
    @Output() selectedEvent: string = '';

    onSchedulerEvents = new EventEmitter<object>();

    constructor(element: ElementRef) {
        // Needed later, used as target when rendering Bryntum Scheduler
        this.elementRef = element;
    }

    /**
     * Initializes component
     */
    ngOnInit() {
        const
            config = {
                // Render scheduler to components element
                appendTo : this.elementRef.nativeElement,

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

                features : {}
            }
        ;

        // relay properties with names matching this.featureRe to features
        this.features.forEach(featureName => {
            if (featureName in this) {
                config.features[featureName.replace(this.featureRe, '')] = this[featureName];
            }
        });

        // Pass configs on to scheduler
        this.configs.forEach(configName => {
            if (configName in this) {
                // application may want to pass id for the engine is schedulerId
                if ('schedulerId' === configName && this[configName]) {
                    config['id'] = this[configName];
                } else {
                    config[configName] = this[configName];
                }
            }
        });

        // The application may have passed string id of the partner so
        // we attempt to find the real instance of the scheduler with that id
        if (config['partner'] && 'string' === typeof (config['partner'])) {
            const
                bryntum = window['bryntum'],
                partner = bryntum && bryntum.get && bryntum.get(config['partner']);
            config['partner'] = partner || undefined;
        }

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
                if (me.configs.includes(name)) {
                    me.schedulerInstance[name] = currentValue;
                }

                if (me.features.includes(name)) {
                    me.schedulerInstance[name.replace(this.featureRe, '')] = currentValue;
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
        const
            scheduler = this.schedulerInstance,
            event = new scheduler.eventStore.modelClass({
                resourceId   : scheduler.resourceStore.first.id,
                startDate    : scheduler.startDate,
                duration     : 1,
                durationUnit : 'h',
                name         : 'New task',
                eventType    : 'Meeting'
            }) as EventModel;

        scheduler.editEvent(event);
    }

    /**
     * Destroys component
     */
    ngOnDestroy(): void {
        if (this.schedulerInstance) {
            this.schedulerInstance.destroy();
        }
    }
}
