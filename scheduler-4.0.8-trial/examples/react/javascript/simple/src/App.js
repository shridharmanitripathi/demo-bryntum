/**
 * The App contains Header and Scheduler components and makes them to work together
 */

// React libraries
import React, { Fragment, useState, useRef, useCallback } from 'react';
import { PropTypes } from 'prop-types';

// Bryntum libraries
import { Toast } from 'bryntum-scheduler/scheduler.umd';

// Stylings
import 'bryntum-scheduler/scheduler.stockholm.css';
import 'bryntum-react-shared/resources/shared.scss';
import './App.scss';

// Application components
import Header from './components/Header';
import Scheduler from './components/Scheduler';

const App = props => {
    // State
    const [barMargin, setBarMargin] = useState(props.defaultBarMargin);
    const [selectedEvent, setSelectedEvent] = useState('');


    // Scheduler ref forwarded to Scheduler component
    const schedulerRef = useRef(null);

    // Handlers passed to Header an/or Scheduler
    /**
     * Show toast and set the selected event name.
     */
    const selectionChangeHandler = useCallback(({ selection }) => {
        const name = selection.length ? selection[0].name : '';
        Toast.show(
            name
                ? `You selected <b>${name}</b>`
                : 'All events are <b>deselected</b>'
        );
        setSelectedEvent(name);
    },[]);


    /**
     * Add an 1hr event for the first resource at the beginning of the scheduler
     */
    const addClickHandler = useCallback(event => {
        // Get the scheduler instance
        const scheduler = schedulerRef.current?.schedulerInstance;

        if (!scheduler) {
            console.warn('Could not get schedulerInstance');
            return;
        }

        // Get start and end date of the new event (1h duration)
        const
            startDate = new Date(scheduler.startDate.getTime()),
            endDate   = new Date(startDate.getTime());

        endDate.setHours(endDate.getHours() + 1);

        // Gdd the event to the store
        scheduler.eventStore.add({
            resourceId : scheduler.resourceStore.first.id,
            startDate  : startDate,
            endDate    : endDate,
            name       : 'New task',
            eventType  : 'Meeting'
        });
    },[schedulerRef]);


    /**
     * Remove the selected event
     */
    const removeClickHandler = useCallback(event => {
        // Get the scheduler instance
        const scheduler = schedulerRef.current?.schedulerInstance;

        if (!scheduler) {
            console.warn('Could not get schedulerInstance');
            return;
        }

        // Remove the selected event
        if (scheduler.selectedEvents) {
            scheduler.selectedEvents[0].remove();
        }

        setSelectedEvent('');
    }, [schedulerRef]);

    // Header configuration
    const headerConfig = {
        titleHref         : '../../../../#example-react-javascript-simple',
        barMargin,
        selectedEvent,
        onBarMarginChange : setBarMargin,
        onAddClick        : addClickHandler,
        onRemoveClick     : removeClickHandler
    };

    // Scheduler configuration
    const schedulerConfig = {
        barMargin,
        onEventSelectionChange : selectionChangeHandler
    };

    return (
        <Fragment>
            <Header {...headerConfig} />
            <Scheduler {...schedulerConfig} ref={schedulerRef} />
        </Fragment>
    );
};

App.propTypes = {
    defaultBarMargin : PropTypes.number
};

App.defaultProps = {
    defaultBarMargin : 5
};

export default App;
