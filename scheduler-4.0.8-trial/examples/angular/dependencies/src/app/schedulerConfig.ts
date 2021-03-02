/**
 * Scheduler config file
 */
export default {
    minHeight  : '20em',
    eventStyle : null,
    eventColor : null,

    resourceImagePath : 'assets/users/',

    stripeFeature       : true,
    dependenciesFeature : true,
    timeRangesFeature   : true,
    eventDragFeature    : {
        constrainDragToResource : true
    },

    rowHeight : 50,
    barMargin : 8,

    columns : [
        {
            text  : 'Production line',
            width : 150,
            field : 'name'
        }
    ],

    startDate : new Date(2017, 11, 1),
    endDate   : new Date(2017, 11, 3),

    crudManager : {
        autoLoad  : true,
        transport : {
            load : {
                url : 'assets/data/data.json'
            }
        }
    },

    viewPreset : {
        base            : 'hourAndDay',
        tickWidth       : 25,
        columnLinesFor  : 0,
        mainHeaderLevel : 1,
        headers         : [
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


    eventRenderer({ eventRecord, resourceRecord, renderData }) {
        const bgColor = resourceRecord.bg || '';

        renderData.style = `background:${bgColor};border-color:${bgColor};color:${resourceRecord.textColor}`;
        renderData.iconCls.add('b-fa', `b-fa-${resourceRecord.icon}`);

        return eventRecord.name;
    }

}


