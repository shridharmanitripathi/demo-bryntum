var _bryntum$scheduler = bryntum.scheduler,
    Scheduler = _bryntum$scheduler.Scheduler,
    StringHelper = _bryntum$scheduler.StringHelper; // Simple custom sorter that sorts late start before early start

function customSorter(a, b) {
  return b.startDate.getTime() - a.startDate.getTime();
}

var scheduler = new Scheduler({
  appendTo: 'container',
  minHeight: '20em',
  resourceImagePath: '../_shared/images/users/',
  eventStyle: 'colored',
  columns: [{
    type: 'resourceInfo',
    text: 'Staff'
  }, {
    text: 'Layout',
    field: 'eventLayout',
    editor: {
      type: 'combo',
      editable: false,
      placeholder: 'Inherit',
      items: [['', 'Inherit'], ['stack', 'Stack'], ['pack', 'Pack'], ['none', 'Overlap']]
    },
    renderer: function renderer(_ref) {
      var _column$editor$store$, _column$editor$store$2;

      var value = _ref.value,
          column = _ref.column;
      return (_column$editor$store$ = (_column$editor$store$2 = column.editor.store.getById(value)) === null || _column$editor$store$2 === void 0 ? void 0 : _column$editor$store$2.text) !== null && _column$editor$store$ !== void 0 ? _column$editor$store$ : 'Inherit';
    }
  }],
  crudManager: {
    autoLoad: true,
    transport: {
      load: {
        url: 'data/data.json'
      }
    }
  },
  barMargin: 1,
  rowHeight: 50,
  eventLayout: 'stack',
  startDate: new Date(2017, 1, 7, 8),
  endDate: new Date(2017, 1, 7, 18),
  viewPreset: 'hourAndDay',
  eventRenderer: function eventRenderer(_ref2) {
    var eventRecord = _ref2.eventRecord,
        resourceRecord = _ref2.resourceRecord,
        renderData = _ref2.renderData;
    // Color by resource
    renderData.eventColor = resourceRecord.firstStore.indexOf(resourceRecord) % 2 === 0 ? 'green' : 'orange'; // Icon by type

    renderData.iconCls = eventRecord.eventType === 'Meeting' ? 'b-fa b-fa-calendar' : 'b-fa b-fa-calendar-alt'; // Encode name to protect against xss

    return StringHelper.encodeHtml(eventRecord.name);
  },
  tbar: [{
    type: 'buttonGroup',
    defaults: {
      width: '8em'
    },
    toggleGroup: true,
    items: [{
      type: 'button',
      ref: 'stackButton',
      text: 'Stack',
      pressed: true,
      onAction: function onAction() {
        return scheduler.eventLayout = 'stack';
      }
    }, {
      type: 'button',
      ref: 'packButton',
      text: 'Pack',
      onAction: function onAction() {
        return scheduler.eventLayout = 'pack';
      }
    }, {
      type: 'button',
      ref: 'noneButton',
      text: 'Overlap',
      onAction: function onAction() {
        return scheduler.eventLayout = 'none';
      }
    }]
  }, {
    type: 'button',
    ref: 'customButton',
    text: 'Custom sorter',
    toggleable: true,
    icon: 'b-fa-square',
    pressedIcon: 'b-fa-check-square',
    tooltip: 'Click to use a custom event sorting function',
    onToggle: function onToggle(_ref3) {
      var pressed = _ref3.pressed;
      scheduler.horizontalEventSorterFn = pressed ? customSorter : null;
    }
  }]
});