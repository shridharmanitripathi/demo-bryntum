/* tslint:disable:no-string-literal */
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { SchedulerComponent } from 'bryntum-angular-shared';
import { HttpClient } from '@angular/common/http';

// Bryntum umd lite bundle comes without polyfills to support Angular's zone.js
import { DateField, DateHelper } from 'bryntum-scheduler/scheduler.lite.umd.js';

declare var window: any;

@Component({
    selector    : 'app-root',
    templateUrl : './app.component.html',
    styleUrls   : ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

    @ViewChild(SchedulerComponent) scheduler: SchedulerComponent;
    @ViewChild('datePickerContainer') datePickerContainer: ElementRef;

    // bind properties from the application to the scheduler component
    rowHeight = 60;
    selectedEvent = '';
    events = [];
    resources = [];
    timeRanges = [];
    timeRangesFeature = true;
    barMargin = 10;
    startDate = new Date(2018, 1, 7, 8);
    endDate = new Date(2018, 1, 7, 22);
    eventColor = 'green';
    eventStyle = 'border';
    resourceImagePath = 'assets/users/';

    columns = [
        { type : 'resourceInfo', text : 'Staff', field : 'name' },
        {
            text   : 'Type',
            field  : 'role',
            width  : 130,
            editor : {
                type        : 'combo',
                items       : ['Sales', 'Developer', 'Marketing', 'Product manager'],
                editable    : false,
                pickerWidth : 140
            }
        }
    ];

    eventEditFeature = {
        // Add extra widgets to the event editor
        items : {
            description : {
                type  : 'text',
                name  : 'desc',
                label : 'Description'
            }
        }
    };

    eventRenderer = ({ eventRecord }) => {
        return `
        <div class="info">
            <div class="name">${eventRecord.name}</div>
            <div class="desc">${eventRecord.desc}</div>
        </div>
      `;
    }

    constructor(private http: HttpClient) {
        this.getData();
    }

    ngAfterViewInit() {
        // exposing scheduling engine to be easily accessible from console
        window.scheduler = this.scheduler.schedulerInstance;

        const field = new DateField({
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

    // fetch data for the scheduler
    getData() {
        const me = this;

        me.http.get('./assets/data/data.json').subscribe(data => {
            me.resources = data['resources'].rows;
            me.events = data['events'].rows;
            me.timeRanges = data['timeRanges'].rows;
        });
    }

    // Uncomment the code in this method to start "logging" events
    onSchedulerEvents(event: any) {
        //   // catch scheduler events here, for example when dropping an event:
        //   if (event.type === 'eventdrop') {
        //     console.log('Drop: ', event);
        //   }
        //
        //   // or when editing one:
        //   if (event.type === 'eventschange') {
        //     console.log('EventStore: ', event);
        //   }
        //
        //   // or when editing a resource:
        //   if (event.type === 'resourceschange') {
        //     console.log('ResourceStore: ', event);
        //   }
    }

    // add event button click handled here
    onAddEventClick() {
        this.scheduler.addEvent();
    }

    // remove event button click handled here
    onRemoveEventClick() {
        this.scheduler.removeEvent();
    }

    // change scheduler start/end dates
    onDatePickerChange({ value }) {
        this.scheduler.schedulerInstance.setTimeSpan(DateHelper.add(value, 8, 'hour'), DateHelper.add(value, 18, 'hour'));
    }

}
