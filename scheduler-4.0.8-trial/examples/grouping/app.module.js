import { Scheduler, StringHelper } from '../../build/scheduler.module.js?447702';
import shared from '../_shared/shared.module.js?447702';

//TODO: tree filtering

const scheduler = new Scheduler({
    appendTo          : 'container',
    minHeight         : '20em',
    resourceImagePath : '../_shared/images/users/',

    features : {
        stripe : true,
        group  : 'category',
        sort   : 'name'
    },

    columns : [
        {
            text   : 'Category',
            width  : 100,
            field  : 'category',
            hidden : true
        },
        {
            type  : 'resourceInfo',
            text  : 'Staff',
            width : 160
        },
        {
            text  : 'Employment type',
            width : 130,
            field : 'type'
        }
    ],

    rowHeight : 55,
    barMargin : 5,
    startDate : new Date(2017, 0, 1),
    endDate   : new Date(2017, 0, 14),

    // Customize preset
    viewPreset : {
        base              : 'dayAndWeek',
        displayDateFormat : 'YYYY-MM-DD',
        timeResolution    : {
            unit      : 'day',
            increment : 1
        }
    },

    crudManager : {
        autoLoad  : true,
        transport : {
            load : {
                url : 'data/data.json'
            }
        }
    },

    eventRenderer({ eventRecord, resourceRecord, renderData }) {
        const colors = {
            Consultants : 'orange',
            Research    : 'pink',
            Sales       : 'lime',
            Testars     : 'cyan'
        };

        renderData.eventColor = colors[resourceRecord.category];

        return StringHelper.encodeHtml(eventRecord.name);
    }
});

window.scheduler = scheduler;
