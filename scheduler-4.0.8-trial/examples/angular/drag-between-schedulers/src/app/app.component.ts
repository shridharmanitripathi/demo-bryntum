/**
 * App component script
 */
import { Component, AfterViewInit, ViewChild } from '@angular/core';
import scheduler1Config from './scheduler1Config';
import scheduler2Config from './scheduler2Config';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    scheduler1Config = scheduler1Config;
    scheduler2Config = scheduler2Config;

    @ViewChild('scheduler1', { static: true }) scheduler1 : any;

    /**
     * Handles zoom-in click event
     * @param event
     */
    onZoomIn = ({source : button}) => {
        this.scheduler1.schedulerInstance.zoomIn();
    }

    /**
     * Handles zoom-out click event
     * @param event
     */
    onZoomOut = ({source : button}) => {
        this.scheduler1.schedulerInstance.zoomOut();
    }

}
