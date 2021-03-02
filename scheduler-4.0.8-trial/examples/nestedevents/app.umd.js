var _bryntum$scheduler = bryntum.scheduler,
    Scheduler = _bryntum$scheduler.Scheduler,
    DateHelper = _bryntum$scheduler.DateHelper;
/* eslint-disable no-unused-vars */

var refreshAgendaOffsets = function refreshAgendaOffsets(eventData) {
  return eventData.agenda.forEach(function (nestedEvent) {
    nestedEvent.startDate = new Date(nestedEvent.startDate);
    nestedEvent.endDate = new Date(nestedEvent.endDate); // Calculate offsets, more useful for rendering in case event is dragged to a new date

    nestedEvent.startOffset = DateHelper.diff(new Date(eventData.startDate), nestedEvent.startDate);
    nestedEvent.endOffset = DateHelper.diff(nestedEvent.startDate, nestedEvent.endDate);
  });
};

var scheduler = new Scheduler({
  appendTo: 'container',
  minHeight: '20em',
  startDate: new Date(2018, 8, 24, 7),
  endDate: new Date(2018, 8, 25),
  viewPreset: 'hourAndDay',
  rowHeight: 60,
  barMargin: 10,
  resourceImagePath: '../_shared/images/users/',
  columns: [{
    type: 'resourceInfo',
    text: 'Name',
    field: 'name',
    width: 130
  }],
  features: {
    labels: {
      bottomLabel: 'name'
    },
    // Nested events have fixed content
    stickyEvents: false
  },
  crudManager: {
    autoLoad: true,
    transport: {
      load: {
        url: 'data/data.json'
      }
    },
    listeners: {
      // Will be called after data is fetched but before it is loaded into stores
      beforeLoadApply: function beforeLoadApply(_ref) {
        var response = _ref.response;
        // Turn "nested event" dates into actual dates, to not have to process them each time during render
        response.events.rows.forEach(function (event) {
          return refreshAgendaOffsets(event);
        });
      }
    }
  },
  // eventBodyTemplate is used to render markup inside an event. It is populated using data from eventRenderer()
  eventBodyTemplate: function eventBodyTemplate(values) {
    return values.map(function (value) {
      return "\n        <div class=\"nested\" style=\"left: ".concat(value.left, "px;width: ").concat(value.width, "px\">\n            ").concat(value.name, "\n        </div>\n    ");
    }).join('');
  },
  // eventRenderer is here used to translate the dates of nested events into pixels, passed on to the eventBodyTemplate
  eventRenderer: function eventRenderer(_ref2) {
    var _this = this;

    var eventRecord = _ref2.eventRecord,
        renderData = _ref2.renderData;

    // getCoordinateFromDate gives us a px value in time axis, subtract events left from it to be within the event
    var dateToPx = function dateToPx(date) {
      return _this.getCoordinateFromDate(date) - renderData.left;
    }; // Calculate coordinates for all nested events and put in an array passed on to eventBodyTemplate


    return (eventRecord.agenda || [eventRecord]).map(function (nestedEvent) {
      return {
        left: dateToPx(DateHelper.add(eventRecord.startDate, nestedEvent.startOffset)),
        width: dateToPx(DateHelper.add(eventRecord.startDate, nestedEvent.endOffset)),
        name: nestedEvent.name
      };
    });
  },
  listeners: {
    eventresizeend: function eventresizeend(_ref3) {
      var eventRecord = _ref3.eventRecord;
      // remove any agenda items no longer fitting inside the event
      eventRecord.agenda = (eventRecord.agenda || []).filter(function (item) {
        item.endDate = DateHelper.min(eventRecord.endDate, item.endDate);
        return item.startDate < eventRecord.endDate;
      });
      refreshAgendaOffsets(eventRecord.data);
      scheduler.repaintEvent(eventRecord);
    }
  }
});