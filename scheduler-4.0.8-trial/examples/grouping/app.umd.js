var _bryntum$scheduler = bryntum.scheduler,
    Scheduler = _bryntum$scheduler.Scheduler,
    StringHelper = _bryntum$scheduler.StringHelper; //TODO: tree filtering

var scheduler = new Scheduler({
  appendTo: 'container',
  minHeight: '20em',
  resourceImagePath: '../_shared/images/users/',
  features: {
    stripe: true,
    group: 'category',
    sort: 'name'
  },
  columns: [{
    text: 'Category',
    width: 100,
    field: 'category',
    hidden: true
  }, {
    type: 'resourceInfo',
    text: 'Staff',
    width: 160
  }, {
    text: 'Employment type',
    width: 130,
    field: 'type'
  }],
  rowHeight: 55,
  barMargin: 5,
  startDate: new Date(2017, 0, 1),
  endDate: new Date(2017, 0, 14),
  // Customize preset
  viewPreset: {
    base: 'dayAndWeek',
    displayDateFormat: 'YYYY-MM-DD',
    timeResolution: {
      unit: 'day',
      increment: 1
    }
  },
  crudManager: {
    autoLoad: true,
    transport: {
      load: {
        url: 'data/data.json'
      }
    }
  },
  eventRenderer: function eventRenderer(_ref) {
    var eventRecord = _ref.eventRecord,
        resourceRecord = _ref.resourceRecord,
        renderData = _ref.renderData;
    var colors = {
      Consultants: 'orange',
      Research: 'pink',
      Sales: 'lime',
      Testars: 'cyan'
    };
    renderData.eventColor = colors[resourceRecord.category];
    return StringHelper.encodeHtml(eventRecord.name);
  }
});
window.scheduler = scheduler;