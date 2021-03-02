import { Scheduler, DateHelper } from '../../build/scheduler.module.js?447702';
import shared from '../_shared/shared.module.js?447702';
/* eslint-disable no-unused-vars */

const refreshAgendaOffsets = eventData => eventData.agenda.forEach(nestedEvent => {
    nestedEvent.startDate = new Date(nestedEvent.startDate);
    nestedEvent.endDate = new Date(nestedEvent.endDate);
    // Calculate offsets, more useful for rendering in case event is dragged to a new date
    nestedEvent.startOffset = DateHelper.diff(new Date(eventData.startDate), nestedEvent.startDate);
    nestedEvent.endOffset = DateHelper.diff(nestedEvent.startDate, nestedEvent.endDate);
});

const scheduler = new Scheduler({
    appendTo  : 'container',
    minHeight : '20em',

    startDate         : new Date(2018, 8, 24, 7),
    endDate           : new Date(2018, 8, 25),
    viewPreset        : 'hourAndDay',
    rowHeight         : 60,
    barMargin         : 10,
    resourceImagePath : '../_shared/images/users/',

    columns : [
        { type : 'resourceInfo', text : 'Name', field : 'name', width : 130 }
    ],

    features : {
        labels : {
            bottomLabel : 'name'
        },
        // Nested events have fixed content
        stickyEvents : false
    },

    crudManager : {
        autoLoad  : true,
        transport : {
            load : {
                url : 'data/data.json'
            }
        },
        listeners : {
            // Will be called after data is fetched but before it is loaded into stores
            beforeLoadApply({ response }) {
                // Turn "nested event" dates into actual dates, to not have to process them each time during render
                response.events.rows.forEach((event) => refreshAgendaOffsets(event));
            }
        }
    },

    // eventBodyTemplate is used to render markup inside an event. It is populated using data from eventRenderer()
    eventBodyTemplate : values => values.map(value => `
        <div class="nested" style="left: ${value.left}px;width: ${value.width}px">
            ${value.name}
        </div>
    `).join(''),

    // eventRenderer is here used to translate the dates of nested events into pixels, passed on to the eventBodyTemplate
    eventRenderer({ eventRecord, renderData }) {
        // getCoordinateFromDate gives us a px value in time axis, subtract events left from it to be within the event
        const dateToPx = (date) => this.getCoordinateFromDate(date) - renderData.left;

        // Calculate coordinates for all nested events and put in an array passed on to eventBodyTemplate
        return (eventRecord.agenda || [eventRecord]).map(nestedEvent => ({
            left  : dateToPx(DateHelper.add(eventRecord.startDate, nestedEvent.startOffset)),
            width : dateToPx(DateHelper.add(eventRecord.startDate, nestedEvent.endOffset)),
            name  : nestedEvent.name
        }));
    },

    listeners : {
        eventresizeend({ eventRecord }) {
            // remove any agenda items no longer fitting inside the event
            eventRecord.agenda = (eventRecord.agenda || []).filter(item => {
                item.endDate = DateHelper.min(eventRecord.endDate, item.endDate);

                return item.startDate < eventRecord.endDate;
            });

            refreshAgendaOffsets(eventRecord.data);
            scheduler.repaintEvent(eventRecord);
        }
    }
});
