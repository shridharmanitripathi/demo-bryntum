import {Component, ViewChild} from '@angular/core';
import {NgModel} from '@angular/forms';
import {SchedulerComponent} from "./scheduler/scheduler.component";
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild(SchedulerComponent) scheduler: SchedulerComponent;

  //bind properties from the application to the scheduler component
  rowHeight = 50;
  selectedEvent = '';
  events = [];
  resources = [];
  timeRanges = [];
  barMargin = 5;
  startDate = new Date(2018, 1, 7, 8);
  endDate = new Date(2018, 1, 7, 22);
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

  constructor(private http: HttpClient) {
    this.getData();
  }

  //fetch data for the scheduler
  getData() {

    let me = this;

    me.http.get('./assets/data/data.json').subscribe(data => {
      me.resources = data['resources'].rows;
      me.events = data['events'].rows;
      me.timeRanges = data['timeRanges'].rows;
    });
  }

  onSchedulerEvents(event) {
    //catch scheduler event here
  }

  //add event button click handled here
  onAddEventClick() {
    this.scheduler.addEvent();
  }

  //remove event button click handled here
  onRemoveEventClick() {
    this.scheduler.removeEvent();
  }

}
