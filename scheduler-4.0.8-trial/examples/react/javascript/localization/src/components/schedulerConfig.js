/**
 *- Scheduler config file
 */
// we import scheduler.umd for IE11 compatibility only. If you don't use IE import:
// import { Scheduler, StringHelper } from 'bryntum-scheduler';
import { Scheduler, StringHelper } from 'bryntum-scheduler/scheduler.umd';

export default {

    // Make grid grow to fit rows
    autoHeight : true,

    eventColor : null,
    features   : { timeRanges : true },

    barMargin : 1,
    rowHeight : 50,

    startDate : new Date(2017, 1, 7, 8),
    endDate   : new Date(2017, 1, 7, 18),

    viewPreset          : 'hourAndDay',
    useInitialAnimation : 'slide-from-left',
    resourceImagePath : 'users/',

    crudManager : {
        autoLoad  : true,
        transport : {
            load : {
                url : 'data/data.json'
            }
        }
    },

    // Columns in scheduler
    columns : [
        { type : 'resourceInfo', text : 'Staff', field : 'name', width : 150 },
        {
            text       : 'Task color',
            field      : 'eventColor',
            width      : 120,
            htmlEncode : false,
            renderer   : ({ record }) => `<div class="color-box b-sch-${record.eventColor}"></div>${StringHelper.capitalize(record.eventColor)}`,
            editor     : {
                type        : 'combo',
                items       : Scheduler.eventColors,
                editable    : false,
                listItemTpl : item => `<div class="color-box b-sch-${item.value}"></div><div>${item.value}</div>`
            }
        }
    ]

}; // eo export

// eof
