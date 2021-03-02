import { Toast, DateHelper, Scheduler, EventModel } from '../../build/scheduler.module.js?447702';
import shared from '../_shared/shared.module.js?447702';
/* eslint-disable no-unused-vars,no-undef */

// Will hold record currently being edited
let editingRecord = null;

class Match extends EventModel {
    static get fields() {
        return [
            { name : 'duration', defaultValue : 3 },
            { name : 'durationUnit', defaultValue : 'h' }
        ];
    }
}

const scheduler = new Scheduler({
    appendTo              : 'container',
    minHeight             : '20em',
    startDate             : new Date(2020, 8, 18),
    endDate               : new Date(2020, 8, 29),
    viewPreset            : 'dayAndWeek',
    rowHeight             : 85,
    barMargin             : 0,
    fillTicks             : true,
    tickSize              : 215,
    createEventOnDblClick : false,
    // These are set to null to have less default styling from Scheduler interfering with custom CSS.
    // Makes life easier when you are creating a custom look
    eventColor            : null,
    eventStyle            : null,

    // CrudManager is used to load data to all stores in one go (Events, Resources and Assignments)
    crudManager : {
        autoLoad   : true,
        eventStore : {
            // Provide our custom event model representing a single match
            modelClass : Match
        },
        transport : {
            load : {
                url : 'data/data.json'
            }
        }
    },

    features : {
        // Features disabled to give a better demo experience
        eventDragCreate : false,
        eventResize     : false,
        columnLines     : false,
        // Initial sort
        sort            : 'name'
    },

    columns : [
        { text : 'Name', field : 'name', width : 130 }
    ],

    // A custom eventRenderer, used to generate the contents of the events
    eventRenderer({ eventRecord, assignmentRecord, renderData }) {
        const
            { resources }  = eventRecord,
            // 19:00
            startTime      = DateHelper.format(eventRecord.startDate, 'HH:mm'),
            // First resource is the home team, second the away
            [home, away] = resources,
            // If the assignment being rendered is the home team, this is a home game
            homeGame       = assignmentRecord.resource === home;

        // Different icons depending on if the game is at home or away
        renderData.iconCls = homeGame ? 'b-fa b-fa-hockey-puck' : 'b-fa b-fa-shuttle-van';

        // HTML config:
        // <div class="time">19:00</div>
        // Home - Away
        // <div class="arena">Arena name</div>
        return {
            children : [
                {
                    className : 'time',
                    html      : startTime
                },
                `${home.name} - ${away.name}`,
                {
                    className : 'arena',
                    html      : home.arena
                }
            ]
        };
    },

    listeners : {
        // Listener called before the built in editor is shown
        beforeEventEdit({ eventRecord, resourceRecord }) {
            const teams = eventRecord.resources;
            // Show custom editor
            $('#customEditor').modal('show');

            // Fill its fields
            if (teams.length === 0) {
                // New match being created
                $('#home').val(resourceRecord.id);
            }
            else {
                $('#home').val(teams[0].id);
                $('#away').val(teams[1].id);
            }
            $('#startDate').val(DateHelper.format(eventRecord.startDate, 'YYYY-MM-DD'));
            $('#startTime').val(DateHelper.format(eventRecord.startDate, 'HH:mm'));

            // Store record being edited, to be able to write changes back to it later
            editingRecord = eventRecord;

            // Prevent built in editor
            return false;
        }
    }
});

// When clicking save in the custom editor
$('#save').on('click', () => {
    const
        // Extract teams
        home = $('#home').val(),
        away = $('#away').val(),
        // Extract date & time
        date = $('#startDate').val(),
        time = $('#startTime').val();

    if (home === away) {
        Toast.show('A team cannot play itself');
        return false;
    }

    if (!scheduler.eventStore.includes(editingRecord)) {
        scheduler.eventStore.add(editingRecord);
    }

    // Update record
    editingRecord.set({
        startDate : DateHelper.parse(date + ' ' + time, 'YYYY-MM-DD HH:mm'),
        resources : [away, home]
    });
});
