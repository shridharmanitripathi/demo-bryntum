import { Scheduler, DateHelper, StringHelper } from '../../build/scheduler.module.js?447702';
import shared from '../_shared/shared.module.js?447702';

new Scheduler({
    appendTo          : 'container',
    minHeight         : '20em',
    eventStyle        : 'border',
    resourceImagePath : '../_shared/images/users/',

    features : {
        sort   : 'name',
        labels : {
            // using renderer
            top : {
                // Label showing id or [Unsynced event] for new events
                renderer : ({ eventRecord }) => eventRecord.hasGeneratedId ? '[Unsynced event]' : eventRecord.id
            },

            // using renderer, just different way of defining it compared to top label
            bottom({ resourceRecord, domConfig }) {
                if (resourceRecord.category === 'Testers') {
                    domConfig.className.custom = true;
                }
                return resourceRecord.category;
            },

            // using field as label (will first look in event and then in resource)
            left : {
                field  : 'fullDuration',
                editor : {
                    type  : 'durationfield',
                    width : 110
                },
                renderer : ({ eventRecord }) => eventRecord.duration + ' ' +  DateHelper.getLocalizedNameOfUnit(eventRecord.durationUnit, eventRecord.duration !== 1)
            }
        }
    },

    columns : [
        {
            text   : 'Projects',
            width  : 100,
            field  : 'category',
            hidden : true
        },
        {
            type           : 'resourceInfo',
            text           : 'Staff',
            width          : 170,
            field          : 'name',
            showRole       : 'category',
            showEventCount : false
        },
        {
            text  : 'Employment type',
            width : 130,
            field : 'type'
        }
    ],

    rowHeight : 60,
    barMargin : 0,
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
