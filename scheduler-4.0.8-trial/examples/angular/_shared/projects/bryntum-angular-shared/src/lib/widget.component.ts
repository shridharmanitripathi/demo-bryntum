/**
 * Angular wrapper for Bryntum Widget
 */
import { Component, OnInit, OnDestroy, ElementRef, Input, Output, EventEmitter } from '@angular/core';

// Bryntum umd lite bundle comes without polyfills to support Angular's zone.js
import { Widget, WidgetHelper } from 'bryntum-scheduler/scheduler.lite.umd.js';

@Component({
    selector : 'bry-widget',
    template : ''
})

export class WidgetComponent implements OnInit, OnDestroy {

    private elementRef: ElementRef;
    public widget: Widget;

    constructor(element: ElementRef) {
        this.elementRef = element;
    }

    @Input() config: any;
    @Output() onWidgetEvents = new EventEmitter<object>();

    /**
     * Create and append the underlying widget
     */
    ngOnInit(): void {
        const me = this;

        Object.assign(me.config, {
            appendTo  : me.elementRef.nativeElement,
            listeners : me.config.listeners || {
                catchAll(event: any) {
                    me.onWidgetEvents.emit(event);
                },
                thisObj : me
            }
        });

        // make the widget publicly available
        me.widget = WidgetHelper.createWidget(me.config) as Widget;
    }

    /**
     * Destroy the component
     */
    ngOnDestroy(): void {
        const me = this;
        if (me.widget && me.widget.destroy) {
            me.widget.destroy();
        }
    }

}
