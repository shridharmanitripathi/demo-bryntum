function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var scheduler;
  t.beforeEach(function () {
    return scheduler && scheduler.destroy();
  });
  t.it('Clock in tooltip is updated on resize', function (t) {
    scheduler = t.getScheduler({
      viewPreset: 'hourAndDay',
      startDate: new Date(2018, 3, 27),
      endDate: new Date(2018, 3, 30),
      eventStore: t.getEventStore({
        data: [{
          name: 'foo',
          startDate: '2018-04-27 02:00',
          endDate: '2018-04-27 03:45',
          id: 1,
          resourceId: 'r1'
        }, {
          name: 'bar',
          startDate: '2018-04-27 06:20',
          endDate: '2018-04-27 06:20',
          id: 2,
          resourceId: 'r3'
        }]
      })
    });

    function assertClock(t, hour, minute, side) {
      var hourIndicator = document.querySelector(".b-sch-event-tooltip .b-sch-tooltip-".concat(side, "date .b-sch-hour-indicator")),
          minuteIndicator = document.querySelector(".b-sch-event-tooltip .b-sch-tooltip-".concat(side, "date .b-sch-minute-indicator"));
      t.is(hourIndicator.style.transform, "rotate(".concat(hour * 30, "deg)"), 'Hour indicator is ok');
      t.is(minuteIndicator.style.transform, "rotate(".concat(minute * 6, "deg)"), 'Minute indicator is ok');
    }

    t.chain({
      moveMouseTo: '.b-sch-event'
    }, {
      waitForSelector: '.b-sch-event-tooltip:contains(foo)'
    }, function (next) {
      assertClock(t, 2, 0, 'start');
      assertClock(t, 3, 45, 'end');
      next();
    }, {
      moveMouseTo: '.b-milestone'
    }, {
      waitForSelector: '.b-sch-event-tooltip:contains(bar)'
    }, function (next) {
      assertClock(t, 6, 20, 'start');
      t.selectorNotExists('.b-sch-event-tooltip .b-sch-tooltip-enddate', 'Only start shown for milestone');
      next();
    });
  });
  t.it('displays properly after hovered event is deleted', function (t) {
    scheduler = t.getScheduler({
      viewPreset: 'hourAndDay',
      startDate: new Date(2018, 3, 27),
      endDate: new Date(2018, 3, 30),
      features: true,
      eventStore: t.getEventStore({
        data: [{
          startDate: '2018-04-27 02:00',
          endDate: '2018-04-27 03:45',
          id: 1,
          resourceId: 'r1'
        }, {
          startDate: '2018-04-27 06:00',
          endDate: '2018-04-27 07:45',
          id: 2,
          resourceId: 'r1'
        }]
      })
    });
    t.chain({
      moveMouseTo: scheduler.unreleasedEventSelector
    }, {
      waitForSelector: '.b-sch-event-tooltip'
    }, {
      rightclick: scheduler.unreleasedEventSelector
    }, {
      click: '.b-menu-text:contains(Delete event)'
    }, {
      moveMouseTo: scheduler.unreleasedEventSelector
    }, {
      waitForSelector: '.b-sch-event-tooltip'
    }, // The bug was rapid disappearance of the tooltip,
    // so wait for that to happen.
    {
      waitFor: 500
    }, // Assert that the event tooltip is still there.
    function () {
      t.selectorExists('.b-sch-event-tooltip');
      t.selectorExists('.b-sch-clock-text:contains(6 AM)', 'Time format is correct');
    });
  });
  t.it('Date in the clock matches text', function (t) {
    scheduler = t.getScheduler({
      appendTo: document.body,
      viewPreset: 'weekAndDayLetter',
      startDate: '2018-04-24',
      endDate: '2018-04-30',
      features: true,
      eventStore: t.getEventStore({
        data: [{
          startDate: '2018-04-27T00:00:00',
          endDate: '2018-04-29T00:00:00',
          id: 1,
          resourceId: 'r1'
        }]
      })
    });
    t.chain({
      moveMouseTo: document.body,
      offset: [0, 0]
    }, // reset cursor position
    {
      moveMouseTo: '.b-sch-event'
    }, {
      waitForSelector: '.b-sch-event-tooltip'
    }, function (next) {
      t.selectorExists('.b-sch-event-tooltip .b-sch-tooltip-enddate .b-sch-minute-indicator:contains(28)');
      t.selectorExists('.b-sch-event-tooltip .b-sch-tooltip-enddate .b-sch-clock-text:contains(28)');
    });
  });
  t.it('should encode event name to avoid XSS issues', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              scheduler = t.getScheduler({
                viewPreset: 'weekAndDayLetter',
                startDate: '2018-04-24',
                endDate: '2018-04-30',
                features: true,
                eventStore: t.getEventStore({
                  data: [{
                    startDate: '2018-04-27T00:00:00',
                    endDate: '2018-04-29T00:00:00',
                    id: 1,
                    resourceId: 'r1',
                    name: 'Foo<b>Bar</b>'
                  }]
                })
              });
              _context.next = 3;
              return t.waitForSelector('.b-sch-event-content:contains(Foo)');

            case 3:
              _context.next = 5;
              return t.waitForSelector('.b-sch-event-content:contains(Foo<b>)');

            case 5:
              _context.next = 7;
              return t.waitForSelectorNotFound('.b-sch-event:contains(Foo&)');

            case 7:
              _context.next = 9;
              return t.moveMouseTo([0, 0], function () {});

            case 9:
              _context.next = 11;
              return t.moveMouseTo('.b-sch-event', function () {});

            case 11:
              _context.next = 13;
              return t.waitForSelector('.b-sch-event-tooltip');

            case 13:
              _context.next = 15;
              return t.waitForSelector('.b-sch-event-tooltip:contains(Foo<b>)');

            case 15:
              _context.next = 17;
              return t.waitForSelectorNotFound('.b-sch-event-tooltip:contains(Foo&)');

            case 17:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
  t.it('Should only show one date for milestone', function (t) {
    scheduler = t.getScheduler({
      appendTo: document.body,
      events: [{
        startDate: '2011-01-04',
        endDate: '2011-01-05',
        id: 1,
        cls: 'event-1',
        resourceId: 'r3'
      }, {
        startDate: '2011-01-05',
        endDate: '2011-01-05',
        id: 2,
        cls: 'event-2',
        resourceId: 'r4'
      }]
    });
    t.chain({
      moveMouseTo: '.event-1'
    }, {
      waitForSelector: '.b-sch-event-tooltip'
    }, function (next) {
      t.selectorCountIs('.b-sch-event-tooltip .b-sch-clockwrap', 2, 'Start/end dates are shown in the tooltip');
      next();
    }, {
      moveMouseTo: '.event-2'
    }, function (next) {
      t.selectorCountIs('.b-sch-event-tooltip .b-sch-clockwrap', 1, 'Only milestone end is shown in the tooltip');
      scheduler.features.eventTooltip.tooltip.hide();
      next();
    }, {
      moveMouseBy: [100, 0]
    }, {
      moveMouseTo: '.event-1'
    }, function () {
      t.selectorCountIs('.b-sch-event-tooltip .b-sch-clockwrap', 2, 'Start/end dates are shown in regular task tooltip');
    });
  }); // https://app.assembla.com/spaces/bryntum/tickets/9249

  t.it('Should show correct end date if event ends on midnight', function (t) {
    scheduler = t.getScheduler({
      appendTo: document.body,
      events: [{
        startDate: '2011-01-04',
        endDate: '2011-01-05',
        id: 1,
        cls: 'event-1',
        resourceId: 'r3'
      }, {
        startDate: '2011-01-05',
        endDate: '2011-01-05',
        id: 2,
        cls: 'event-2',
        resourceId: 'r4'
      }]
    });
    t.chain({
      moveMouseTo: document.body,
      offset: [0, 0]
    }, // reset cursor position
    {
      moveMouseTo: '.event-1'
    }, {
      waitForSelector: '.b-sch-event-tooltip'
    }, // Check using `is` instead of `waitForSelector` to see actual value in case of failure
    function (next) {
      // there is a potential problem with localization on server
      t.contentLike('.b-sch-tooltip-startdate .b-sch-clock-text', 'Jan 4, 2011 12 AM', 'Event start date is correct');
      t.contentLike('.b-sch-tooltip-enddate .b-sch-clock-text', 'Jan 5, 2011 12 AM', 'Event end date is correct');
      next();
    }, {
      moveMouseTo: '.event-2'
    }, {
      waitForSelector: '.b-sch-event-tooltip'
    }, function () {
      t.contentLike('.b-sch-tooltip-startdate .b-sch-clock-text', 'Jan 5, 2011 12 AM', 'Milestone date is correct');
    });
  });
  t.it('Should support disabling', function (t) {
    scheduler = t.getScheduler();
    scheduler.features.eventTooltip.disabled = true;
    t.chain({
      moveMouseTo: '.b-sch-event'
    }, {
      waitFor: 250
    }, function (next) {
      t.selectorNotExists('.b-sch-event-tooltip', 'Tooltip not shown');
      scheduler.features.eventTooltip.disabled = false;
      next();
    }, {
      moveMouseTo: '.b-sch-event:contains(Assignment 2)'
    }, {
      waitForSelector: '.b-sch-event-tooltip',
      desc: 'Tooltip shown'
    });
  }); // https://github.com/bryntum/support/issues/104

  t.it('Should show calendar icon if date format does not include hour info', function (t) {
    scheduler = t.getScheduler({
      displayDateFormat: 'DD-MM-YYYY'
    });
    t.chain({
      moveMouseTo: '.b-sch-event'
    }, {
      waitForSelector: '.b-sch-event-tooltip'
    }, function (next) {
      t.selectorNotExists('.b-sch-clock-hour', 'Clock icon is not shown');
      t.selectorExists('.b-sch-clock-day', 'Calendar icon is shown');
      t.selectorExists('.b-sch-clock-text', 'Date text is shown');
      next();
    }, {
      moveMouseTo: document.body,
      offset: [0, 0]
    }, // reset cursor position
    {
      waitForSelectorNotFound: '.b-sch-event-tooltip'
    }, function (next) {
      scheduler.displayDateFormat = 'DD-MM-YYYY HH:mm';
      next();
    }, {
      moveMouseTo: '.b-sch-event'
    }, {
      waitForSelector: '.b-sch-event-tooltip'
    }, function () {
      t.selectorExists('.b-sch-clock-hour', 'Clock icon is shown');
      t.selectorNotExists('.b-sch-clock-day', 'Calendar icon is not shown');
      t.selectorExists('.b-sch-clock-text', 'Date text is shown');
    });
  });
  t.it('Should support async tooltip by returning Promise', function (t) {
    scheduler = t.getScheduler({
      events: [{
        startDate: '2011-01-05',
        endDate: '2011-01-05',
        id: 2,
        cls: 'event-2',
        resourceId: 'r4'
      }],
      features: {
        eventTooltip: {
          template: function template(_ref2) {
            var eventRecord = _ref2.eventRecord;
            return AjaxHelper.get('./fakeServer').then(function (response) {
              return response.text();
            });
          }
        }
      }
    });
    t.mockUrl('./fakeServer', {
      responseText: 'Remote content'
    });
    t.setCursorPosition(0, 0);
    t.chain({
      moveMouseTo: '.b-sch-event'
    }, {
      waitForSelector: '.b-sch-event-tooltip:contains(Remote content)'
    });
  }); // https://github.com/bryntum/support/issues/434

  t.it('Should not show empty event tooltip', function (t) {
    scheduler = t.getScheduler({
      events: [{
        startDate: '2011-01-05',
        endDate: '2011-01-06',
        resourceId: 'r4'
      }],
      features: {
        eventTooltip: {
          template: function template() {
            return '';
          },
          hoverDelay: 0,
          hideDelay: 0
        }
      }
    });
    t.setCursorPosition(0, 0);
    t.chain({
      moveMouseTo: '.b-sch-event'
    }, {
      waitForSelectorNotFound: '.b-sch-event-tooltip',
      desc: 'No tooltips shown for empty string'
    });
  }); // https://github.com/bryntum/support/issues/2077

  t.it('Should update tooltip content if its record changes while visible', /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              scheduler = t.getScheduler({
                height: 300,
                events: [{
                  startDate: '2011-01-05',
                  endDate: '2011-01-06',
                  resourceId: 'r4'
                }],
                features: {
                  eventTooltip: {
                    hoverDelay: 0,
                    hideDelay: 0
                  }
                }
              });
              t.setCursorPosition(0, 0);
              _context2.next = 4;
              return t.moveMouseTo('.b-sch-event', function () {});

            case 4:
              _context2.next = 6;
              return t.waitForSelector('.b-sch-event-tooltip');

            case 6:
              scheduler.eventStore.first.shift(4);
              _context2.next = 9;
              return t.waitForSelector('.b-sch-event-tooltip:contains(Jan 9)');

            case 9:
              t.click();

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x2) {
      return _ref3.apply(this, arguments);
    };
  }());
});