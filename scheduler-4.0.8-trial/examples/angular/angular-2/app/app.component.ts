import {Component, ViewChild} from '@angular/core';
import {SchedulerComponent} from './scheduler/scheduler.component';

@Component({
    selector: 'my-app',
    template: `
    <header class="demo-header">
      <h1><a href="../../#example-angular-angular-2">Angular 2 demo</a></h1>
          
      <div id="tools">
        <label class="sel-event">Selected event: <span>{{ scheduler.selectedEvent || 'None' }}</span></label>
    
        <div class="barmargin">
          <label>Barmargin:</label>
          <input min="0" max="15" type="number" [value]="barMargin" (input)="barMargin = $event.target.value-0">
        </div>
        <button (click)="onAddEventClick()">Add event</button>
        <button class="red" (click)="onRemoveEventClick()" [disabled]="scheduler.selectedEvent == ''">Remove event</button>
      </div>
    </header>
    
    <div id="app">

    
      <scheduler
        #scheduler
        url="data/data.json"
        [rowHeight]=50
        [minHeight]=150
        [barMargin]="barMargin"
        [events]="events"
        [resources]="resources"
        [startDate]="startDate"
        [endDate]="endDate"
        [columns]="columns"
        [resourceImagePath]="resourceImagePath"
      ></scheduler>
    
    </div>
    `,
    directives: [SchedulerComponent]
})

export class AppComponent {
    @ViewChild(SchedulerComponent) scheduler: SchedulerComponent;

    title      = 'Angular 2 demo';

    //bind properties from the application to the scheduler component
    rowHeight = 50;
    selectedEvent = '';
    events = [];
    resources = [];
    barMargin = 5;
    startDate = new Date(2018, 1, 7, 8);
    endDate = new Date(2018, 1, 7, 18);
    resourceImagePath = 'node_modules/bryntum-resources/images/users/';
    columns = [
        { type: 'resourceInfo', text: 'Staff', field: 'name' },
        {
            text: 'Type',
            field: 'role',
            width: 130,
            editor: {
                type: 'combo',
                items: ['Sales', 'Developer', 'Marketing', 'Product manager'],
                editable: false,
                pickerWidth: 140
            }
        }
    ];

    onAddEventClick() {
        this.scheduler.addEvent();
    }

    onRemoveEventClick() {
        this.scheduler.removeEvent();
    }
}
