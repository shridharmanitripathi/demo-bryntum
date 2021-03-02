function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var scheduler;

  function createSingleSummary() {
    return _createSingleSummary.apply(this, arguments);
  }

  function _createSingleSummary() {
    _createSingleSummary = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              scheduler = t.getScheduler({
                viewPreset: 'hourAndDay',
                height: 300,
                features: {
                  summary: {
                    renderer: function renderer(_ref11) {
                      var events = _ref11.events;
                      return events.length || '';
                    }
                  }
                },
                startDate: new Date(2017, 0, 1),
                endDate: new Date(2017, 0, 1, 8),
                columns: [{
                  text: 'Name',
                  field: 'name',
                  width: 200,
                  locked: true,
                  sum: 'count',
                  summaryRenderer: function summaryRenderer(_ref12) {
                    var sum = _ref12.sum;
                    return 'Total: ' + sum;
                  }
                }],
                resources: [{
                  id: 1,
                  name: 'Steve',
                  job: 'Carpenter'
                }, {
                  id: 2,
                  name: 'John',
                  job: 'Contractor'
                }],
                events: [{
                  id: 1,
                  name: 'Work',
                  resourceId: 1,
                  startDate: new Date(2017, 0, 1, 1),
                  endDate: new Date(2017, 0, 1, 2)
                }, {
                  id: 2,
                  name: 'Play',
                  resourceId: 2,
                  startDate: new Date(2017, 0, 1, 1),
                  endDate: new Date(2017, 0, 1, 2)
                }, {
                  id: 3,
                  name: 'Plan',
                  resourceId: 2,
                  startDate: new Date(2017, 0, 1, 3),
                  endDate: new Date(2017, 0, 1, 4)
                }]
              });
              _context10.next = 3;
              return t.waitForProjectReady();

            case 3:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    }));
    return _createSingleSummary.apply(this, arguments);
  }

  function createMultiSummary() {
    return _createMultiSummary.apply(this, arguments);
  }

  function _createMultiSummary() {
    _createMultiSummary = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              scheduler = t.getScheduler({
                viewPreset: 'hourAndDay',
                height: 300,
                features: {
                  summary: {
                    summaries: [{
                      label: 'Count',
                      renderer: function renderer(_ref13) {
                        var events = _ref13.events;
                        return events.length || '';
                      }
                    }, {
                      label: 'Steve',
                      renderer: function renderer(_ref14) {
                        var events = _ref14.events;
                        return events.filter(function (event) {
                          return event.resource.name === 'Steve';
                        }).length || '';
                      }
                    }]
                  }
                },
                startDate: new Date(2017, 0, 1),
                endDate: new Date(2017, 0, 1, 8),
                columns: [{
                  text: 'Name',
                  field: 'name',
                  width: 200,
                  locked: true,
                  sum: 'count',
                  summaryRenderer: function summaryRenderer(_ref15) {
                    var sum = _ref15.sum;
                    return 'Total: ' + sum;
                  }
                }],
                resources: [{
                  id: 1,
                  name: 'Steve',
                  job: 'Carpenter'
                }, {
                  id: 2,
                  name: 'John',
                  job: 'Contractor'
                }],
                events: [{
                  id: 1,
                  name: 'Work',
                  resourceId: 1,
                  startDate: new Date(2017, 0, 1, 1),
                  endDate: new Date(2017, 0, 1, 2)
                }, {
                  id: 2,
                  name: 'Play',
                  resourceId: 2,
                  startDate: new Date(2017, 0, 1, 1),
                  endDate: new Date(2017, 0, 1, 2)
                }, {
                  id: 3,
                  name: 'Plan',
                  resourceId: 2,
                  startDate: new Date(2017, 0, 1, 3),
                  endDate: new Date(2017, 0, 1, 4)
                }]
              });
              _context11.next = 3;
              return t.waitForProjectReady();

            case 3:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    }));
    return _createMultiSummary.apply(this, arguments);
  }

  t.beforeEach(function (t) {
    var _scheduler;

    return (_scheduler = scheduler) === null || _scheduler === void 0 ? void 0 : _scheduler.destroy();
  });
  t.it('Rendering sanity checks', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return createSingleSummary();

            case 2:
              t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(1)', '');
              t.contentLike('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(2) .b-timeaxis-summary-value', /^2$/);
              t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(3)', '');
              t.contentLike('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(4) .b-timeaxis-summary-value', /^1$/);
              t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(5)', '');
              t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(6)', '');
              t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(7)', '');
              t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(8)', '');
              t.hasSameWidth('.b-grid-footer.b-sch-timeaxiscolumn', '.b-grid-header.b-sch-timeaxiscolumn', 'footer el sized as header el');
              t.hasSameWidth('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(1)', '.b-sch-header-row-main .b-sch-header-timeaxis-cell:nth-child(1)');
              t.hasSameWidth('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(2)', '.b-sch-header-row-main .b-sch-header-timeaxis-cell:nth-child(2)');
              t.hasSameWidth('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(3)', '.b-sch-header-row-main .b-sch-header-timeaxis-cell:nth-child(3)');
              t.hasSameWidth('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(4)', '.b-sch-header-row-main .b-sch-header-timeaxis-cell:nth-child(4)');
              t.hasSameWidth('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(5)', '.b-sch-header-row-main .b-sch-header-timeaxis-cell:nth-child(5)');
              t.hasSameWidth('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(6)', '.b-sch-header-row-main .b-sch-header-timeaxis-cell:nth-child(6)');
              t.hasSameWidth('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(7)', '.b-sch-header-row-main .b-sch-header-timeaxis-cell:nth-child(7)');

            case 18:
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
  t.it('Should refresh once after data set', /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
      var spy;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return createSingleSummary();

            case 2:
              spy = t.spyOn(scheduler.features.summary, 'updateScheduleSummaries');
              scheduler.events = [];
              _context2.next = 6;
              return t.waitForProjectReady();

            case 6:
              t.expect(spy).toHaveBeenCalled(1);

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }());
  t.it('Should refresh once after event remove', /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
      var spy;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return createSingleSummary();

            case 2:
              spy = t.spyOn(scheduler.features.summary, 'updateScheduleSummaries');
              scheduler.eventStore.remove(scheduler.eventStore.last);
              _context3.next = 6;
              return t.waitForProjectReady();

            case 6:
              t.expect(spy).toHaveBeenCalled(1);
              t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(1)', '');
              t.contentLike('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(2) .b-timeaxis-summary-value', /^2$/);
              t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(3)', '');
              t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(4)', '');
              t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(5)', '');
              t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(6)', '');
              t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(7)', '');
              t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(8)', '');

            case 15:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }());
  t.it('Should not count event that has no resource in view', /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(t) {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return createSingleSummary();

            case 2:
              scheduler.eventStore.last.resourceId = null;
              _context4.next = 5;
              return t.waitForProjectReady();

            case 5:
              t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(1)', '');
              t.contentLike('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(2) .b-timeaxis-summary-value', /^2$/);
              t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(3)', '');
              t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(4)', '');
              t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(5)', '');
              t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(6)', '');
              t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(7)', '');
              t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(8)', '');

            case 13:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    return function (_x4) {
      return _ref4.apply(this, arguments);
    };
  }());
  t.it('Should not count filtered out event ', /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(t) {
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return createSingleSummary();

            case 2:
              scheduler.eventStore.filter(function (ev) {
                return ev.name !== 'Plan';
              });
              t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(1)', '');
              t.contentLike('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(2) .b-timeaxis-summary-value', /^2$/);
              t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(3)', '');
              t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(4)', '');
              t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(5)', '');
              t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(6)', '');
              t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(7)', '');
              t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(8)', '');

            case 11:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    return function (_x5) {
      return _ref5.apply(this, arguments);
    };
  }());
  t.it('Should redraw ticks when time axis view model is changed', /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(t) {
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return createSingleSummary();

            case 2:
              t.selectorCountIs('.b-grid-footer.b-sch-timeaxiscolumn .b-timeaxis-tick', 8);
              t.is(document.querySelector('.b-grid-footer.b-sch-timeaxiscolumn .b-timeaxis-tick').offsetWidth, document.querySelector('.b-sch-header-row:last-child .b-sch-header-timeaxis-cell').offsetWidth);
              scheduler.setTimeSpan(new Date(2017, 0, 1, 8), new Date(2017, 0, 1, 18));
              t.selectorCountIs('.b-grid-footer.b-sch-timeaxiscolumn .b-timeaxis-tick', 10);
              scheduler.setTimeSpan(new Date(2017, 0, 1, 8), new Date(2017, 0, 1, 18));
              scheduler.timeAxisViewModel.setTickSize(200);
              t.is(document.querySelector('.b-grid-footer.b-sch-timeaxiscolumn .b-timeaxis-tick').offsetWidth, document.querySelector('.b-sch-header-row:last-child .b-sch-header-timeaxis-cell').offsetWidth);

            case 9:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));

    return function (_x6) {
      return _ref6.apply(this, arguments);
    };
  }());
  t.it('Multiple summaries should be supported', /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(t) {
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return createMultiSummary();

            case 2:
              t.selectorExists('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(2) :nth-child(1):textEquals(2)', 'First sum correct');
              t.selectorExists('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(2) :nth-child(2):textEquals(1)', 'Second sum correct');
              t.selectorExists('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(4) :nth-child(1):textEquals(1)', 'Third sum correct');
              t.chain({
                moveMouseTo: '.b-grid-footer.b-sch-timeaxiscolumn :nth-child(2) :nth-child(1)'
              }, {
                waitForSelector: '.b-timeaxis-summary-tip'
              }, function () {
                t.selectorExists('.b-timeaxis-summary-tip label:textEquals(Count)', 'Count label found');
                t.selectorExists('.b-timeaxis-summary-tip .b-timeaxis-summary-value:first-of-type:textEquals(2)', 'Correct sum');
                t.selectorExists('.b-timeaxis-summary-tip label:textEquals(Steve)', 'Steve label found');
                t.selectorExists('.b-timeaxis-summary-tip .b-timeaxis-summary-value:textEquals(1)', 'Correct sum');
              });

            case 6:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }));

    return function (_x7) {
      return _ref7.apply(this, arguments);
    };
  }());
  t.it('Should support disabling', /*#__PURE__*/function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(t) {
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return createSingleSummary();

            case 2:
              scheduler.features.summary.disabled = true;
              t.elementIsNotVisible(scheduler.footerContainer, 'Summaries hidden');
              scheduler.features.summary.disabled = false;
              t.elementIsVisible(scheduler.footerContainer, 'Summaries shown');

            case 6:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    }));

    return function (_x8) {
      return _ref8.apply(this, arguments);
    };
  }()); // https://github.com/bryntum/support/issues/70

  t.it('Should align with columns when autoAdjustTimeAxis is set to false', /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(t) {
      var middleHeaderCells, summaryCells;
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return t.getSchedulerAsync({
                viewPreset: 'weekAndMonth',
                autoAdjustTimeAxis: false,
                features: {
                  summary: {
                    renderer: function renderer(_ref10) {
                      var events = _ref10.events;
                      return events.length || '';
                    }
                  }
                }
              });

            case 2:
              middleHeaderCells = t.query('.b-sch-header-row-1 .b-sch-header-timeaxis-cell'), summaryCells = t.query('.b-grid-footer.b-sch-timeaxiscolumn .b-timeaxis-tick');
              summaryCells.forEach(function (element, idx) {
                t.is(element.offsetWidth, middleHeaderCells[idx].offsetWidth, "Summary column for ".concat(middleHeaderCells[idx].innerText, " aligned"));
              });

            case 4:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    }));

    return function (_x9) {
      return _ref9.apply(this, arguments);
    };
  }());
});