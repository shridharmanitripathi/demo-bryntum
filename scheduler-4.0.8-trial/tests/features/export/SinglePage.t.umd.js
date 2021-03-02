function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var scheduler, paperHeight;
  Object.assign(window, {
    DateHelper: DateHelper,
    DomHelper: DomHelper,
    Override: Override,
    DataGenerator: DataGenerator,
    RandomGenerator: RandomGenerator,
    PaperFormat: PaperFormat,
    Rectangle: Rectangle
  });
  t.overrideAjaxHelper();
  t.beforeEach(function () {
    scheduler && scheduler.destroy();
  });

  function fixIE11Height(doc) {
    if (BrowserHelper.isIE11) {
      // IE11 doesn't calculate container height properly, this override is required to make
      // header assertions to pass
      doc.styleSheets[doc.styleSheets.length - 1].addRule('.b-export .b-export-content', 'height: 100% !important;');
    }
  }

  t.it('Should export complete view', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
      var _yield$t$createSchedu;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return t.createSchedulerForExport({
                horizontalPages: 2,
                verticalPages: 2,
                startDate: new Date(2019, 10, 4),
                endDate: new Date(2019, 11, 9)
              });

            case 2:
              _yield$t$createSchedu = _context2.sent;
              scheduler = _yield$t$createSchedu.scheduler;
              paperHeight = _yield$t$createSchedu.paperHeight;
              t.chain( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var html;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return t.getExportHtml(scheduler, {
                          columns: scheduler.columns.visibleColumns.map(function (c) {
                            return c.id;
                          }),
                          exporterType: 'singlepage',
                          range: 'completeview'
                        });

                      case 2:
                        html = _context.sent;
                        t.is(html.length, 1, '1 page is exported');
                        _context.next = 6;
                        return new Promise(function (resolve) {
                          t.setIframe({
                            height: paperHeight,
                            html: html[0].html,
                            onload: function onload(doc, frame) {
                              fixIE11Height(doc);
                              t.ok(t.assertRowsExportedWithoutGaps(doc, false, true), 'Rows exported without gaps');
                              t.ok(t.assertTicksExportedWithoutGaps(doc), 'Ticks exported without gaps');
                              t.is(doc.querySelectorAll('.b-grid-row').length, scheduler.resourceStore.count * 2, 'All resources exported');
                              t.isExportedTickCount(doc, scheduler.timeAxis.count);
                              t.is(doc.querySelectorAll('.b-sch-event').length, scheduler.eventStore.count / 2, 'Event count is correct');
                              frame.remove();
                              resolve();
                            }
                          });
                        });

                      case 6:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              })));

            case 6:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
  t.it('Should export specific range of dates', /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(t) {
      var _yield$t$createSchedu2;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return t.createSchedulerForExport({
                horizontalPages: 2,
                verticalPages: 2,
                startDate: new Date(2019, 10, 4),
                endDate: new Date(2019, 11, 9)
              });

            case 2:
              _yield$t$createSchedu2 = _context4.sent;
              scheduler = _yield$t$createSchedu2.scheduler;
              paperHeight = _yield$t$createSchedu2.paperHeight;
              t.chain( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                var rangeStart, rangeEnd, html;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        rangeStart = new Date(2019, 10, 11);
                        rangeEnd = new Date(2019, 10, 18);
                        _context3.next = 4;
                        return t.getExportHtml(scheduler, {
                          columns: scheduler.columns.visibleColumns.map(function (c) {
                            return c.id;
                          }),
                          exporterType: 'singlepage',
                          scheduleRange: 'daterange',
                          rangeStart: rangeStart,
                          rangeEnd: rangeEnd
                        });

                      case 4:
                        html = _context3.sent;
                        t.is(html.length, 1, '1 page is exported');
                        _context3.next = 8;
                        return new Promise(function (resolve) {
                          t.setIframe({
                            height: paperHeight,
                            html: html[0].html,
                            onload: function onload(doc, frame) {
                              fixIE11Height(doc);
                              t.ok(t.assertRowsExportedWithoutGaps(doc, false, true), 'Rows exported without gaps');
                              t.ok(t.assertTicksExportedWithoutGaps(doc), 'Ticks exported without gaps');
                              t.is(doc.querySelectorAll('.b-grid-row').length, scheduler.resourceStore.count * 2, 'All resources exported');

                              var tickCount = 7,
                                  tickWidth = doc.querySelector('.b-lowest .b-sch-header-timeaxis-cell').offsetWidth,
                                  lockedGridWidth = scheduler.subGrids.locked.scrollable.scrollWidth,
                                  normalGridWidth = tickCount * tickWidth,
                                  splitterWidth = scheduler.resolveSplitter('locked').offsetWidth,
                                  schedulerEl = doc.querySelector('.b-scheduler'),
                                  normalGridEl = doc.querySelector('.b-grid-subgrid-normal'),
                                  normalGridBox = normalGridEl.getBoundingClientRect(),
                                  normalHeaderEl = doc.querySelector('.b-grid-headers-normal'),
                                  _t$getFirstLastVisibl = t.getFirstLastVisibleTicks(doc),
                                  firstTick = _t$getFirstLastVisibl.firstTick,
                                  lastTick = _t$getFirstLastVisibl.lastTick;

                              t.is(schedulerEl.offsetWidth, lockedGridWidth + normalGridWidth + splitterWidth, 'Scheduler width is ok');
                              t.is(normalGridEl.offsetWidth, normalGridWidth, 'Normal grid width is ok');
                              t.is(normalHeaderEl.offsetWidth, normalGridWidth, 'Normal header width is ok');
                              t.is(firstTick.dataset.tickIndex, '0', 'First visible tick index is ok');
                              t.is(lastTick.dataset.tickIndex, '6', 'Last visible tick index is ok'); // find first event which is fit completely into the exported range

                              var event = scheduler.eventStore.find(function (r) {
                                return DateHelper.intersectSpans(rangeStart, rangeEnd, r.startDate, r.endDate);
                              });

                              if (event) {
                                var exportedEventEl = doc.querySelector("[data-event-id=\"".concat(event.id, "\"]")),
                                    exportedEventBox = exportedEventEl.getBoundingClientRect(),
                                    scale = exportedEventBox.width / exportedEventEl.offsetWidth,
                                    eventStartCoord = DateHelper.getDurationInUnit(rangeStart, event.startDate, 'd') * tickWidth * scale,
                                    expectedStartCoord = normalGridBox.left + eventStartCoord;
                                t.is(Math.round(exportedEventBox.left), Math.round(expectedStartCoord - (event.isMilestone ? exportedEventBox.height : 0) / 2), 'Event is positioned properly horizontally');
                              }

                              frame.remove();
                              resolve();
                            }
                          });
                        });

                      case 8:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              })));

            case 6:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    return function (_x2) {
      return _ref3.apply(this, arguments);
    };
  }());
  t.it('Should export specific range of dates before schduler start date', /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(t) {
      var _yield$t$createSchedu3;

      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return t.createSchedulerForExport({
                horizontalPages: 2,
                verticalPages: 2,
                startDate: new Date(2019, 10, 4),
                endDate: new Date(2019, 11, 9)
              });

            case 2:
              _yield$t$createSchedu3 = _context6.sent;
              scheduler = _yield$t$createSchedu3.scheduler;
              paperHeight = _yield$t$createSchedu3.paperHeight;
              t.chain( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
                var rangeStart, rangeEnd, html;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        rangeStart = new Date(2019, 9, 28);
                        rangeEnd = new Date(2019, 10, 4);
                        _context5.next = 4;
                        return t.getExportHtml(scheduler, {
                          columns: scheduler.columns.visibleColumns.map(function (c) {
                            return c.id;
                          }),
                          exporterType: 'singlepage',
                          scheduleRange: 'daterange',
                          rangeStart: rangeStart,
                          rangeEnd: rangeEnd
                        });

                      case 4:
                        html = _context5.sent;
                        t.is(html.length, 1, '1 page is exported');
                        _context5.next = 8;
                        return new Promise(function (resolve) {
                          t.setIframe({
                            height: paperHeight,
                            html: html[0].html,
                            onload: function onload(doc, frame) {
                              fixIE11Height(doc);
                              t.ok(t.assertRowsExportedWithoutGaps(doc, false, true), 'Rows exported without gaps');
                              t.ok(t.assertTicksExportedWithoutGaps(doc), 'Ticks exported without gaps');
                              t.is(doc.querySelectorAll('.b-grid-row').length, scheduler.resourceStore.count * 2, 'All resources exported');

                              var tickCount = 7,
                                  tickWidth = doc.querySelector('.b-lowest .b-sch-header-timeaxis-cell').offsetWidth,
                                  lockedGridWidth = scheduler.subGrids.locked.scrollable.scrollWidth,
                                  normalGridWidth = tickCount * tickWidth,
                                  splitterWidth = scheduler.resolveSplitter('locked').offsetWidth,
                                  schedulerEl = doc.querySelector('.b-scheduler'),
                                  normalGridEl = doc.querySelector('.b-grid-subgrid-normal'),
                                  normalGridBox = normalGridEl.getBoundingClientRect(),
                                  normalHeaderEl = doc.querySelector('.b-grid-headers-normal'),
                                  _t$getFirstLastVisibl2 = t.getFirstLastVisibleTicks(doc, doc.querySelector('.b-sch-header-row-0')),
                                  topTickEl = _t$getFirstLastVisibl2.firstTick,
                                  _t$getFirstLastVisibl3 = t.getFirstLastVisibleTicks(doc),
                                  firstTick = _t$getFirstLastVisibl3.firstTick,
                                  lastTick = _t$getFirstLastVisibl3.lastTick;

                              t.is(schedulerEl.offsetWidth, lockedGridWidth + normalGridWidth + splitterWidth, 'Scheduler width is ok');
                              t.is(normalGridEl.offsetWidth, normalGridWidth, 'Normal grid width is ok');
                              t.is(normalHeaderEl.offsetWidth, normalGridWidth, 'Normal header width is ok');
                              t.is(topTickEl.textContent, 'Mon 28 Oct 2019', 'Top tick is ok');
                              t.is(firstTick.dataset.tickIndex, '0', 'First visible tick index is ok');
                              t.is(lastTick.dataset.tickIndex, '6', 'Last visible tick index is ok'); // find first event which is fit completely into the exported range

                              var event = scheduler.eventStore.find(function (r) {
                                return DateHelper.intersectSpans(rangeStart, rangeEnd, r.startDate, r.endDate);
                              });

                              if (event) {
                                var exportedEventEl = doc.querySelector("[data-event-id=\"".concat(event.id, "\"]")),
                                    exportedEventBox = exportedEventEl.getBoundingClientRect(),
                                    scale = exportedEventBox.width / exportedEventEl.offsetWidth,
                                    eventStartCoord = DateHelper.getDurationInUnit(rangeStart, event.startDate, 'd') * tickWidth * scale,
                                    expectedStartCoord = normalGridBox.left + eventStartCoord;
                                t.isApprox(exportedEventBox.left, expectedStartCoord - (event.isMilestone ? exportedEventBox.height : 0) / 2, 1.5, 'Event is positioned properly horizontally');
                              }

                              frame.remove();
                              resolve();
                            }
                          });
                        });

                      case 8:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              })));

            case 6:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));

    return function (_x3) {
      return _ref5.apply(this, arguments);
    };
  }());
  t.it('Should export range [before start, end]', /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(t) {
      var _yield$t$createSchedu4;

      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return t.createSchedulerForExport({
                horizontalPages: 2,
                verticalPages: 2,
                startDate: new Date(2019, 10, 4),
                endDate: new Date(2019, 11, 9)
              });

            case 2:
              _yield$t$createSchedu4 = _context8.sent;
              scheduler = _yield$t$createSchedu4.scheduler;
              paperHeight = _yield$t$createSchedu4.paperHeight;
              t.chain( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
                var rangeStart, rangeEnd, html;
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        rangeStart = new Date(2019, 9, 28);
                        rangeEnd = new Date(2019, 11, 9);
                        _context7.next = 4;
                        return t.getExportHtml(scheduler, {
                          columns: scheduler.columns.visibleColumns.map(function (c) {
                            return c.id;
                          }),
                          exporterType: 'singlepage',
                          scheduleRange: 'daterange',
                          rangeStart: rangeStart,
                          rangeEnd: rangeEnd
                        });

                      case 4:
                        html = _context7.sent;
                        t.is(html.length, 1, '1 page is exported');
                        _context7.next = 8;
                        return new Promise(function (resolve) {
                          t.setIframe({
                            height: paperHeight,
                            html: html[0].html,
                            onload: function onload(doc, frame) {
                              fixIE11Height(doc);
                              t.ok(t.assertRowsExportedWithoutGaps(doc, false, true), 'Rows exported without gaps');
                              t.ok(t.assertTicksExportedWithoutGaps(doc), 'Ticks exported without gaps');
                              t.is(doc.querySelectorAll('.b-grid-row').length, scheduler.resourceStore.count * 2, 'All resources exported');

                              var tickCount = DateHelper.getDurationInUnit(rangeStart, rangeEnd, 'd'),
                                  tickWidth = scheduler.tickSize,
                                  lockedGridWidth = scheduler.subGrids.locked.scrollable.scrollWidth,
                                  normalGridWidth = tickCount * tickWidth,
                                  splitterWidth = scheduler.resolveSplitter('locked').offsetWidth,
                                  schedulerEl = doc.querySelector('.b-scheduler'),
                                  normalGridEl = doc.querySelector('.b-grid-subgrid-normal'),
                                  normalGridBox = normalGridEl.getBoundingClientRect(),
                                  normalHeaderEl = doc.querySelector('.b-grid-headers-normal'),
                                  _t$getFirstLastVisibl4 = t.getFirstLastVisibleTicks(doc, doc.querySelector('.b-sch-header-row-0')),
                                  firstTopTickEl = _t$getFirstLastVisibl4.firstTick,
                                  lastTopTickEl = _t$getFirstLastVisibl4.lastTick,
                                  _t$getFirstLastVisibl5 = t.getFirstLastVisibleTicks(doc),
                                  firstTickEl = _t$getFirstLastVisibl5.firstTick,
                                  lastTickEl = _t$getFirstLastVisibl5.lastTick;

                              t.is(schedulerEl.offsetWidth, lockedGridWidth + normalGridWidth + splitterWidth, 'Scheduler width is ok');
                              t.is(normalGridEl.offsetWidth, normalGridWidth, 'Normal grid width is ok');
                              t.is(normalHeaderEl.offsetWidth, normalGridWidth, 'Normal header width is ok');
                              t.is(firstTopTickEl.textContent, 'Mon 28 Oct 2019', 'First top tick is ok');
                              t.is(lastTopTickEl.textContent, 'Mon 02 Dec 2019', 'Last top tick is ok');
                              t.is(firstTickEl.dataset.tickIndex, 0, 'First visible tick index is ok');
                              t.is(lastTickEl.dataset.tickIndex, tickCount - 1, 'Last visible tick index is ok'); // find first event which is fit completely into the exported range

                              var event = scheduler.eventStore.find(function (r) {
                                return DateHelper.intersectSpans(rangeStart, rangeEnd, r.startDate, r.endDate);
                              });

                              if (event) {
                                var exportedEventEl = doc.querySelector("[data-event-id=\"".concat(event.id, "\"]")),
                                    exportedEventBox = exportedEventEl.getBoundingClientRect(),
                                    scale = exportedEventBox.width / exportedEventEl.offsetWidth,
                                    eventStartCoord = DateHelper.getDurationInUnit(rangeStart, event.startDate, 'd') * tickWidth * scale,
                                    expectedStartCoord = normalGridBox.left + eventStartCoord;
                                t.is(Math.round(exportedEventBox.left), Math.round(expectedStartCoord - (event.isMilestone ? exportedEventBox.height : 0) / 2), 'Event is positioned properly horizontally');
                              }

                              t.assertExportedEventsList(doc, scheduler.eventStore.query(function (record) {
                                return DateHelper.intersectSpans(record.startDate, record.endDate, rangeStart, rangeEnd);
                              }));
                              frame.remove();
                              resolve();
                            }
                          });
                        });

                      case 8:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7);
              })));

            case 6:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    }));

    return function (_x4) {
      return _ref7.apply(this, arguments);
    };
  }());
  t.it('Should export dependencies', /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(t) {
      var verticalPages, horizontalPages, totalPages, _yield$t$createSchedu5;

      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              verticalPages = 2, horizontalPages = 2, totalPages = 1;
              _context10.next = 3;
              return t.createSchedulerForExport({
                verticalPages: verticalPages,
                horizontalPages: horizontalPages,
                featuresConfig: {
                  dependencies: true
                }
              });

            case 3:
              _yield$t$createSchedu5 = _context10.sent;
              scheduler = _yield$t$createSchedu5.scheduler;
              paperHeight = _yield$t$createSchedu5.paperHeight;
              t.chain({
                waitForSelector: '.b-sch-dependency'
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
                var toAdd, html;
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        toAdd = []; // increase row heights to get scheduler to start estimating rows and offset rows at the bottom

                        scheduler.resources.forEach(function (resource, index) {
                          if (index % 3 === 0) {
                            toAdd.push(resource.events[2].copy());
                          }
                        });
                        scheduler.eventStore.add(toAdd);
                        _context9.next = 5;
                        return scheduler.await('dependenciesdrawn');

                      case 5:
                        // filter out deps that point to invisible events
                        scheduler.dependencyStore.filter(function (r) {
                          return !(r.toOutside || r.fromOutside);
                        }); // wait till the engine handles the added records

                        _context9.next = 8;
                        return Promise.all([t.waitForProjectReady(scheduler), scheduler.await('dependenciesdrawn')]);

                      case 8:
                        _context9.next = 10;
                        return t.getExportHtml(scheduler, {
                          columns: scheduler.columns.visibleColumns.map(function (c) {
                            return c.id;
                          }),
                          exporterType: 'singlepage',
                          scheduleRange: 'completeview'
                        });

                      case 10:
                        html = _context9.sent;
                        t.is(html.length, totalPages, "".concat(totalPages, " pages are exported"));
                        _context9.next = 14;
                        return new Promise(function (resolve) {
                          t.setIframe({
                            height: paperHeight,
                            html: html[0].html,
                            onload: function onload(doc, frame) {
                              var eventsInView = scheduler.events.filter(function (r) {
                                return DateHelper.intersectSpans(scheduler.startDate, scheduler.endDate, r.startDate, r.endDate);
                              });
                              t.ok(t.assertExportedEventDependenciesList(doc, scheduler.dependencies), 'Dependencies exported ok');
                              t.ok(t.assertExportedEventsList(doc, eventsInView), 'Events are exported ok');
                              frame.remove();
                              resolve();
                            }
                          });
                        });

                      case 14:
                      case "end":
                        return _context9.stop();
                    }
                  }
                }, _callee9);
              })));

            case 7:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    }));

    return function (_x5) {
      return _ref9.apply(this, arguments);
    };
  }());
});