/**
 * Scheduler config
 */
// we import scheduler.umd for IE11 compatibility only. If you don't use IE import:
// import { DateHelper } from 'bryntum-scheduler';
import { DateHelper } from 'bryntum-scheduler/scheduler.umd.js';

export default {
    eventStyle : 'colored',
    eventColor : null,
    resourceImagePath : 'users/',
    columns : [{
        type      : 'resourceInfo',
        text      : 'Staff',
        width     : 170
    }, {
        text   : 'Role',
        field  : 'role',
        width  : 140,
        editor : {
            type        : 'combo',
            items       : ['Sales', 'Developer', 'Marketing', 'Product manager'],
            editable    : false,
            pickerWidth : 140
        }
    }],
    filterBarFeature : true,
    stripeFeature : true,
    timeRangesFeature : true,
    eventEditFeature : {
        // Add extra widgets to the event editor
        items : {
            location : {
                type : 'text',
                name : 'location',
                label : 'Location',
                dataset : { eventType : 'Meeting' }
            }
        }
    },

    displayDateFormat: 'HH:mm',

    barMargin : 5,
    rowHeight : 55,

    startDate  : new Date(2017, 1, 7, 8),
    endDate    : new Date(2017, 1, 7, 18),
    viewPreset : 'hourAndDay',

    crudManager : {
        autoLoad : true,
        transport : {
            load : {
                url : 'data/data.json'
            }
        }
    },

    // Specialized body template with header and footer
    eventBodyTemplate : (data : any) => `
        <div class="b-sch-event-header">${data.headerText}</div>
        <div class="b-sch-event-footer">${data.footerText}</div>
    `,

    eventRenderer({ eventRecord, resourceRecord, renderData } : {eventRecord : any, resourceRecord : any, renderData : any}) : object {
        renderData.style = 'background-color:' + resourceRecord.color;

        return {
            headerText : DateHelper.format(eventRecord.startDate, this.displayDateFormat),
            footerText : eventRecord.name || ''
        };
    }

} // eo scheduler config

// eof
