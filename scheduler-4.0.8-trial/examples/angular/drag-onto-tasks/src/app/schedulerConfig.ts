/**
 * Scheduler config
 */

// Bryntum umd lite bundle comes without polyfills to support Angular's zone.js
import { DateHelper } from 'bryntum-scheduler/scheduler.lite.umd.js';

export default {
    startDate : new Date(2017, 11, 1, 8),
    endDate   : new Date(2017, 11, 1, 18),

    timeRangesFeature : true,
    eventMenuFeature  : {
        items : [
            // custom item with inline handler
            {
                text   : 'Remove all equipment',
                icon   : 'b-fa b-fa-times',
                weight : 200,
                onItem : ({ eventRecord }) => eventRecord.equipment = []
            }
        ]
    },
    eventEditFeature : {
        // Add an extra combo box to the editor to select equipment
        items : {
            equipment : {
                type         : 'combo',
                editable     : false,
                multiSelect  : true,
                valueField   : 'id',
                displayField : 'name',
                name         : 'equipment',
                label        : 'Equipment',
                items        : []
            }
        }
    },

    rowHeight         : 100,
    barMargin         : 4,
    eventColor        : 'indigo',
    resourceImagePath : 'assets/users/',

    columns : [
        {
            type           : 'resourceInfo',
            text           : 'Name',
            width          : 200,
            showEventCount : false,
            showRole       : true
        }
    ],

    crudManager : {
        autoLoad   : true,
        eventStore : {
            durationUnit : 'h',
            equipment    : []
        },
        transport : {
            load : {
                url : 'assets/data/data.json'
            }
        }
    },

    viewPreset : {
        base           : 'hourAndDay',
        tickWidth      : 10,
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

    // Render some extra elements for the assignment equipment items
    eventBodyTemplate : data => `
        <div class="b-sch-event-header">${data.date} - ${data.name}</div>
        <ul class="b-sch-event-footer">
            ${data.equipment.map((item) => `<li title="${item.name}" class="${item.iconCls}"></li>`).join('')}
        </ul>
    `,

    eventRenderer({ eventRecord }) {
        return {
            date      : DateHelper.format(eventRecord.startDate, 'LT'),
            name      : eventRecord.name || '',
            equipment : this.equipmentStore ? eventRecord.equipment.map((itemId) => this.equipmentStore.getById(itemId) || {}) : []
        };
    }

};
