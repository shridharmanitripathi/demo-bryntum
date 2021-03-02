/**
 * App component script
 */
import { Component, ViewChild } from '@angular/core';
import schedulerConfig from './schedulerConfig';
import { SchedulerComponent } from 'bryntum-angular-shared';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

    public schedulerConfig : any = schedulerConfig;

    @ViewChild('scheduler', { static:true }) scheduler: SchedulerComponent;

}
