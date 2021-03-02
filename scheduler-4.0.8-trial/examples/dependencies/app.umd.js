var _bryntum$scheduler = bryntum.scheduler,
    Scheduler = _bryntum$scheduler.Scheduler,
    StringHelper = _bryntum$scheduler.StringHelper;
/* eslint-disable no-unused-vars */

var scheduler = new Scheduler({
  appendTo: 'container',
  minHeight: '20em',
  eventStyle: null,
  eventColor: null,
  features: {
    stripe: true,
    dependencies: true,
    dependencyEdit: {
      showLagField: false
    },
    timeRanges: true,
    eventDrag: {
      constrainDragToResource: true
    }
  },
  rowHeight: 50,
  barMargin: 8,
  columns: [{
    text: 'Production line',
    width: 150,
    field: 'name'
  }],
  startDate: new Date(2017, 11, 1),
  endDate: new Date(2017, 11, 3),
  crudManager: {
    autoLoad: true,
    transport: {
      load: {
        url: 'data/data.json'
      }
    }
  },
  viewPreset: {
    base: 'hourAndDay',
    tickWidth: 25,
    columnLinesFor: 0,
    headers: [{
      unit: 'd',
      align: 'center',
      dateFormat: 'ddd DD MMM'
    }, {
      unit: 'h',
      align: 'center',
      dateFormat: 'HH'
    }]
  },
  eventRenderer: function eventRenderer(_ref) {
    var eventRecord = _ref.eventRecord,
        resourceRecord = _ref.resourceRecord,
        renderData = _ref.renderData;
    var bgColor = resourceRecord.bg || '';
    renderData.style = "background:".concat(bgColor, ";border-color:").concat(bgColor, ";color:").concat(resourceRecord.textColor);
    renderData.iconCls.add('b-fa', "b-fa-".concat(resourceRecord.icon));
    return StringHelper.encodeHtml(eventRecord.name);
  }
});