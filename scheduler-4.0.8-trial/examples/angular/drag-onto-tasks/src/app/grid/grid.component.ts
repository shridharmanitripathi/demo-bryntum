/**
 * Grid component script
 */
import { Component, OnInit, ElementRef, Input, OnDestroy } from '@angular/core';

// Bryntum umd lite bundle comes without polyfills to support Angular's zone.js
import { Grid } from 'bryntum-scheduler/scheduler.lite.umd.js';

@Component({
    selector : 'app-grid',
    template : ''
})

export class GridComponent implements OnInit, OnDestroy {

    // class properties
    private elementRef: ElementRef;
    public grid: Grid;

    /**
     * Save our element
     */
    constructor(element: ElementRef) {
        this.elementRef = element;
    }

    ngOnInit() {
        const config = {
            appendTo : this.elementRef.nativeElement,
            features : {
                filterBar : true,
                cellEdit  : false
            },

            rowHeight : 100,

            columns : [{
                text       : '',
                field      : 'name',
                htmlEncode : false,
                cellCls    : 'b-equipment',
                renderer   : (data) => `<i class="${data.record.iconCls}"></i>${data.record.name}`
            }]
        };

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


