targetElement.innerHTML = '<p>Hover an event to see a custom tooltip:</p><h3>Local tooltip data</h3><div class="local"></div><h3>Remote tooltip data</h3><div class="remote"></div>';
var scheduler = new Scheduler({
  adopt: targetElement.querySelector('.local'),
  // makes scheduler as high as it needs to be to fit rows
  autoHeight: true,
  features: {
    eventTooltip: {
      template: function template(data) {
        return "\n            <div class=\"b-sch-event-tooltip\">\n             ".concat(data.startText, " -> ").concat(data.endText, "\n            </div>");
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
var scheduler2 = new Scheduler({
  adopt: targetElement.querySelector('.remote'),
  // makes grid as high as it needs to be to fit rows
  autoHeight: true,
  features: {
    eventTooltip: function eventTooltip(_ref) {
      var eventRecord = _ref.eventRecord;
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve(eventRecord.name + '<br><br> Some remote content');
        }, 2000);
      });
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
    name: 'Hover to load remote data',
    startDate: '2018-05-07',
    endDate: '2018-05-10'
  }, {
    id: 2,
    resourceId: 2,
    name: 'Or hover me...',
    startDate: '2018-05-10',
    endDate: '2018-05-12'
  }]
});