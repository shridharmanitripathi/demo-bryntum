import { Scheduler } from '../../build/scheduler.module.js?447702';
import shared from '../_shared/shared.module.js?447702';


new Scheduler({
    appendTo          : 'container',
    minHeight         : '20em',
    eventStyle        : 'line',
    viewPreset        : 'hourAndDay',
    rowHeight         : 60,
    barMargin         : 15,
    resourceImagePath : '../_shared/images/users/',

    features : {
        summary : {
            renderer : ({ events }) => events.length || ''
        }
    },

    startDate : new Date(2017, 11, 1, 6),
    endDate   : new Date(2017, 11, 3),

    columns : [
        {
            type            : 'resourceInfo',
            text            : 'Name',
            width           : 130,
            sum             : 'count',
            summaryRenderer : ({ sum }) => 'Total: ' + sum
        },
        {
            type            : 'number',
            text            : 'Rating',
            field           : 'rating',
            width           : 130,
            sum             : 'average',
            summaryRenderer : ({ sum }) => `Average: ${sum.toFixed(2)}`
        }
    ],

    crudManager : {
        autoLoad  : true,
        transport : {
            load : {
                url : 'data/data.json'
            }
        }
    }
});
