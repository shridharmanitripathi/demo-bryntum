/**
 *- Contains Bryntum Scheduler
 */
// libraries
import React, { useEffect, useRef } from 'react';
// we import scheduler.umd for IE11 compatibility only. If you don't use IE import:
// import { Scheduler } from 'bryntum-scheduler';
import { Scheduler } from 'bryntum-scheduler/scheduler.umd';
import schedulerConfig from '../components/schedulerConfig.js';
import { connect } from 'react-redux';

const Content = props => {

    // refs
    const
        scheduler = useRef(),
        firstRun = useRef(true);

    // create scheduler (initial, run-once)
    useEffect(() => {
        scheduler.current = new Scheduler({
            ...schedulerConfig,
            appendTo : 'content'
        });
    }, []);

    // handles zoom level change
    useEffect(() => {
        if (!firstRun.current) {
            const method = props.zoomLevel >= scheduler.current.zoomLevel ? 'zoomIn' : 'zoomOut';
            scheduler.current[method]();
        }
        else {
            firstRun.current = false;
        }
    }, [props.zoomLevel]);

    // handles data change
    useEffect(() => {
        const data = props && props.data;

        if (data && data.events) {
            scheduler.current.eventStore.data = data.events.rows;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.data]);

    return (
        <div id='content'></div>
    ); // eo return

}; // eo function content

// maps Redux state to this component props
const mapStateToProps = state => {
    return {
        locale    : state.locale,
        zoomLevel : state.zoomLevel,
        data      : state.data
    };
}; // eo mapStateToProps

// connects to Redux and exports the component
export default connect(mapStateToProps)(Content);

// eof
