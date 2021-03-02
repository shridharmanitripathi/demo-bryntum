/**
 *- Main component
 */
// libraries
import React, { Component } from 'react';
import { BryntumScheduler } from 'bryntum-react-shared';
// we import scheduler.umd for IE11 compatibility only. If you don't use IE import:
// import {Scheduler, DateHelper, StringHelper} from 'bryntum-scheduler';
import { Scheduler, DateHelper, StringHelper } from 'bryntum-scheduler/scheduler.umd';

// our stuff
import Header from '../components/Header.js';
import 'bryntum-scheduler/scheduler.stockholm.css';
import Aux from '../hoc/ReactAux.js';

class Main extends Component {

    /**
     * Prepares styleNode in the document head that is
     * later used to configure the animation duration.
     */
    componentDidMount() {
        const styleNode = document.createElement('style');
        document.head.appendChild(styleNode);
        this.styleNode = styleNode;
        this.setAnimationDuration({ value : 600 });
    } // eo function componentDidMount

    /**
     * Sets the animation duration both in scheduler and in
     * the page head in styleNode
     */
    setAnimationDuration = ({ value }) => {
        this.refs.scheduler.schedulerInstance.transitionDuration = value;
        this.styleNode.innerHTML = `.b-grid-row,.b-sch-event-wrap { transition-duration: ${value / 1000}s !important; }`;
    }; // eo function setAnimationDuration

    /**
     * Reshuffles some events randomly.
     */
    randomClickHandler = () => {
        const
            scheduler = this.refs.scheduler.schedulerInstance,
            eventStore = scheduler.eventStore,
            indices = [];

        // Grab a bunch of random events to change
        while (indices.length < 4) {
            const index = Math.floor(Math.random() * eventStore.count);

            if (!indices.includes(index)) {
                indices.push(index);
            }
        }
        indices.forEach((index) => {
            const ev = eventStore.getAt(index);

            if (ev) {
                ev.beginBatch();
                ev.resourceId = (scheduler.resourceStore.indexOf(ev.resource) + 2) % 8 + 1;
                ev.setStartDate(DateHelper.add(ev.startDate, ev.startDate.getHours() % 2 ? 1 : -1, 'hour'), true);
                ev.endBatch();
            }
        });
    }; // eo function randomClickHandler

    /**
     * Resizes some events to be max 1 hour long.
     */
    maxClickHandler = () => {
        this.refs.scheduler.schedulerInstance.eventStore.query((task) => task.eventType === 'Meeting').forEach((task) => task.duration = Math.min(task.duration, 1));
    }; // eo function onMaxClick

    /**
     * Moves some events to after lunch time.
     */
    moveClickHandler = () => {
        const
            scheduler = this.refs.scheduler,
            eventStore = scheduler.schedulerInstance.eventStore,
            lunchFinishTime = scheduler.timeRangesFeature.store.getById('lunch').endDate
        ;
        eventStore.query((task) => task.eventType === 'Meeting').forEach((task) => task.startDate = DateHelper.max(task.startDate, lunchFinishTime));
    }; // eo function moveClickHandler

    render() {
        return (
            <Aux>
                <Header
                    title          = 'React animation demo'
                    titleHref      = '../../../../#example-react-javascript-animations'
                    onSliderChange = {this.setAnimationDuration}
                    onMaxClick     = {this.maxClickHandler}
                    onMoveClick    = {this.moveClickHandler}
                    onRandomClick  = {this.randomClickHandler}
                />
                <BryntumScheduler
                    ref = {'scheduler'}

                    height = "100vh"

                    eventColor        = {null}
                    timeRangesFeature = {true}

                    barMargin = {1}
                    rowHeight = {50}

                    startDate = {new Date(2017, 1, 7, 8)}
                    endDate   = {new Date(2017, 1, 7, 18)}

                    viewPreset          = 'hourAndDay'
                    useInitialAnimation = 'slide-from-left'
                    resourceImagePath   = 'users/'

                    crudManager={{
                        autoLoad  : true,
                        transport : {
                            load : {
                                url : 'data/data.json'
                            }
                        }
                    }}

                    // Columns in scheduler
                    columns = {[
                        { type : 'resourceInfo', text : 'Staff', field : 'name', width : 150 },
                        {
                            text       : 'Task color',
                            field      : 'eventColor',
                            width      : 90,
                            htmlEncode : false,
                            renderer   : ({ record }) => `<div class="color-box b-sch-${record.eventColor}"></div>${StringHelper.capitalize(record.eventColor)}`,
                            editor     : {
                                type        : 'combo',
                                items       : Scheduler.eventColors,
                                editable    : false,
                                listItemTpl : item => `<div class="color-box b-sch-${item.value}"></div><div>${item.value}</div>`
                            }
                        }
                    ]}
                /> {/* eo BryntumScheduler */}
            </Aux>
        ); // eo return
    } // eo function render
} // eo class Main

export default Main;

// eof
