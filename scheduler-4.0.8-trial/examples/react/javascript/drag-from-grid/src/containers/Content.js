/**
 * Content component
 */
// libraries
import React, { useEffect, useRef } from 'react';
// we import scheduler.umd for IE11 compatibility only. If you don't use IE import:
// import { Toast } from 'bryntum-scheduler';
import { Toast } from 'bryntum-scheduler/scheduler.umd';
import { BryntumScheduler } from 'bryntum-react-shared';

// our stuff
import 'bryntum-scheduler/scheduler.stockholm.css';
import TaskStore from '../lib/TaskStore.js';
import UnplannedGridComponent from '../components/UnplannedGrid.js';
import Drag from '../lib/Drag.js';

const Content = props => {

    // we need there refs for setting up dragging
    const
        scheduler = useRef(),
        grid = useRef(),
        // event store is needed by both scheduler and grid
        // so we create it before to be accessible by both
        eventStore = new TaskStore();

    // equivalent of componentDidMount
    useEffect(() => {

        eventStore.on({
            update : onEventStoreUpdate,
            add    : onEventStoreAdd
        });

        new Drag({
            grid         : grid.current.unplannedGrid,
            schedule     : scheduler.current.schedulerInstance,
            constrain    : false,
            outerElement : grid.current.unplannedGrid.element
        });

        Toast.show({
            timeout : 3500,
            html : 'Please note that this example uses the Bryntum Grid, which is licensed separately.'
        });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * @param {Event} record Event record
     * @param {TaskStore} eventStore Event store firing the event
     *
     * Reschedules the overlapping events if the button is pressed
     */
    const onEventStoreUpdate = ({ record, source : eventStore }) => {
        if (props.autoReschedule.current) {
            eventStore.rescheduleOverlappingTasks(record);
        }
    };

    /**
     * @param {Event[]} records Array of Event records
     * @param {TaskStore} eventStore Event store firing the event
     *
     * Reschedules the overlapping events if the button is pressed
     */
    const onEventStoreAdd = ({ records, source : eventStore }) => {
        if (props.autoReschedule.current) {
            records.forEach((eventRecord) => eventStore.rescheduleOverlappingTasks(eventRecord));
        }
    };

    return (
        <div id="main">
            <BryntumScheduler
                ref = {scheduler}
                id  = "schedulerComponent"

                stripeFeature           = {true}
                timeRangesFeature       = {true}
                eventMenuFeature = {{
                    items : {
                        // custom item with inline handler
                        unassign : {
                            text   : 'Unassign',
                            icon   : 'b-fa b-fa-user-times',
                            weight : 200,
                            onItem : ({ eventRecord, resourceRecord }) => eventRecord.unassign(resourceRecord)
                        }
                    }
                }}
                rowHeight  = {50}
                barMargin  = {4}
                eventColor = 'indigo'
                resourceImagePath = 'users/'

                columns = {[
                    {
                        type           : 'resourceInfo',
                        text           : 'Name',
                        width          : 200,
                        showEventCount : false,
                        showRole       : true
                    },
                    {
                        text     : 'Nbr tasks',
                        editor   : false,
                        renderer : data => `${data.record.events.length || ''}`,
                        align    : 'center',
                        sortable : (a, b) => a.events.length < b.events.length ? -1 : 1,
                        width    : 100
                    }
                ]}

                // Custom view preset with header configuration
                viewPreset = {{
                    base           : 'hourAndDay',
                    columnLinesFor : 0,
                    headers        : [
                        {
                            unit       : 'd',
                            align      : 'center',
                            dateFormat : 'ddd DD MMM'
                        },
                        {
                            unit       : 'h',
                            align      : 'center',
                            dateFormat : 'HH'
                        }
                    ]
                }}

                startDate   = {new Date(2025, 11, 1, 8)}
                endDate     = {new Date(2025, 11, 1, 18)}
                crudManager = {{
                    autoLoad   : true,
                    eventStore : eventStore,
                    transport  : {
                        load : {
                            url : 'data/data.json'
                        }
                    }
                }}
            />
            <UnplannedGridComponent
                ref        = { grid }
                eventStore = { eventStore }
            />
        </div>
    );
};

export default Content;
