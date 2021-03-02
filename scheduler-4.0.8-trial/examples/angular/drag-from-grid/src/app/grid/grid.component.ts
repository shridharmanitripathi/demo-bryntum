/**
 * Grid component script
 */
import { Component, OnInit, ElementRef, Input, OnDestroy, } from '@angular/core';

// Bryntum umd lite bundle comes without polyfills to support Angular's zone.js
import { Grid, EventStore, EventModel } from 'bryntum-scheduler/scheduler.lite.umd.js';

@Component({
    selector : 'app-grid',
    template : '<div class="grid-ct"></div>'
})

export class GridComponent implements OnInit, OnDestroy {

    // class properties
    private elementRef: ElementRef;
    public grid: any;

    // config options
    @Input() eventStore: EventStore;

    /**
     * Save our element
     * @param { ElementRef } element
     */
    constructor(element: ElementRef) {
        this.elementRef = element;
    }

    /**
     * Runs once on component init
     */
    ngOnInit() {
        const
            config = {
                appendTo   : this.elementRef.nativeElement.firstElementChild,
                eventStore : this.eventStore,
                store      : {
                    readUrl      : 'assets/data/unplanned.json',
                    autoLoad     : true,
                    modelClass   : EventModel,
                    durationUnit : 'h'
                },

                features : {
                    stripe : true,
                    sort   : 'name'
                },

                columns : [{
                    text       : 'Unassigned tasks',
                    flex       : 1,
                    field      : 'name',
                    htmlEncode : false,
                    renderer   : (data) => `<i class="${data.record.iconCls}"></i>${data.record.name}`
                }, {
                    text     : 'Duration',
                    width    : 100,
                    align    : 'right',
                    editor   : false,
                    field    : 'duration',
                    renderer : (data) => `${data.record.duration} ${data.record.durationUnit}`
                }],

                rowHeight : 50

            }
        ;

        this.grid = new Grid(config);

    }

    /**
     * Runs on component destroy.
     * Destroys the underlying grid
     */
    ngOnDestroy() {
        if (this.grid) {
            this.grid.destroy();
        }
    }

}


