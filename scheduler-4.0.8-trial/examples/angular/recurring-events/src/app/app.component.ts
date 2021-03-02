import { Component } from '@angular/core';
import { schedulerConfig } from './schedulerConfig';

// Bryntum umd lite bundle comes without polyfills to support Angular's zone.js
import { SchedulerConfig } from 'bryntum-scheduler/scheduler.lite.umd.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  schedulerConfig: Partial<SchedulerConfig> = schedulerConfig;
}
