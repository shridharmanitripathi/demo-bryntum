import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {NgModel} from '@angular/forms';
import {SchedulerComponent} from './scheduler/scheduler.component';
import {HttpClient} from '@angular/common/http';

declare var window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  @ViewChild(SchedulerComponent) scheduler: SchedulerComponent;

  // bind properties from the application to the scheduler component
  rowHeight         = 50;
  selectedEvent     = '';
  events            = [];
  resources         = [];
  timeRanges        = true;
  barMargin         = 10;
  startDate         = new Date(2018, 1, 7, 8);
  endDate           = new Date(2018, 1, 7, 22);
  eventColor        = 'green';
  eventStyle        = 'border';
  resourceImagePath = 'assets/users/';

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

  eventEdit = {
      // Add extra widgets to the event editor
      items : {
          description : {
              type  : 'text',
              name  : 'desc',
              label : 'Description'
          }
      }
  };

  eventRenderer = ({eventRecord}) => {
    return `
        <div class="info">
            <div class="name">${eventRecord.name}</div>
            <div class="desc">${eventRecord.desc}</div>
        </div>
      `;
  };

  constructor(private http: HttpClient) {
    this.getData();
  }

  ngAfterViewInit() {
    // exposing scheduling engine to be easily accessible from console
    window.scheduler = this.scheduler.schedulerInstance;

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

  onSchedulerEvents(event: any) {
    // Uncomment this to log scheduler events to console
    // if (event.type === 'eventdrop') {
    //   console.log('Drop: ', event);
    // }
    //
    // if (event.type === 'eventschange') {
    //   console.log('EventStore: ', event);
    // }
    //
    // if (event.type === 'resourceschange') {
    //   console.log('ResourceStore: ', event);
    // }
  }

  // add event button click handled here
  onAddEventClick() {
    this.scheduler.addEvent();
  }

  // remove event button click handled here
  onRemoveEventClick() {
    this.scheduler.removeEvent();
  }

}
