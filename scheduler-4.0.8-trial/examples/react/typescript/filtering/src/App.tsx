/**
 *- Main App file
 */
import React from 'react';

// our libraries
import { BryntumScheduler } from 'bryntum-react-shared';
// we import scheduler.umd for IE11 compatibility only. If you don't use IE import:
// import { DomClassList } from 'bryntum-scheduler';
import { DomClassList, EventModel } from 'bryntum-scheduler/scheduler.umd.js';

// global css
import 'bryntum-scheduler/scheduler.stockholm.css';
import 'bryntum-react-shared/resources/shared.scss';

// application scss
import './App.scss';

// application files
import Header from './Header';
import schedulerConfig from './schedulerConfig';

const App: React.FC = () => {

    const scheduler : any = React.useRef(null);

    // runs when value in the filter input field changes and filters the eventStore
    const filterChangeHandler = ({ value }:{value: string}) => {
        const eventStore = scheduler.current.schedulerInstance.eventStore;

        // Replace previous filtering fn with a new filter
        eventStore.filter({
            filters : (event : EventModel) => event.name.match(new RegExp(value, 'i')),
            replace : true
        });

    };

    // runs when value in the highlight input field changes and highlights the matched events
    const highlightChangeHandler = ({ value } : {value : string}) => {
        const engine = scheduler.current.schedulerInstance;

        engine.eventStore.forEach((task : any) => {
            const taskClassList = new DomClassList(task.cls),
                matched = taskClassList.contains('b-match');

            if (task.name.toLowerCase().indexOf(value) >= 0) {
                if (!matched) {
                    taskClassList.add('b-match');
                }
            }
            else if (matched) {
                taskClassList.remove('b-match');
            }
            task.cls = taskClassList.value;
        });
        engine.element.classList[value.length > 0 ? 'add' : 'remove']('b-highlighting');

    };

    return (
        <React.Fragment>
            <Header
                onFilterChange={filterChangeHandler}
                onHighlightChange={highlightChangeHandler}
            />
            <BryntumScheduler
                ref = {scheduler}
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
            />
        </React.Fragment>
    );
}

export default App;
