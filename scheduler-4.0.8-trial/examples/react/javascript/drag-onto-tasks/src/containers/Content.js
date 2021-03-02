/**
 * Contains scheduler and equipment grid
 */
// libraries
import React, { useEffect } from 'react';
// we import scheduler.umd for IE11 compatibility only. If you don't use IE import:
// import { AjaxStore, EventStore, Toast } from 'bryntum-scheduler';
import { AjaxStore, EventStore, Toast } from 'bryntum-scheduler/scheduler.umd';

// our stuff
import Scheduler from '../components/Scheduler.js';
import Task from '../lib/Task.js';
import EquipmentGrid from '../lib/EquipmentGrid.js';

const Content = props => {

    // we need to pass these three down to scheduler
    const
        equipmentStore = new AjaxStore({
            modelClass : Task,
            readUrl    : 'data/equipment.json',
            sorters    : [
                { field : 'name', ascending : true }
            ]
        }),
        eventStore = new EventStore({
            modelClass : Task
        }),
        equipmentGrid = new EquipmentGrid({
            cls        : 'equipment',
            eventStore : eventStore,
            // Use a chained Store to avoid its filtering to interfere with Scheduler's rendering
            store      : equipmentStore.makeChained(() => true)
        })
    ;

    useEffect(() => {
        equipmentGrid.appendTo = 'content';
        equipmentGrid.render();

        Toast.show({
            timeout : 3500,
            html : 'Please note that this example uses the Bryntum Grid, which is licensed separately.'
        });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div id='content'>
            <Scheduler
                equipmentStore={equipmentStore}
                eventStore={eventStore}
                equipmentGrid={equipmentGrid}
            />
        </div>
    );

};

export default Content;
