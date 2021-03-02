var Scheduler = bryntum.scheduler.Scheduler;
new Scheduler({
  appendTo: 'container',
  minHeight: '20em',
  eventStyle: 'line',
  viewPreset: 'hourAndDay',
  rowHeight: 60,
  barMargin: 15,
  resourceImagePath: '../_shared/images/users/',
  features: {
    summary: {
      renderer: function renderer(_ref) {
        var events = _ref.events;
        return events.length || '';
      }
    }
  },
  startDate: new Date(2017, 11, 1, 6),
  endDate: new Date(2017, 11, 3),
  columns: [{
    type: 'resourceInfo',
    text: 'Name',
    width: 130,
    sum: 'count',
    summaryRenderer: function summaryRenderer(_ref2) {
      var sum = _ref2.sum;
      return 'Total: ' + sum;
    }
  }, {
    type: 'number',
    text: 'Rating',
    field: 'rating',
    width: 130,
    sum: 'average',
    summaryRenderer: function summaryRenderer(_ref3) {
      var sum = _ref3.sum;
      return "Average: ".concat(sum.toFixed(2));
    }
  }],
  crudManager: {
    autoLoad: true,
    transport: {
      load: {
        url: 'data/data.json'
      }
    }
  }
});