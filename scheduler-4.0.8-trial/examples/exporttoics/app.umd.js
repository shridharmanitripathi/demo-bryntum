var Scheduler = bryntum.scheduler.Scheduler;
/* eslint-disable no-unused-vars */

var scheduler = new Scheduler({
  appendTo: 'container',
  minHeight: '20em',
  eventStyle: 'border',
  resourceImagePath: '../_shared/images/users/',
  enableRecurringEvents: true,
  fillTicks: true,
  features: {
    eventEdit: {
      items: {
        locationField: {
          type: 'text',
          name: 'location',
          label: 'Location',
          weight: 120
        },
        // Add a button to export the event in the editor window
        exportButton: {
          type: 'button',
          icon: 'b-fa b-fa-calendar-alt',
          text: 'Add to Outlook (.ics)',
          weight: 700,
          onClick: function onClick() {
            var eventRecord = scheduler.features.eventEdit.eventRecord; // Add some custom ICS values (See https://tools.ietf.org/html/rfc5545 for more information)

            eventRecord.exportToICS({
              LOCATION: eventRecord.location
            });
          }
        }
      }
    },
    eventMenu: {
      items: {
        // Add export option
        exportToIcs: {
          text: 'Export to iCal',
          icon: 'b-fa b-fa-calendar-alt',
          onItem: function onItem(_ref) {
            var eventRecord = _ref.eventRecord;
            // Add some custom ICS values (See https://tools.ietf.org/html/rfc5545 for more information)
            eventRecord.exportToICS({
              LOCATION: eventRecord.location
            });
          }
        }
      }
    }
  },
  columns: [{
    type: 'resourceInfo',
    text: 'Staff'
  }],
  crudManager: {
    autoLoad: true,
    transport: {
      load: {
        url: 'data/data.json'
      }
    }
  },
  barMargin: 2,
  rowHeight: 50,
  startDate: new Date(2020, 10, 9),
  endDate: new Date(2020, 10, 19),
  viewPreset: {
    base: 'dayAndWeek',
    tickWidth: 100
  }
});