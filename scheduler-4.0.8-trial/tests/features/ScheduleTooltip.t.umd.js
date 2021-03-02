function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var scheduler; // async beforeEach doesn't work in umd

  t.beforeEach( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t, next) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              scheduler && scheduler.destroy();
              _context.next = 3;
              return t.getSchedulerAsync();

            case 3:
              scheduler = _context.sent;
              next();

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
  if (t.browser.safari) return;
  t.it('Should be displayed when hovering empty area', function (t) {
    t.chain({
      moveMouseTo: '.b-sch-timeaxis-cell'
    }, {
      waitForSelector: '.b-sch-scheduletip:not(.b-hidden)',
      desc: 'Waiting for tooltip'
    }, function (next) {
      t.is(document.querySelector('.b-sch-scheduletip .b-sch-clock-text').innerText, 'Jan 8, 2011 12 AM', 'Displays correct date/time');
      next();
    }, // A click should hide it
    {
      click: []
    }, {
      waitForSelectorNotFound: '.b-sch-scheduletip:not(.b-hidden)',
      desc: 'Waiting for tooltip'
    }, // But the very next mousemove should show it again
    {
      moveMouseBy: [1, 0]
    }, {
      waitForSelector: '.b-sch-scheduletip:not(.b-hidden)',
      desc: 'Waiting for tooltip'
    });
  });
  t.it('Should not be displayed when hovering event', function (t) {
    t.chain({
      moveMouseTo: [0, 0]
    }, {
      moveMouseTo: '.b-sch-event'
    }, {
      waitFor: 100
    }, {
      waitForSelectorNotFound: '.b-sch-scheduletip:not(.b-hidden)',
      desc: 'Not shown'
    });
  });
  t.it('Should not be displayed when dragging an event', function (t) {
    t.chain( // Position the mouse close to the event we're going to drag
    // so that we can begin the drag before the ScheduleTooltip
    // has a chance to hide
    {
      moveMouseTo: '.b-sch-event',
      offset: ['50%', '0%-1']
    }, {
      waitForSelector: '.b-sch-scheduletip:not(.b-hidden)',
      desc: 'Shown'
    }, // Move the mouse 2px down into the event and drag from there.
    // This will allow no time for the ScheduleTooltip to hide.
    // The event dropping to pointer-events:none will trigger a mouseover
    // on the Scheduler, but the ScheduleToolTip's selector rejects
    // if the scheduler is currently dragging an event, so the scheduled
    // hide will not get canceled.
    {
      drag: '.b-sch-event',
      offset: ['50%', '0%+1'],
      by: [-50, 0],
      dragOnly: true
    }, {
      waitForSelectorNotFound: '.b-sch-scheduletip:not(.b-hidden)',
      desc: 'Not shown'
    }, {
      mouseUp: null
    });
  });
  t.it('Should still be displayed when scheduler is readOnly', function (t) {
    scheduler.readOnly = true;
    t.chain({
      moveMouseTo: [0, 0]
    }, {
      moveMouseTo: '.b-sch-timeaxis-cell',
      offset: [10, 10]
    }, {
      waitForSelector: '.b-sch-scheduletip:not(.b-hidden)',
      desc: 'Shown'
    });
  });
  t.it('Clock template should respect time axis resolution', function (t) {
    scheduler.eventStore.clear();
    scheduler.on('beforedragcreatefinalize', function (_ref2) {
      var context = _ref2.context;
      context.finalize(false);
      return false;
    });
    t.chain({
      moveMouseTo: [0, 0]
    }, {
      waitForEvent: [scheduler, 'presetChange'],
      trigger: function trigger() {
        return scheduler.zoomOutFull();
      }
    }, // Don't use `offset` here, because it will fail in FF
    {
      moveMouseTo: '.b-sch-timeaxis-cell'
    }, {
      waitForSelector: '.b-sch-scheduletip:not(.b-hidden) .b-sch-clock-day',
      desc: 'Waiting for cell tooltip'
    }, {
      mouseDown: null
    }, {
      moveMouseBy: [[100, 0]]
    }, {
      waitForSelector: '.b-tooltip:not(.b-hidden) .b-sch-clock-day',
      desc: 'Waiting for drag tooltip'
    }, {
      mouseUp: null
    }, {
      waitForEvent: [scheduler, 'presetChange'],
      trigger: function trigger() {
        return scheduler.zoomToLevel('hourAndDay');
      }
    }, {
      moveMouseTo: '.b-grid-header'
    }, {
      waitForSelectorNotFound: '.b-sch-scheduletip:not(.b-hidden)',
      desc: 'Waiting for cell tooltip to hide'
    }, {
      moveMouseTo: '.b-sch-timeaxis-cell'
    }, {
      waitForSelector: '.b-sch-scheduletip:not(.b-hidden) .b-sch-clock-hour',
      desc: 'Waiting for cell tooltip'
    }, {
      mouseDown: null
    }, {
      moveMouseBy: [[100, 0]]
    }, {
      waitForSelector: '.b-tooltip:not(.b-hidden) .b-sch-clock-hour',
      desc: 'Waiting for drag tooltip'
    }, {
      mouseUp: null
    });
  });
  t.it('Hour and minute indicators are rotating', /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              scheduler.destroy();
              scheduler = t.getScheduler({
                appendTo: document.body,
                viewPreset: 'hourAndDay',
                startDate: new Date(2018, 1, 1),
                endDate: new Date(2018, 1, 1, 12)
              });
              _context2.next = 4;
              return t.waitForProjectReady();

            case 4:
              t.waitForSelector('.b-sch-timeaxis-cell', function () {
                var headers = Array.from(scheduler.element.querySelectorAll('.b-sch-header-row-main .b-sch-header-timeaxis-cell')),
                    steps = [];
                headers.forEach(function (el, i) {
                  steps.push({
                    moveMouseTo: el,
                    offset: ['25%', '200%']
                  }, {
                    waitForSelector: '.b-sch-hour-indicator'
                  }, function (next, indicatorEl) {
                    var minuteIndicator = document.body.querySelector('.b-sch-minute-indicator');

                    if (i * 2 % 2 === 0) {
                      t.is(minuteIndicator.style.transform, 'rotate(0deg)', 'Minute indicator is ok');
                    } else {
                      t.is(minuteIndicator.style.transform, 'rotate(180deg)', 'Minute indicator is ok');
                    }

                    t.is(indicatorEl[0].style.transform, "rotate(".concat(i * 30, "deg)"), 'Hour indicator is ok');
                    next();
                  }, {
                    moveMouseTo: el,
                    offset: ['75%', '200%']
                  }, {
                    waitForSelector: '.b-sch-hour-indicator'
                  }, function (next, indicatorEl) {
                    var minuteIndicator = document.body.querySelector('.b-sch-minute-indicator');

                    if ((i * 2 + 1) % 2 === 0) {
                      t.is(minuteIndicator.style.transform, 'rotate(0deg)', 'Minute indicator is ok');
                    } else {
                      t.is(minuteIndicator.style.transform, 'rotate(180deg)', 'Minute indicator is ok');
                    }

                    t.is(indicatorEl[0].style.transform, "rotate(".concat(i * 30, "deg)"), 'Hour indicator is ok');
                    next();
                  });
                });
                t.chain(steps);
              });

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }());
  t.it('mousemove over the ScheduleTooltip should not crash', function (t) {
    scheduler.destroy();
    scheduler = t.getScheduler({
      features: {
        scheduleTooltip: {
          generateTipContent: function generateTipContent(_ref4) {
            var date = _ref4.date,
                resourceRecord = _ref4.resourceRecord;
            return "\n                            <dl>\n                                <dt>Date</dt><dd>".concat(date, "</dd>\n                                <dt>Resource</dt><dd>").concat(resourceRecord.name, "</dd>\n                            </dl>\n                        ");
          }
        }
      },
      startDate: new Date(2018, 1, 1),
      endDate: new Date(2018, 1, 1, 12)
    }); // Mouseover the ScheduleTip which is constrained at the bottom of the screen.
    // Should not crash

    t.chain({
      moveMouseTo: [180, 170]
    }, {
      waitForSelector: '.b-sch-scheduletip'
    }, {
      moveMouseTo: [280, 170]
    }, {
      waitForSelector: '.b-sch-scheduletip'
    }, {
      moveMouseTo: [980, 730]
    }, {
      waitForSelector: '.b-sch-scheduletip'
    }, {
      moveMouseTo: [846, 749]
    });
  });
  t.it('Should not crash if encountering a DOM element with `b-sch-event-wrap` class outside Scheduler', /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
      var div;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              scheduler.eventStore.removeAll();
              _context3.next = 3;
              return t.waitForProjectReady();

            case 3:
              // Mouseover the ScheduleTip which is constrained at the bottom of the screen.
              // Should not crash
              div = document.createElement('div');
              div.className = 'b-sch-event-wrap outside';
              div.style.cssText = "\n            position:absolute;\n            top : 100px;\n            left : 100px;\n            width:100px;\n            height:100px;\n            background : #ddd;\n            z-index : 2;\n        ";
              document.body.appendChild(div);
              t.chain({
                moveMouseTo: '.b-sch-timeaxis-cell'
              }, {
                waitForSelector: '.b-tooltip'
              }, {
                moveMouseTo: '.outside'
              });

            case 8:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x4) {
      return _ref5.apply(this, arguments);
    };
  }());
  t.it('Should support disabling', function (t) {
    scheduler.features.scheduleTooltip.disabled = true;
    t.chain({
      moveMouseTo: '.b-sch-timeaxis-cell',
      offset: [10, 10]
    }, {
      waitFor: 250
    }, function (next) {
      t.selectorNotExists('.b-sch-scheduletip', 'No tooltip');
      scheduler.features.scheduleTooltip.disabled = false;
      next();
    }, {
      moveMouseTo: [0, 0]
    }, {
      moveMouseTo: '.b-sch-timeaxis-cell',
      offset: [10, 10]
    }, {
      waitForSelector: '.b-sch-scheduletip'
    });
  });
  t.it('Should be able to fully control the HTML shown in the tooltip using generateTipContent', function (t) {
    scheduler && scheduler.destroy();
    scheduler = t.getScheduler({
      features: {
        scheduleTooltip: {
          generateTipContent: function generateTipContent(_ref6) {
            var date = _ref6.date,
                event = _ref6.event,
                resourceRecord = _ref6.resourceRecord;
            t.isInstanceOf(date, Date, 'Date');
            t.isInstanceOf(event, Event, 'Event');
            t.is(resourceRecord.name, 'Mike', 'Correct resource');
            return "\n                            <dl>\n                                <dt>Date</dt><dd> ".concat(date, "</dd>\n                                <dt>Resource</dt><dd> ").concat(resourceRecord.name, "</dd>\n                            </dl>\n                        ");
          }
        }
      }
    });
    t.chain({
      moveMouseTo: '.b-sch-timeaxis-cell',
      offset: [0, 0]
    }, {
      moveMouseTo: '.b-sch-timeaxis-cell',
      offset: [10, 10]
    }, {
      waitForSelector: '.b-sch-scheduletip:not(.b-hidden):contains(Jan 03 2011)'
    }, {
      waitForSelector: '.b-sch-scheduletip:not(.b-hidden):contains(Mike)'
    });
  });
  t.it('Should be able to customize the text shown in the tooltip using getText', function (t) {
    scheduler && scheduler.destroy();
    scheduler = t.getScheduler({
      features: {
        scheduleTooltip: {
          getText: function getText(date, event, resource) {
            t.isInstanceOf(date, Date, 'Date');
            t.isInstanceOf(event, Event, 'Event');
            t.is(resource.name, 'Mike', 'Resource was passed');
            return resource.name;
          }
        }
      }
    });
    t.chain({
      moveMouseTo: '.b-sch-timeaxis-cell',
      offset: [0, 0]
    }, {
      moveMouseTo: '.b-sch-timeaxis-cell',
      offset: [10, 10]
    }, {
      waitForSelector: '.b-sch-scheduletip:not(.b-hidden):contains(Mike)'
    });
  });
});