/**
 * App component script file
 */
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { SchedulerComponent } from 'bryntum-angular-shared';
import schedulerConfig from './schedulerConfig';

// Bryntum umd lite bundle comes without polyfills to support Angular's zone.js
import { DateField, DateHelper } from 'bryntum-scheduler/scheduler.lite.umd.js';

@Component({
    selector    : 'app-root',
    templateUrl : './app.component.html',
    styleUrls   : ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

    schedulerConfig: any = schedulerConfig;
    barMargin: number = 10;

    @ViewChild(SchedulerComponent, { static : false }) scheduler: SchedulerComponent;
    @ViewChild('datePickerContainer', { static : false }) datePickerContainer: ElementRef;

    ngAfterViewInit() {
        new DateField({
            appendTo  : this.datePickerContainer.nativeElement,
            label     : 'Select date',
            width     : 220,
            value     : new Date(2018, 1, 7),
            editable  : false,
            cls       : 'b-bright',
            listeners : {
                change  : this.onDatePickerChange,
                thisObj : this
            }
        });

        // access the engine to reach the entire scheduler API, see API docs at /docs.
        // some small examples:
        //
        // 1. Sort resources by name
        // this.scheduler.schedulerInstance.resourceStore.sort('name');
        //
        // 2. Add a new event
        // this.scheduler.schedulerInstance.eventStore.add({ startDate : xx, endDate: xx, ... });
        //
        // 3. Change the color of the first event
        // this.scheduler.schedulerInstance.eventStore.first.eventColor = 'orange';
        //

    }

    // change scheduler start/end dates
    onDatePickerChange({ value }) {
        this.scheduler.schedulerInstance.setTimeSpan(DateHelper.add(value, 8, 'hour'), DateHelper.add(value, 18, 'hour'));
    }

    // add event button click handled here
    onAddEventClick() {
        this.scheduler.addEvent();
    }

    // remove event button click handled here
    onRemoveEventClick() {
        this.scheduler.removeEvent();
    }

    // Uncomment the code in this method to start "logging" events
    onSchedulerEvents(event: any) {
        // // catch scheduler events here, for example when dropping an event:
        // if (event.type === 'eventdrop') {
        //     console.log('Drop: ', event);
        // }

        // // or when editing one:
        // if (event.type === 'eventschange') {
        //     console.log('EventStore: ', event);
        // }

        // // or when editing a resource:
        // if (event.type === 'resourceschange') {
        //     console.log('ResourceStore: ', event);
        // }
    }

}

