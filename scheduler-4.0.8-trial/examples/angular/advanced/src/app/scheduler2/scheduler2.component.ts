/**
 * Scheduler 2 script file
 */
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import schedulerConfig from './scheduler2Config';
import { Router, Event, NavigationStart, NavigationEnd, ActivatedRoute } from '@angular/router';
import { SchedulerComponent } from 'bryntum-angular-shared'

@Component({
    selector: 'app-scheduler2',
    templateUrl: './scheduler2.component.html'
})
export class Scheduler2Component implements OnInit, OnDestroy {

    schedulerConfig : any = schedulerConfig;

    @ViewChild('scheduler2', { static:true }) scheduler: SchedulerComponent;

    constructor(
        public router: Router,
        public route : ActivatedRoute,
        public store : Store<{barMargin : {barMargin : number}}>
    ) {
    }

    ngOnInit() {
        console.log('initializing scheduler 2');

        const saveState = (event: Event) => {
            if (event instanceof NavigationStart) {
                if (this.router.isActive(this.route.routeConfig.path, true)) {
                    this.scheduler.schedulerInstance.storeScroll();
                }
            } else if (event instanceof NavigationEnd) {
                if (this.router.isActive(this.route.routeConfig.path, true)) {
                    this.scheduler.schedulerInstance.restoreScroll();
                }
            }
        }

        this.router.events.subscribe(saveState);
    }

    ngOnDestroy(): void {
        console.log('destroying scheduler2');
    }

}
