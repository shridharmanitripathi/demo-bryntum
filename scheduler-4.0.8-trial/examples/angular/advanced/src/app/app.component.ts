/**
 * Angular app component script
 */
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as AppActions from './store/app.actions';

// Bryntum umd lite bundle comes without polyfills to support Angular's zone.js
import { Tooltip } from 'bryntum-scheduler/scheduler.lite.umd.js';

@Component({
    selector    : 'app-root',
    templateUrl : './app.component.html',
    styleUrls   : ['./app.component.scss']
})

export class AppComponent implements OnInit {

    // button pressed flags (for initialization only)
    isPressed1: boolean = true;
    isPressed2: boolean = false;

    // store slice observable
    barMargin: Observable<{ barMargin: number }>

    // Reference to bar margin input field needed for tooltip installation
    @ViewChild('barMarginField', { static : true }) barMarginField: ElementRef;

    // inject router and store
    constructor(
        public router: Router,
        public store: Store<{ barMargin: { barMargin: number } }>
    ) {
    }

    onBarMarginChange = (value: string): void => {
        this.store.dispatch(new AppActions.BarMarginChange(parseInt(value, 10)));
    }

    ngOnInit(): void {

        // Get barMargin Observable from the store
        this.barMargin = this.store.select('barMargin');

        // create tooltip for bar margin input field
        new Tooltip({
            forElement  : this.barMarginField.nativeElement,
            showOnHover : true,
            html        : 'The Bar Margin is shared by both<br/>schedulers and managed by NgRx'
        });

        // we need to set one of the buttons pressed on app start
        // depending on what is the current url
        const setPressed = (event: Event) => {
            if (event instanceof NavigationEnd) {
                if ('/' === event.url || '/scheduler1' === event.url) {
                    this.isPressed1 = true;
                } else if ('/scheduler2' === event.url) {
                    this.isPressed2 = true;
                }
                // we do not need to keep subscribed after first run
                subscription.unsubscribe();
            }
        };

        // needed to be able to unsubscribe after the first run
        const subscription = this.router.events.subscribe(setPressed);

    }

}


