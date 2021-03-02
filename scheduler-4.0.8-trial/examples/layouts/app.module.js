import { Scheduler, StringHelper } from '../../build/scheduler.module.js?447702';
import shared from '../_shared/shared.module.js?447702';


// Simple custom sorter that sorts late start before early start
function customSorter(a, b) {
    return b.startDate.getTime() - a.startDate.getTime();
}

const scheduler = new Scheduler({
    appendTo          : 'container',
    minHeight         : '20em',
    resourceImagePath : '../_shared/images/users/',
    eventStyle        : 'colored',

    columns : [
        { type : 'resourceInfo', text : 'Staff' },
        {
            text   : 'Layout',
            field  : 'eventLayout',
            editor : {
                type        : 'combo',
                editable    : false,
                placeholder : 'Inherit',
                items       : [
                    ['', 'Inherit'],
                    ['stack', 'Stack'],
                    ['pack', 'Pack'],
                    ['none', 'Overlap']
                ]
            },
            renderer({ value, column }) {
                return column.editor.store.getById(value)?.text ?? 'Inherit';
            }
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

    barMargin   : 1,
    rowHeight   : 50,
    eventLayout : 'stack',
    startDate   : new Date(2017, 1, 7, 8),
    endDate     : new Date(2017, 1, 7, 18),
    viewPreset  : 'hourAndDay',

    eventRenderer({ eventRecord, resourceRecord, renderData }) {
        // Color by resource
        renderData.eventColor = resourceRecord.firstStore.indexOf(resourceRecord) % 2 === 0 ? 'green' : 'orange';
        // Icon by type
        renderData.iconCls = eventRecord.eventType === 'Meeting' ? 'b-fa b-fa-calendar' : 'b-fa b-fa-calendar-alt';

        // Encode name to protect against xss
        return StringHelper.encodeHtml(eventRecord.name);
    },

    tbar : [
        {
            type     : 'buttonGroup',
            defaults : {
                width : '8em'
            },
            toggleGroup : true,
            items       : [
                {
                    type     : 'button',
                    ref      : 'stackButton',
                    text     : 'Stack',
                    pressed  : true,
                    onAction : () => scheduler.eventLayout = 'stack'
                },
                {
                    type     : 'button',
                    ref      : 'packButton',
                    text     : 'Pack',
                    onAction : () => scheduler.eventLayout = 'pack'
                },
                {
                    type     : 'button',
                    ref      : 'noneButton',
                    text     : 'Overlap',
                    onAction : () => scheduler.eventLayout = 'none'
                }
            ]
        },
        {
            type        : 'button',
            ref         : 'customButton',
            text        : 'Custom sorter',
            toggleable  : true,
            icon        : 'b-fa-square',
            pressedIcon : 'b-fa-check-square',
            tooltip     : 'Click to use a custom event sorting function',
            onToggle    : ({ pressed }) => {
                scheduler.horizontalEventSorterFn = pressed ? customSorter : null;
            }
        }
    ]
});
