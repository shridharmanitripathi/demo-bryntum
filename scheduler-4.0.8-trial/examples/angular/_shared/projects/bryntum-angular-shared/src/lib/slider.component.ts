/**
 * Angular wrapper for Bryntum Slider widget
 */
import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

// Bryntum umd lite bundle comes without polyfills to support Angular's zone.js
import { Slider, WidgetHelper } from 'bryntum-scheduler/scheduler.lite.umd.js';

@Component({
    selector : 'bry-slider',
    template : ''
})

export class SliderComponent implements OnInit, OnDestroy {

    /**
     * Saves element to have container to render the button to
     */
    constructor(element: ElementRef) {
        this.elementRef = element;
    }

    private elementRef: ElementRef;
    public slider: Slider;

    @Input() max: number = 100;
    @Input() min: number = 0;
    @Input() onChange: () => {};
    @Input() showTooltip: boolean;
    @Input() showValue: boolean;
    @Input() step: number = 5;
    @Input() text: string = 'Slider';
    @Input() value: number = 0;

    /**
     * Initializes component
     */
    ngOnInit() {
        this.slider = WidgetHelper.createWidget({
            type        : 'slider',
            appendTo    : this.elementRef.nativeElement,
            max         : this.max,
            min         : this.min,
            onChange    : this.onChange,
            showTooltip : this.showTooltip,
            showValue   : this.showValue,
            step        : this.step,
            text        : this.text,
            value       : this.value
        }) as Slider;
    }

    /**
     * Destroys component
     */
    ngOnDestroy() {
        if (this.slider) {
            this.slider.destroy();
        }
    }

}


