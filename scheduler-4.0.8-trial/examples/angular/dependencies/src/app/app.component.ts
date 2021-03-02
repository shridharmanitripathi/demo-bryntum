/**
 * App component script
 */
import { Component } from '@angular/core';
import schedulerConfig from './schedulerConfig';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    schedulerConfig : any = schedulerConfig;
}

