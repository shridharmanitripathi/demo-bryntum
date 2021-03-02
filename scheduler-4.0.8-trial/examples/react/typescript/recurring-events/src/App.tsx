/**
 * Main App file
 */
import React from 'react';

// our libraries
import { BryntumScheduler } from 'bryntum-react-shared';
// we import scheduler.umd for IE11 compatibility only. If you don't use IE import:

// global css
import 'bryntum-scheduler/scheduler.stockholm.css';
import 'bryntum-react-shared/resources/shared.scss';

// application scss
import './App.scss';

// application files
import Header from './Header';
import { schedulerConfig } from './schedulerConfig';

const App: React.FC = () => {

    return (
        <React.Fragment>
            <Header />
            <BryntumScheduler
                rowHeight              = {schedulerConfig.rowHeight}
                sortFeature            = {schedulerConfig.features.sort}
                eventTooltipFeature    = {schedulerConfig.features.eventTooltip}
                enableRecurringEvents  = {schedulerConfig.enableRecurringEvents}
                labelsFeature          = {schedulerConfig.features.labels}
                columns                = {schedulerConfig.columnLines}
                crudManager            = {schedulerConfig.crudManager}
                startDate              = {schedulerConfig.startDate}
                endDate                = {schedulerConfig.endDate}
                viewPreset             = {schedulerConfig.viewPreset}
                eventRenderer          = {schedulerConfig.eventRenderer}
            />
        </React.Fragment>
    );
}

export default App;

