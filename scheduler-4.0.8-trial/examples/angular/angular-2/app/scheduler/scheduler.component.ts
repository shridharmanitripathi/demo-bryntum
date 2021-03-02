/*!
 *
 * Bryntum Scheduler 4.0.8 (TRIAL VERSION)
 *
 * Copyright(c) 2021 Bryntum AB
 * https://bryntum.com/contact
 * https://bryntum.com/license
 *
 */
import {Component, OnInit, OnChanges, ElementRef, Input, Output, EventEmitter, SimpleChanges} from '@angular/core';
import {Http, HTTP_PROVIDERS} from '@angular/http';
import 'rxjs/add/operator/map';

declare var bryntum: any;

@Component({
    selector: 'scheduler',
    template: '<div></div>',
    providers: [HTTP_PROVIDERS]
})
export class SchedulerComponent implements OnInit, OnChanges {

    private elementRef: ElementRef;
    private schedulerInstance: any;

    /**
     * @deprecated in favor of schedulerInstance
     */
    public get schedulerEngine() : any {
        console.warn('schedulerEngine is deprecated. Use schedulerInstance instead.')
        return this.schedulerInstance;
    }

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
        'resourceStore',
        'resourceImagePath',
        'responsiveLevels',
        'rowHeight',
        'startDate',
        'viewPreset',
        'width'
    ];

    // Configs
    @Input() url: string;

    @Input() autoHeight: boolean = true;
    @Input() columns: any[];
    @Input() events: any[];
    @Input() height: number | string;
    @Input() minHeight: number | string;
    @Input() minWidth: number | string;
    @Input() resources: any[];
    @Input() readOnly: boolean = false;
    @Input() rowHeight: number = 50;
    @Input() startDate: any;
    @Input() endDate: any;
    @Input() viewPreset: string = 'hourAndDay';
    @Input() barMargin: number = 5;
    @Input() width: number | string;
    @Input() resourceImagePath: string;

    // Features, only used for initialization
    @Input() cellEdit: boolean | any = true;
    @Input() cellMenu: boolean | any = true;
    @Input() columnLines: boolean | any = true;
    @Input() dependencies: boolean | any = false;
    @Input() eventDrag: boolean | any = true;
    @Input() eventDragCreate: boolean | any = true;
    @Input() eventEditor: boolean | any = true;
    @Input() eventFilter: boolean | any = true;
    @Input() eventMenu: boolean | any = true;
    @Input() eventResize: boolean | any = true;
    @Input() eventTooltip: boolean | any = true;
    @Input() groupSummary: boolean | any;
    @Input() headerMenu: boolean | any = true;
    @Input() labels: boolean | any;
    @Input() nonWorkingTime: boolean;
    @Input() scheduleTooltip: boolean | any = true;
    @Input() summaryToolbar: boolean | any;
    @Input() timeAxisHeaderMenu: boolean | any;
    @Input() timeRanges: boolean | any[] = true;

    @Output() selectedEvent: string = '';
    @Output() onSchedulerEvents = new EventEmitter<any>();

    constructor(private http: Http, element: ElementRef) {
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
                appendTo: this.elementRef.nativeElement.firstElementChild,

                // Listeners, will relay events
                listeners: {
                    catchAll(event) {
                        if (event.type === 'eventselectionchange') {
                            this.selectedEvent = event.selected.length ? event.selected[0].name : '';
                        }

                        this.onSchedulerEvents.emit(event);
                    },

                    thisObj: this
                },

                features: featureConfig
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

        this.schedulerInstance = new bryntum.scheduler.Scheduler(config);

        // load data
        this.url && this.http.get(this.url)
            .map(r => r.json())
            .subscribe(
                data => this.loadData(data),
                err => console.error(err)
            );
    }

    /**
     * Consumes json in format { resources: [], events: [] }
     * @param data
     */
    loadData(data): void {
        const engine = this.schedulerInstance;
        engine.resources = data.resources.rows;
        engine.events = data.events.rows;
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
            })
        }
    }

    removeEvent() {
        const scheduler = this.schedulerInstance;
        scheduler.eventStore.remove(scheduler.selectedEvents);
        this.selectedEvent = '';
    }

    addEvent() {
        const scheduler = this.schedulerInstance,
            startDate = new Date(scheduler.startDate.getTime()),
            endDate = new Date(startDate.getTime());

        endDate.setHours(endDate.getHours() + 1);

        scheduler.eventStore.add({
            resourceId: scheduler.resourceStore.first.id,
            startDate: startDate,
            endDate: endDate,
            name: 'New task',
            eventType: 'Meeting'
        })
    }
}
