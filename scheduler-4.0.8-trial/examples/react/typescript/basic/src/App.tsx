import * as React from 'react';

import { BryntumScheduler } from 'bryntum-react-shared';
import { TimeSpan } from 'bryntum-scheduler/scheduler.umd.js';

import 'bryntum-scheduler/scheduler.stockholm.css';

export default class App extends React.Component {
    state = {
        barMargin        : 5,
        selectedEvent    : '',
        eventsVersion    : 0,
        resourcesVersion : 0,
        events           : null,
        resources        : null,
        timeRanges       : null
    };

    refs!: {
        scheduler : typeof BryntumScheduler;
    };

    handleBarMarginChange = (event: any) => {
        this.setState({ barMargin: parseInt(event.target.value) });
    };

    handleAddClick = () => {
        const scheduler = this.refs.scheduler.schedulerEngine,
              startDate = new Date(scheduler.startDate.getTime()),
              endDate   = new Date(startDate.getTime());

        endDate.setHours(endDate.getHours() + 1);

        scheduler.eventStore.add({
            resourceId : scheduler.resourceStore.first.id,
            startDate  : startDate,
            endDate    : endDate,
            name       : 'New task',
            eventType  : 'Meeting'
        });
    };

    handleRemoveClick = () => {
        const schedulerEngine = this.refs.scheduler.schedulerEngine;
        // Remove selected event from the scheduler
        schedulerEngine.selectedEvents &&
            schedulerEngine.selectedEvents[0].remove();

        this.setState({ selectedEvent: '' });
    };

    handleSelectionChange = ({ selected }: { selected: any }) => {
        this.setState({
            selectedEvent : (selected.length && selected[0].name) || ''
        });
    };

    componentDidMount() {
        fetch('data/data.json').then(response => {
            response.json().then(data => {
                this.setState({
                    // Increment these to notify BryntumScheduler that it should process events/resources
                    eventsVersion    : 1,
                    resourcesVersion : 1,

                    events     : data.events.rows,
                    resources  : data.resources.rows,
                    timeRanges : data.timeRanges.rows
                });
            });
        });
    }

    render() {
        return (
            <div className = "outer">
                <header>
                    <h1>
                        <a id="title" href="../../../../#example-react-typescript-basic">React + TypeScript basic demo</a>
                    </h1>

                    <label className = "selected-event">
                        Selected event : {' '}
                        <span>
                            {this.state.selectedEvent || 'None'}
                        </span>
                    </label>

                    <div className = "barmargin">
                        <label>Barmargin : </label>
                        <input
                            min      = "0"
                            max      = "10"
                            type     = "number"
                            value    = {this.state.barMargin}
                            onChange = {this.handleBarMarginChange}
                        />
                    </div>

                    <button onClick   = {this.handleAddClick}>
                    <i      className = "b-fa b-fa-plus" />
                    </button>
                    <button
                        disabled  = {this.state.selectedEvent === ''}
                        className = "red"
                        onClick   = {this.handleRemoveClick}
                    >
                        <i className = "b-fa b-fa-trash" />
                    </button>
                </header>

                <BryntumScheduler
                    ref = {'scheduler'}
                    // Make grid grow to fit rows
                    autoHeight = {true}
                    // Initial row height
                    barMargin        = {this.state.barMargin}
                    eventsVersion    = {this.state.eventsVersion}
                    resourcesVersion = {this.state.resourcesVersion}
                    events           = {this.state.events}
                    resources        = {this.state.resources}
                    timeRanges       = {{
                        store: {
                            modelClass : TimeSpan,
                            storeId    : 'timeRanges',
                            data       : this.state.timeRanges
                        }
                    }}
                    startDate = {new Date(2018, 1, 7, 8)}
                    endDate   = {new Date(2018, 1, 7, 22)}
                    resourceImagePath = {'users/'}
                // Columns in scheduler
                    columns={[
                        {
                            type      : 'resourceInfo',
                            text      : 'Staff',
                            showImage : true,
                            width     : 130
                        },
                        {
                            text  : 'Type',
                            field : 'role',
                            width : 130
                        }
                    ]}
                    onEventSelectionChange={
                        this.handleSelectionChange
                    }
                />
            </div>
        );
    }
}
