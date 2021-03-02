/**
 * App component script
 */
import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import schedulerConfig from './schedulerConfig';
import { SchedulerComponent } from 'bryntum-angular-shared';

// Bryntum umd lite bundle comes without polyfills to support Angular's zone.js
import { Menu, DateHelper } from 'bryntum-scheduler/scheduler.lite.umd.js';
import TaskModel from './lib/TaskModel';

@Component({
    selector    : 'app-root',
    templateUrl : './app.component.html',
    styleUrls   : ['./app.component.scss']
})

export class AppComponent implements OnInit, AfterViewInit {

    public schedulerConfig = schedulerConfig;
    private styleNode: HTMLStyleElement = document.createElement('style');

    @ViewChild('scheduler', { static:true }) scheduler: SchedulerComponent;

    /**
     * Runs after the view (including the child scheduler) is initializes
     */
    ngAfterViewInit() {
        this.setAnimationDuration(600);
    }

    /**
     * Runs on this component initialization
     */
    ngOnInit() {
        document.head.appendChild(this.styleNode);
    }

    /**
     * Sets the duration of animation.
     */
    setAnimationDuration(value: number) {
        this.scheduler.schedulerInstance.transitionDuration = value;
        this.styleNode.innerHTML = `.b-grid-row,.b-sch-event-wrap { transition-duration: ${value / 1000}s !important; }`;
    }

    /**
     * Initial animation button click handler
     */
    onInitialAnimation = ({ source }) => {
        const scheduler = this.scheduler.schedulerInstance;

        function play(animation: any) {
            scheduler.restartInitialAnimation(animation);
        }

        const menu = new Menu({
            forElement  : source.element,
            closeAction : 'destroy',
            width       : source.element.offsetWidth,
            items       : [
                {
                    text     : 'Fade in',
                    icon     : 'b-fa b-fa-play',
                    disabled : scheduler.useInitialAnimation === 'fade-in',
                    onItem   : () => play('fade-in')
                },
                {
                    text     : 'Slide from left',
                    icon     : 'b-fa b-fa-play',
                    disabled : scheduler.useInitialAnimation === 'slide-from-left',
                    onItem   : () => play('slide-from-left')
                },
                {
                    text     : 'Slide from top',
                    icon     : 'b-fa b-fa-play',
                    disabled : scheduler.useInitialAnimation === 'slide-from-top',
                    onItem   : () => play('slide-from-top')
                },
                {
                    text     : 'Zoom in',
                    icon     : 'b-fa b-fa-play',
                    disabled : scheduler.useInitialAnimation === 'zoom-in',
                    onItem   : () => play('zoom-in')
                },
                {
                    text     : 'Custom',
                    icon     : 'b-fa b-fa-play',
                    cls      : 'b-separator',
                    disabled : scheduler.useInitialAnimation === 'custom',
                    onItem   : () => play('custom')
                }
            ],
            listeners   : {
                destroy() {
                    source.pressed = false;
                }
            }
        });
    }

    /**
     * Random update button click handler
     */
    onRandomUpdate = ({ source : button }) => {
        const
            scheduler = this.scheduler.schedulerInstance,
            eventStore = scheduler.eventStore,
            indices = [],
            nbrToAnimate = Math.min(eventStore.count, 4);

        // Grab a bunch of random events to change
        while (indices.length < nbrToAnimate) {
            const index = Math.floor(Math.random() * eventStore.count);

            if (!indices.includes(index)) {
                indices.push(index);
            }
        }
        indices.forEach((index) => {
            const ev: any = eventStore.getAt(index);

            if (ev) {
                ev.beginBatch();
                ev.resourceId = (scheduler.resourceStore.indexOf(ev.resource) + 2) % 8 + 1;
                ev.setStartDate(DateHelper.add(ev.startDate, ev.startDate.getHours() % 2 ? 1 : -1, 'hour'), true);
                ev.endBatch();
            }
        });

    }

    /**
     * After lunch button click handler. Moves all meetings after lunch.
     */
    onAfterLunch = () => {
        const
            scheduler = this.scheduler.schedulerInstance,
            eventStore = scheduler.eventStore,
            lunchFinishTime = scheduler.features.timeRanges.store.getById('lunch').endDate;

        eventStore.query((task: TaskModel) => task.eventType === 'Meeting')
            .forEach((task: TaskModel) => task.startDate = DateHelper.max(task.startDate as Date, lunchFinishTime));

    }

    /**
     * Max 1 hr button click handler. Resizes all Meeting to be max 1 hr long.
     */
    onMaxHour = () => {
        const scheduler = this.scheduler.schedulerInstance;
        scheduler.eventStore.query((task: TaskModel) => task.eventType === 'Meeting')
            .forEach((task: TaskModel) => task.duration = Math.min(task.duration, 1));
    }

    /**
     * Duration slider change handler
     */
    onDurationChange = ({ source : slider }) => {
        this.setAnimationDuration(slider.value);
    }

}


