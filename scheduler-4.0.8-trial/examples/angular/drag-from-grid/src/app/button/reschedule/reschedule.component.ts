/**
 * Angular wrapper for Bryntum Reschedule button
 */
import { Component, OnInit, OnDestroy, ElementRef, EventEmitter, Output, Input } from '@angular/core';

// Bryntum umd lite bundle comes without polyfills to support Angular's zone.js
import { WidgetHelper } from 'bryntum-scheduler/scheduler.lite.umd.js';

@Component({
    selector : 'button-reschedule',
    template : ''
})
export class RescheduleComponent implements OnInit, OnDestroy {

    // class variables
    private elementRef: ElementRef;
    private button: any;

    @Input() pressed: boolean = false;
    @Output() toggle: EventEmitter<boolean> = new EventEmitter();

    /**
     * Saves element to have container to render the button to
     * @param { ElementRef } element
     */
    constructor(element: ElementRef) {
        this.elementRef = element;
    }

    /**
     * Runs once on component init. Creates and renders Bryntum Button
     */
    ngOnInit() {
        const button = WidgetHelper.createWidget({
            type       : 'button',
            appendTo   : this.elementRef.nativeElement,
            toggleable : true,
            color      : 'b-blue b-raised',
            icon       : 'b-fa b-fa-calendar',
            tooltip    : 'Toggles whether to automatically reschedule overlapping tasks',
            cls        : 'reschedule-button',
            pressed    : this.pressed,
            onClick    : ({ source : button }) => {
                this.pressed = button.pressed;
                this.toggle.emit(button.pressed);
            }
        });

        this.button = button;

    }

    /**
     * Destroys the Bryntum button
     */
    ngOnDestroy() {
        if (this.button) {
            this.button.destroy();
        }
    }

}
