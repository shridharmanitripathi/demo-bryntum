/**
 * Scheduler Component
 */

// React libraries
import React, { forwardRef } from 'react';
import { PropTypes } from 'prop-types';

// Bryntum libraries
import { BryntumScheduler } from 'bryntum-react-shared';

// Application components
import DemoButton from './DemoButton';
import DemoEditor from './DemoEditor';

// Scheduler component
const Scheduler = forwardRef((props, schedulerRef) => {
    // Turn events for important resources red + prefix with "Important"
    const eventRenderer = ({ eventRecord, resourceRecord, renderData }) => {
        let prefix = '';

        if (resourceRecord.important) {
            renderData.eventColor = 'red';
            prefix = 'Important ';
        }

        return prefix + eventRecord.name;
    };

    // Handlers
    /**
     * User clicked the "+1 hour" button on a resource
     */
    const handleDelayClick = record => {
        record.events.forEach(event => {
            // Move 1h forward in time
            event.startDate = new Date(
                event.startDate.getTime() + 1000 * 60 * 60
            );
        });
    };

    // Scheduler config
    const schedulerConfig = {
        startDate         : new Date(2017, 1, 7, 8),
        endDate           : new Date(2017, 1, 7, 18),
        resourceImagePath : 'users/',
        eventRenderer,

        crudManager: {
            autoLoad  : true,
            transport : {
                load: {
                    url : 'data/data.json'
                }
            }
        },

        columns: [
            {
                type  : 'resourceInfo',
                text  : 'Staff<div class="small-text">(React JSX)</div>',
                width : 130,
                // JSX as renderer
                renderer: ({ value }) => (
                    <div>
                        <b>{value}</b>
                    </div>
                )
            },
            {
                text  : 'Type',
                field : 'role',
                width : 130
            },
            {
                text   : 'Delay<div class="small-text">(React component)</div>',
                width  : 120,
                align  : 'center',
                editor : false,
                // Using custom React component
                renderer: ({ record }) => (
                    <DemoButton
                        text    = {'+1 hour'}
                        onClick = {() => handleDelayClick(record)}
                    />
                )
            },
            {
                text     : 'Important<div class="small-text">(React editor)</div>',
                field    : 'important',
                width    : 120,
                align    : 'center',
                editor   : ref => <DemoEditor ref={ref} />,
                renderer : ({ value }) => (value ? 'Yes' : 'No')
            }
        ]
    };

    return (
        <BryntumScheduler {...schedulerConfig} {...props} ref={schedulerRef} />
    );
});

Scheduler.propTypes = {
    barMargin              : PropTypes.number,
    onEventSelectionChange : PropTypes.func.isRequired
};

Scheduler.defaultProps = {
    barMargin: 5
};

export default Scheduler;
