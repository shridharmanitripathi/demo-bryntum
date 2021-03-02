/**
 *- Configuration for the scheduler
 */
import { Scheduler } from 'bryntum-scheduler';

export default {

    minHeight        : '20em',
    startDate        : new Date(2017, 0, 1, 6),
    endDate          : new Date(2017, 0, 1, 20),
    viewPreset       : 'hourAndDay',
    barMargin        : 5,
    rowHeight        : 50,
    multiEventSelect : true,

    features : {
        cellEdit  : false,
        eventDrag : {
            constrainDragToResource : true
        },
        eventEdit : {
            items : {
                nameField : false,

                resourceField : false,

                eventStyle : {
                    type     : 'combo',
                    label    : 'Style',
                    name     : 'eventStyle',
                    editable : false,
                    weight   : 110,
                    items    : Scheduler.eventStyles
                },
                eventColor : {
                    type     : 'combo',
                    label    : 'Color',
                    name     : 'eventColor',
                    editable : false,
                    weight   : 120,
                    listItemTpl : item => `<div class="color-box b-sch-${item.value}"></div><div>${item.value}</div>`,
                    items    : Scheduler.eventColors
                }
            }
        }
    },

    columns : [
        {
            text       : 'Name',
            field      : 'name',
            htmlEncode : false,
            width      : 130,
            renderer   : ({ record }) => `<div class="color-box b-sch-${record.name.toLowerCase()}"></div>${record.name}`
        }
    ],

    crudManager : {
        autoLoad  : true,
        transport : {
            load : {
                url : 'data/data.json'
            }
        }
    },

    eventRenderer({ eventRecord, resourceRecord, renderData }) {
        return eventRecord.eventStyle;
    }


} // eo schedulerConfig

// eof
