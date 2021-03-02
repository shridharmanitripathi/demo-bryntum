/**
 * app component script
 */
import { Component, ViewChild } from '@angular/core';
import {SchedulerComponent} from 'bryntum-angular-shared';
import schedulerConfig from './schedulerConfig';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    schedulerConfig: any = schedulerConfig;

    @ViewChild(SchedulerComponent, { static: true}) scheduler: SchedulerComponent;

    onExportClick() {
        this.scheduler.schedulerInstance.features.pdfExport.showExportDialog();
    }
}


