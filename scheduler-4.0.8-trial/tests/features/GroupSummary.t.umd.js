function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var scheduler;

  var createScheduler = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(config) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              scheduler = t.getScheduler(Object.assign({
                viewPreset: 'hourAndDay',
                height: 300,
                features: {
                  group: 'job',
                  groupSummary: {
                    summaries: [{
                      label: 'Count',
                      renderer: function renderer(_ref2) {
                        var events = _ref2.events;
                        return events.length;
                      }
                    }, {
                      label: 'Carpenters',
                      renderer: function renderer(_ref3) {
                        var events = _ref3.events;
                        return events.filter(function (event) {
                          return event.resource.job === 'Carpenter';
                        }).length;
                      }
                    }]
                  },
                  eventTooltip: false,
                  scheduleTooltip: false,
                  eventEdit: false
                },
                startDate: new Date(2017, 0, 1),
                endDate: new Date(2017, 0, 1, 8),
                columns: [{
                  text: 'Name',
                  field: 'name',
                  width: 200,
                  summaries: [{
                    sum: 'count',
                    label: 'Persons'
                  }]
                }],
                resources: [{
                  id: 1,
                  name: 'Steve',
                  job: 'Carpenter'
                }, {
                  id: 2,
                  name: 'Linda',
                  job: 'Carpenter'
                }, {
                  id: 3,
                  name: 'John',
                  job: 'Painter'
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
                }, {
                  id: 4,
                  name: 'Plan',
                  resourceId: 3,
                  startDate: new Date(2017, 0, 1, 3),
                  endDate: new Date(2017, 0, 1, 4)
                }]
              }, config));
              _context.next = 3;
              return t.waitForProjectReady(scheduler);

            case 3:
              return _context.abrupt("return", scheduler);

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function createScheduler(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  t.beforeEach(function () {
    scheduler && scheduler.destroy();
  });
  t.it('Rendering sanity checks', /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return createScheduler();

            case 2:
              scheduler = _context2.sent;
              t.contentLike('.b-grid-cell.b-group-title', 'Carpenter (2)');
              t.selectorExists('.b-grid-subgrid-locked .b-grid-summary-label:textEquals(Persons)');
              t.selectorExists('.b-grid-subgrid-locked .b-grid-summary-value:textEquals(2)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(1):textEquals(00)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(2):textEquals(22)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(3):textEquals(00)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(4):textEquals(11)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(5):textEquals(00)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(6):textEquals(00)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(7):textEquals(00)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(8):textEquals(00)');
              t.hasSameWidth('.b-timeaxis-group-summary :nth-child(1)', '.b-sch-header-row-main .b-sch-header-timeaxis-cell:nth-child(1)');
              t.hasSameWidth('.b-timeaxis-group-summary :nth-child(2)', '.b-sch-header-row-main .b-sch-header-timeaxis-cell:nth-child(2)');
              t.hasSameWidth('.b-timeaxis-group-summary :nth-child(3)', '.b-sch-header-row-main .b-sch-header-timeaxis-cell:nth-child(3)');
              t.hasSameWidth('.b-timeaxis-group-summary :nth-child(4)', '.b-sch-header-row-main .b-sch-header-timeaxis-cell:nth-child(4)');
              t.hasSameWidth('.b-timeaxis-group-summary :nth-child(5)', '.b-sch-header-row-main .b-sch-header-timeaxis-cell:nth-child(5)');
              t.hasSameWidth('.b-timeaxis-group-summary :nth-child(6)', '.b-sch-header-row-main .b-sch-header-timeaxis-cell:nth-child(6)');
              t.hasSameWidth('.b-timeaxis-group-summary :nth-child(7)', '.b-sch-header-row-main .b-sch-header-timeaxis-cell:nth-child(7)');
              t.hasSameWidth('.b-timeaxis-group-summary :nth-child(8)', '.b-sch-header-row-main .b-sch-header-timeaxis-cell:nth-child(8)');

            case 22:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x2) {
      return _ref4.apply(this, arguments);
    };
  }());
  t.it('Should refresh after event move', /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return createScheduler();

            case 2:
              scheduler = _context3.sent;
              scheduler.eventStore.first.setStartDate(new Date(2017, 0, 1, 2), true);
              _context3.next = 6;
              return scheduler.project.commitAsync();

            case 6:
              t.selectorExists('.b-timeaxis-group-summary :nth-child(1):textEquals(00)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(2):textEquals(11)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(3):textEquals(11)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(4):textEquals(11)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(5):textEquals(00)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(6):textEquals(00)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(7):textEquals(00)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(8):textEquals(00)');

            case 14:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x3) {
      return _ref5.apply(this, arguments);
    };
  }());
  t.it('Should refresh after event remove', /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(t) {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return createScheduler();

            case 2:
              scheduler = _context4.sent;
              scheduler.eventStore.first.remove();
              _context4.next = 6;
              return scheduler.project.commitAsync();

            case 6:
              t.selectorExists('.b-timeaxis-group-summary :nth-child(1):textEquals(00)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(2):textEquals(11)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(3):textEquals(00)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(4):textEquals(11)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(5):textEquals(00)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(6):textEquals(00)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(7):textEquals(00)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(8):textEquals(00)');

            case 14:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    return function (_x4) {
      return _ref6.apply(this, arguments);
    };
  }());
  t.it('Should not count event that has no resource in view', /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(t) {
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return createScheduler();

            case 2:
              scheduler = _context5.sent;
              scheduler.eventStore.first.resourceId = null;
              _context5.next = 6;
              return t.waitForProjectReady();

            case 6:
              t.selectorExists('.b-timeaxis-group-summary :nth-child(1):textEquals(00)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(2):textEquals(11)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(3):textEquals(00)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(4):textEquals(11)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(5):textEquals(00)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(6):textEquals(00)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(7):textEquals(00)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(8):textEquals(00)');

            case 14:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    return function (_x5) {
      return _ref7.apply(this, arguments);
    };
  }());
  t.it('Should not count filtered out event ', /*#__PURE__*/function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(t) {
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return createScheduler();

            case 2:
              scheduler = _context6.sent;
              scheduler.eventStore.filter(function (ev) {
                return ev.name !== 'Plan';
              });
              t.selectorExists('.b-timeaxis-group-summary :nth-child(1):textEquals(00)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(2):textEquals(22)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(3):textEquals(00)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(4):textEquals(00)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(5):textEquals(00)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(6):textEquals(00)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(7):textEquals(00)');
              t.selectorExists('.b-timeaxis-group-summary :nth-child(8):textEquals(00)');

            case 12:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));

    return function (_x6) {
      return _ref8.apply(this, arguments);
    };
  }());
  t.it('Should redraw ticks when time axis view model is changed', /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(t) {
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return createScheduler();

            case 2:
              scheduler = _context7.sent;
              t.selectorCountIs('.b-group-footer[data-index="3"] .b-timeaxis-tick', 8);
              t.is(document.querySelector('.b-group-footer .b-timeaxis-tick').offsetWidth, document.querySelector('.b-sch-header-row:last-child .b-sch-header-timeaxis-cell').offsetWidth);
              scheduler.setTimeSpan(new Date(2017, 0, 1, 8), new Date(2017, 0, 1, 18));
              t.selectorCountIs('.b-group-footer[data-index="3"] .b-timeaxis-tick', 10);
              scheduler.setTimeSpan(new Date(2017, 0, 1, 8), new Date(2017, 0, 1, 18));
              scheduler.timeAxisViewModel.setTickSize(200);
              t.is(document.querySelector('.b-group-footer .b-timeaxis-tick').offsetWidth, document.querySelector('.b-sch-header-row:last-child .b-sch-header-timeaxis-cell').offsetWidth);

            case 10:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }));

    return function (_x7) {
      return _ref9.apply(this, arguments);
    };
  }());
  t.it('Should display tooltip', /*#__PURE__*/function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(t) {
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return createScheduler();

            case 2:
              scheduler = _context8.sent;
              t.chain({
                moveMouseTo: '.b-timeaxis-group-summary .b-timeaxis-tick:nth-child(2) .b-timeaxis-summary-value'
              }, {
                waitForSelector: '.b-timeaxis-summary-tip'
              }, function () {
                t.selectorExists('.b-timeaxis-summary-tip label:textEquals(Count)', 'Count label found');
                t.selectorExists('.b-timeaxis-summary-tip .b-timeaxis-summary-value:first-of-type:textEquals(2)', 'Correct sum');
                t.selectorExists('.b-timeaxis-summary-tip label:textEquals(Carpenters)', 'Carpenters label found');
                t.selectorExists('.b-timeaxis-summary-tip .b-timeaxis-summary-value:textEquals(2)', 'Correct sum');
              });

            case 4:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    }));

    return function (_x8) {
      return _ref10.apply(this, arguments);
    };
  }()); // https://app.assembla.com/spaces/bryntum/tickets/7619

  t.it('Should not create a new event when dblclicking footer', /*#__PURE__*/function () {
    var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(t) {
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return createScheduler();

            case 2:
              scheduler = _context9.sent;
              t.chain({
                dblclick: '.b-timeaxis-group-summary'
              }, function () {
                t.selectorCountIs('.b-sch-event', 4, 'No new event rendered');
                t.is(scheduler.eventStore.count, 4, 'No new event in store');
              });

            case 4:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    }));

    return function (_x9) {
      return _ref11.apply(this, arguments);
    };
  }());
  t.it('Should support disabling', /*#__PURE__*/function () {
    var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(t) {
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return createScheduler();

            case 2:
              scheduler = _context10.sent;
              scheduler.features.groupSummary.disabled = true;
              t.selectorNotExists('.b-timeaxis-group-summary', 'No summary');
              scheduler.features.groupSummary.disabled = false;
              t.selectorExists('.b-timeaxis-group-summary', 'Summary shown');

            case 7:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    }));

    return function (_x10) {
      return _ref12.apply(this, arguments);
    };
  }());
  t.it('Should not show empty meta rows after remove all from the group', /*#__PURE__*/function () {
    var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(t) {
      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return createScheduler();

            case 2:
              scheduler = _context11.sent;
              t.chain({
                waitForRowsVisible: scheduler
              }, {
                contextmenu: '.b-grid-cell:textEquals(Steve)'
              }, {
                click: '.b-menu-text:textEquals(Delete record)'
              }, {
                contextmenu: '.b-grid-cell:textEquals(Linda)'
              }, {
                click: '.b-menu-text:textEquals(Delete record)'
              }, {
                waitForSelectorNotFound: '.b-group-title:textEquals(Carpenter (0))'
              }, function () {
                t.pass('Empty group not shown');
              });

            case 4:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    }));

    return function (_x11) {
      return _ref13.apply(this, arguments);
    };
  }());
  t.it('collapseToHeader', /*#__PURE__*/function () {
    var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(t) {
      var _scheduler, rowManager, expandedRowCount, schedulerSummaryRow;

      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return createScheduler();

            case 2:
              scheduler = _context12.sent;
              scheduler.features.groupSummary.collapseToHeader = true;
              _scheduler = scheduler, rowManager = _scheduler.rowManager, expandedRowCount = rowManager.rowCount;
              _context12.next = 7;
              return scheduler.scrollable.scrollTo(null, scheduler.scrollable.maxY);

            case 7:
              _context12.next = 9;
              return t.click('[data-id="group-header-Painter"] .b-group-title');

            case 9:
              t.is(rowManager.rowCount, expandedRowCount - 2);
              schedulerSummaryRow = rowManager.lastVisibleRow.elements.normal;
              t.selectorCountIs('.b-timeaxis-tick:nth-child(1) .b-timeaxis-summary-value:nth-child(1):textEquals(0)', schedulerSummaryRow, 1);
              t.selectorCountIs('.b-timeaxis-tick:nth-child(1) .b-timeaxis-summary-value:nth-child(2):textEquals(0)', schedulerSummaryRow, 1);
              t.selectorCountIs('.b-timeaxis-tick:nth-child(2) .b-timeaxis-summary-value:nth-child(1):textEquals(0)', schedulerSummaryRow, 1);
              t.selectorCountIs('.b-timeaxis-tick:nth-child(2) .b-timeaxis-summary-value:nth-child(2):textEquals(0)', schedulerSummaryRow, 1);
              t.selectorCountIs('.b-timeaxis-tick:nth-child(3) .b-timeaxis-summary-value:nth-child(1):textEquals(0)', schedulerSummaryRow, 1);
              t.selectorCountIs('.b-timeaxis-tick:nth-child(3) .b-timeaxis-summary-value:nth-child(2):textEquals(0)', schedulerSummaryRow, 1);
              t.selectorCountIs('.b-timeaxis-tick:nth-child(4) .b-timeaxis-summary-value:nth-child(1):textEquals(1)', schedulerSummaryRow, 1);
              t.selectorCountIs('.b-timeaxis-tick:nth-child(4) .b-timeaxis-summary-value:nth-child(2):textEquals(0)', schedulerSummaryRow, 1);
              t.selectorCountIs('.b-timeaxis-tick:nth-child(5) .b-timeaxis-summary-value:nth-child(1):textEquals(0)', schedulerSummaryRow, 1);
              t.selectorCountIs('.b-timeaxis-tick:nth-child(5) .b-timeaxis-summary-value:nth-child(2):textEquals(0)', schedulerSummaryRow, 1);
              t.selectorCountIs('.b-timeaxis-tick:nth-child(6) .b-timeaxis-summary-value:nth-child(1):textEquals(0)', schedulerSummaryRow, 1);
              t.selectorCountIs('.b-timeaxis-tick:nth-child(6) .b-timeaxis-summary-value:nth-child(2):textEquals(0)', schedulerSummaryRow, 1);
              t.selectorCountIs('.b-timeaxis-tick:nth-child(7) .b-timeaxis-summary-value:nth-child(1):textEquals(0)', schedulerSummaryRow, 1);
              t.selectorCountIs('.b-timeaxis-tick:nth-child(7) .b-timeaxis-summary-value:nth-child(2):textEquals(0)', schedulerSummaryRow, 1);
              t.selectorCountIs('.b-timeaxis-tick:nth-child(8) .b-timeaxis-summary-value:nth-child(1):textEquals(0)', schedulerSummaryRow, 1);
              t.selectorCountIs('.b-timeaxis-tick:nth-child(8) .b-timeaxis-summary-value:nth-child(2):textEquals(0)', schedulerSummaryRow, 1); // Collapse Capenter grouo

              _context12.next = 29;
              return t.click('[data-id="group-header-Carpenter"] .b-group-title');

            case 29:
              t.is(rowManager.rowCount, 2); // Expand Capenter grouo

              _context12.next = 32;
              return t.click('[data-id="group-header-Carpenter"] .b-group-title');

            case 32:
              t.is(rowManager.rowCount, expandedRowCount - 2); // Data cell in the scheduler part must be empty

              t.selectorCountIs('.b-timeline-subgrid .b-grid-row[data-index="1"] .b-sch-timeaxis-cell:textEquals()', 1);

            case 34:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12);
    }));

    return function (_x12) {
      return _ref14.apply(this, arguments);
    };
  }()); // https://github.com/bryntum/support/issues/1897

  t.it('Should pass group parameters to renderer', /*#__PURE__*/function () {
    var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(t) {
      return regeneratorRuntime.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _context13.next = 2;
              return createScheduler({
                features: {
                  group: 'job',
                  groupSummary: {
                    summaries: [{
                      label: 'Count',
                      renderer: function renderer(_ref16) {
                        var events = _ref16.events,
                            groupRecord = _ref16.groupRecord,
                            groupField = _ref16.groupField,
                            groupValue = _ref16.groupValue;
                        t.ok(groupRecord);
                        t.is(groupField, 'job');
                        t.ok(['Painter', 'Carpenter'].includes(groupValue));
                        return events.length;
                      }
                    }]
                  },
                  eventTooltip: false,
                  scheduleTooltip: false,
                  eventEdit: false
                }
              });

            case 2:
              scheduler = _context13.sent;

            case 3:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13);
    }));

    return function (_x13) {
      return _ref15.apply(this, arguments);
    };
  }()); // https://github.com/bryntum/support/issues/70

  t.it('Should align with columns when autoAdjustTimeAxis is set to false', /*#__PURE__*/function () {
    var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(t) {
      var middleHeaderCells, groupSummaryCells1, groupSummaryCells2;
      return regeneratorRuntime.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              _context14.next = 2;
              return createScheduler({
                viewPreset: 'weekAndMonth',
                autoAdjustTimeAxis: false,
                startDate: new Date(2017, 0, 4),
                endDate: new Date(2017, 0, 9),
                events: [{
                  id: 1,
                  name: 'Work',
                  resourceId: 1,
                  startDate: new Date(2017, 0, 4),
                  endDate: new Date(2017, 0, 5)
                }, {
                  id: 2,
                  name: 'Play',
                  resourceId: 2,
                  startDate: new Date(2017, 0, 5),
                  endDate: new Date(2017, 0, 6)
                }, {
                  id: 3,
                  name: 'Plan',
                  resourceId: 2,
                  startDate: new Date(2017, 0, 6),
                  endDate: new Date(2017, 0, 7)
                }, {
                  id: 4,
                  name: 'Plan',
                  resourceId: 3,
                  startDate: new Date(2017, 0, 7),
                  endDate: new Date(2017, 0, 8)
                }, {
                  id: 5,
                  name: 'Work',
                  resourceId: 3,
                  startDate: new Date(2017, 0, 8),
                  endDate: new Date(2017, 0, 10)
                }],
                features: {
                  group: 'job',
                  groupSummary: {
                    summaries: [{
                      label: 'Count',
                      renderer: function renderer(_ref18) {
                        var events = _ref18.events;
                        return events.length;
                      }
                    }]
                  },
                  eventTooltip: false,
                  scheduleTooltip: false,
                  eventEdit: false
                }
              });

            case 2:
              scheduler = _context14.sent;
              middleHeaderCells = t.query('.b-sch-header-row-1 .b-sch-header-timeaxis-cell'), groupSummaryCells1 = t.query('.b-group-footer[data-id="group-footer-Carpenter"] .b-timeaxis-group-summary .b-timeaxis-tick'), groupSummaryCells2 = t.query('.b-group-footer[data-id="group-footer-Painter"] .b-timeaxis-group-summary .b-timeaxis-tick');
              groupSummaryCells1.forEach(function (element, idx) {
                t.is(element.offsetWidth, middleHeaderCells[idx].offsetWidth, "\"Carpenter\" group summary column for ".concat(middleHeaderCells[idx].innerText, " aligned"));
              });
              groupSummaryCells2.forEach(function (element, idx) {
                t.is(element.offsetWidth, middleHeaderCells[idx].offsetWidth, "\"Painter\" group summary column for ".concat(middleHeaderCells[idx].innerText, " aligned"));
              });

            case 6:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14);
    }));

    return function (_x14) {
      return _ref17.apply(this, arguments);
    };
  }());
  t.it('Should not crash when zooming in', /*#__PURE__*/function () {
    var _ref19 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(t) {
      return regeneratorRuntime.wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              _context15.next = 2;
              return createScheduler({
                features: {
                  group: 'job',
                  groupSummary: {
                    summaries: [{
                      label: 'Count',
                      renderer: function renderer(_ref20) {
                        var events = _ref20.events,
                            groupRecord = _ref20.groupRecord,
                            groupField = _ref20.groupField,
                            groupValue = _ref20.groupValue;
                        return events.length;
                      }
                    }]
                  }
                }
              });

            case 2:
              scheduler = _context15.sent;
              scheduler.zoomIn();
              t.pass('Rendered ok');

            case 5:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15);
    }));

    return function (_x15) {
      return _ref19.apply(this, arguments);
    };
  }());
});