/**
 * Scheduler config file
 */

// Bryntum umd lite bundle comes without polyfills to support Angular's zone.js
import { EventModel } from 'bryntum-scheduler/scheduler.lite.umd.js';

const schedulerConfig = {
    rowHeight         : 50,
    barMargin         : 4,
    eventColor        : 'indigo',
    startDate         : new Date(2025, 11, 1, 8),
    endDate           : new Date(2025, 11, 1, 18),
    resourceImagePath : 'assets/users/',
    columns           : [
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
    ],
    viewPreset : {
        base           : 'hourAndDay',
        tickWidth      : 20,
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
    },

    stripeFeature     : true,
    timeRangesFeature : true,
    eventMenuFeature  : {
        items : {
            // custom item with inline handler
            unassign : {
                text   : 'Unassign',
                icon   : 'b-fa b-fa-user-times',
                weight : 200,
                onItem : ({ eventRecord, resourceRecord }) => eventRecord.unassign(resourceRecord)
            }
        }
    },

    crudManager : {
        autoLoad   : true,
        eventStore : {
            modelClass   : EventModel,
            durationUnit : 'h'
        },
        transport : {
            load : {
                url : 'assets/data/data.json'
            }
        }
    }
};

export default schedulerConfig;
