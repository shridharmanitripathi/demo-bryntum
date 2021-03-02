/**
 *- Filtering App file
 */
// react
import React, { Fragment, useRef } from 'react'

// our libraries
import { BryntumScheduler } from 'bryntum-react-shared';
// we import scheduler.umd for IE11 compatibility only. If you don't use IE import:
// import { DomClassList } from 'bryntum-scheduler';
import { DomClassList } from 'bryntum-scheduler/scheduler.umd';

// global css
import 'bryntum-scheduler/scheduler.stockholm.css';
import 'bryntum-react-shared/resources/shared.scss';

// application scss
import './App.scss';

// application files
import Header from './Header';
import schedulerConfig from './schedulerConfig';

const app = props => {
    // eslint-disable-next-line
    const scheduler = useRef(null);

    // runs when value in the filter input field changes and filters the eventStore
    const filterChangeHandler = ({ value }) => {
        const eventStore = scheduler.current.schedulerInstance.eventStore;

        value = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        eventStore.filter({
            filters : event => event.name.match(new RegExp(value, 'i')),
            replace : true
        });
    }; // eo function filterChangeHandler

    // runs when value in the highlight input field changes and highlights the matched events
    const highlightChangeHandler = ({ value }) => {
        const engine = scheduler.current.schedulerInstance;

        engine.eventStore.forEach(task => {
            const taskClassList = new DomClassList(task.cls);

            if (value !== '' && task.name.toLowerCase().includes(value)) {
                taskClassList.add('b-match');
            }
            else {
                taskClassList.remove('b-match');
            }

            task.cls = taskClassList.value;
        });

        engine.element.classList[value.length > 0 ? 'add' : 'remove']('b-highlighting');
    }; // eo function highlightChangeHandler

    return (
        <Fragment>
            <Header
                onFilterChange = {filterChangeHandler}
                onHighlightChange = {highlightChangeHandler}
            ></Header>
            <BryntumScheduler
                ref               = {scheduler}
                barMargin         = {schedulerConfig.barMargin}
                columns           = {schedulerConfig.columns}
                crudManager       = {schedulerConfig.crudManager}
                eventBodyTemplate = {schedulerConfig.eventBodyTemplate}
                eventColor        = {schedulerConfig.eventColor}
                eventStyle        = {schedulerConfig.eventStyle}
                eventRenderer     = {schedulerConfig.eventRenderer}
                rowHeight         = {schedulerConfig.rowHeight}
                startDate         = {schedulerConfig.startDate}
                endDate           = {schedulerConfig.endDate}
                eventEditFeature  = {schedulerConfig.eventEditFeature}
                filterBarFeature  = {schedulerConfig.filterBarFeature}
                stripeFeature     = {schedulerConfig.stripeFeature}
                timeRangesFeature = {schedulerConfig.timeRangesFeature}
                resourceImagePath = {schedulerConfig.resourceImagePath}
            ></BryntumScheduler>
        </Fragment>
    );

}; // eo function app

export default app;

// eof
