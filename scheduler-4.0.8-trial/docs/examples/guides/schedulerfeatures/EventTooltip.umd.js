var scheduler = new Scheduler({
  appendTo: targetElement,
  autoHeight: true,
  rowHeight: 40,
  barMargin: 4,
  features: {
    eventTooltip: {
      template: function template(data) {
        return "\n            <div class=\"b-sch-event-tooltip\">\n            ".concat(data.startText, " -> ").concat(data.endText, "\n            </div>\n            ");
      }
    }
  },
  startDate: new Date(2018, 4, 6),
  endDate: new Date(2018, 4, 13),
  columns: [{
    field: 'name',
    text: 'Name',
    width: 100
  }],
  resources: [{
    id: 1,
    name: 'Bernard'
  }, {
    id: 2,
    name: 'Bianca'
  }],
  events: [{
    id: 1,
    resourceId: 1,
    name: 'Hover me',
    startDate: '2018-05-07',
    endDate: '2018-05-10'
  }, {
    id: 2,
    resourceId: 2,
    name: 'Or me',
    startDate: '2018-05-10',
    endDate: '2018-05-12'
  }]
});