function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest({
  defaultTimeout: 90000
}, function (t) {
  var scheduler;
  t.beforeEach(function () {
    scheduler && scheduler.destroy();
  });

  function getScheduler(_x) {
    return _getScheduler.apply(this, arguments);
  }

  function _getScheduler() {
    _getScheduler = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(config) {
      var scheduler;
      return regeneratorRuntime.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              scheduler = t.getScheduler(Object.assign({
                features: {
                  eventDrag: true
                }
              }, config));
              _context14.next = 3;
              return t.waitForProjectReady();

            case 3:
              return _context14.abrupt("return", scheduler);

            case 4:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14);
    }));
    return _getScheduler.apply(this, arguments);
  }

  t.it('dragging outside the rendered block', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
      var resources, events, event, layout, dragEl, schedulerRectangle, startPoint, newLocation, droppedOnResource, dragElMutationObserver;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              t.waitForScrolling = false;
              resources = ArrayHelper.populate(200, function (i) {
                return {
                  id: "r".concat(i + 1),
                  name: "Resource ".concat(i + 1)
                };
              }), events = ArrayHelper.populate(116, function (i) {
                return {
                  id: i + 2,
                  resourceId: "r".concat(i + 2),
                  name: "Event ".concat(i + 2),
                  startDate: new Date(2011, 0, 4),
                  endDate: new Date(2011, 0, 6)
                };
              });
              events.unshift({
                id: 1,
                resourceId: 'r1',
                name: 'Drag Event',
                startDate: new Date(2011, 0, 4),
                endDate: new Date(2011, 0, 6)
              });
              scheduler = t.getScheduler({
                features: {
                  eventDrag: {
                    showTooltip: false
                  },
                  eventTooltip: false,
                  scheduleTooltip: false
                },
                resources: resources,
                events: events
              });
              _context.next = 6;
              return t.waitForProjectReady();

            case 6:
              event = scheduler.eventStore.first, layout = scheduler.currentOrientation, dragEl = scheduler.getElementFromEventRecord(event).parentNode, schedulerRectangle = Rectangle.from(scheduler.element), startPoint = Rectangle.from(dragEl).center;
              t.chain({
                mouseDown: dragEl
              }, function (next) {
                // Ensure that during the drag, the dragEl does not get mutated
                dragElMutationObserver = new MutationObserver(function () {
                  dragElMutationObserver.disconnect();
                  t.fail('Dragged element got mutated during drag');
                });
                dragElMutationObserver.observe(dragEl, {
                  characterData: true,
                  childList: true
                });
                next();
              }, // This will kick off scrolling
              {
                moveMouseTo: document.body,
                offset: [startPoint.x, schedulerRectangle.bottom - 20]
              }, {
                waitFor: function waitFor() {
                  return scheduler.rowManager.topIndex >= 100;
                },
                timeout: 40000,
                desc: 'Scrolling'
              }, {
                moveMouseTo: document.body,
                offset: [startPoint.x, schedulerRectangle.bottom - 100]
              }, function (next) {
                droppedOnResource = scheduler.resolveResourceRecord(t.elementFromPoint.apply(t, t.currentPosition));
                var row = scheduler.rowManager.getRowFor(droppedOnResource),
                    rowRectangle = Rectangle.from(row._elements.normal),
                    newLayout = layout.getTimeSpanRenderData(event, droppedOnResource);
                newLocation = new Rectangle(rowRectangle.x + newLayout.left, rowRectangle.y + newLayout.top, newLayout.width, newLayout.height);
                t.ok(dragEl.retainElement, 'Dragged element is retained'); // Disconnect observer. We expect content to change now

                dragElMutationObserver.disconnect(); // Edge and IE11 require some help to drop event to correct position. Moving mouse to the vertical center
                // of the target resource

                t.moveMouseTo([t.currentPosition[0], rowRectangle.y + rowRectangle.height / 2], next);
              }, {
                mouseUp: null
              }, // Wait for the drag element to settle into the calculated new position
              {
                waitFor: function waitFor() {
                  return t.sameRect(Rectangle.from(dragEl), newLocation);
                }
              }, function () {
                // The drag/dropped element is reused as the event's render el
                t.is(scheduler.getElementFromEventRecord(event).parentNode, dragEl);
                t.notOk(dragEl.retainElement, 'Dragged element is no longer retained');
              });

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x2) {
      return _ref.apply(this, arguments);
    };
  }());
  t.it('dragging outside the rendered block with ESC to abort', /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
      var resources, events, event, dragEl, schedulerRectangle, startPoint, eventEls, eventElRects, endingEventEls, endingEventElRects, dragElMutationObserver;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              t.waitForScrolling = false;
              resources = ArrayHelper.populate(200, function (i) {
                return {
                  id: "r".concat(i + 1),
                  name: "Resource ".concat(i + 1)
                };
              }), events = [{
                id: 1,
                resourceId: 'r1',
                name: 'Drag Event',
                startDate: new Date(2011, 0, 4),
                endDate: new Date(2011, 0, 6)
              }].concat(_toConsumableArray(ArrayHelper.populate(116, function (i) {
                return {
                  id: i + 2,
                  resourceId: "r".concat(i + 2),
                  name: "Event ".concat(i + 2),
                  startDate: new Date(2011, 0, 4),
                  endDate: new Date(2011, 0, 6)
                };
              })));
              _context2.next = 4;
              return t.getSchedulerAsync({
                features: {
                  eventDrag: {
                    showTooltip: false
                  },
                  eventTooltip: false,
                  scheduleTooltip: false
                },
                resources: resources,
                events: events
              });

            case 4:
              scheduler = _context2.sent;
              event = scheduler.eventStore.first, dragEl = scheduler.getElementFromEventRecord(event).parentNode, schedulerRectangle = Rectangle.from(scheduler.element), startPoint = Rectangle.from(dragEl).center;
              t.chain({
                mouseDown: dragEl
              }, function (next) {
                // Ensure that during the drag, the dragEl does not get mutated
                dragElMutationObserver = new MutationObserver(function () {
                  dragElMutationObserver.disconnect();
                  t.fail('Dragged element got mutated during drag');
                });
                dragElMutationObserver.observe(dragEl, {
                  characterData: true,
                  childList: true
                });
                next();
              }, // This will kick off scrolling
              {
                moveMouseTo: document.body,
                offset: [startPoint.x, schedulerRectangle.bottom - 20]
              }, {
                waitFor: function waitFor() {
                  return scheduler.rowManager.topIndex >= 100;
                },
                timeout: 60000
              }, {
                moveCursorBy: [0, -80]
              }, function (next) {
                // The scheduler's rendered block should not change
                eventEls = scheduler.eventStore.reduce(function (result, event) {
                  var el = scheduler.getElementFromEventRecord(event);

                  if (el) {
                    result.push(el);
                  }

                  return result;
                }, []);
                eventElRects = eventEls.map(function (e) {
                  return Rectangle.from(e);
                });
                t.ok(dragEl.retainElement, 'Dragged element retained'); // Disconnect observer. We expect content to change now

                dragElMutationObserver.disconnect();
                next();
              }, {
                type: '[ESC]'
              }, {
                waitFor: function waitFor() {
                  endingEventEls = scheduler.eventStore.reduce(function (result, event) {
                    var el = scheduler.getElementFromEventRecord(event);

                    if (el) {
                      result.push(el);
                    }

                    return result;
                  }, []);
                  return endingEventEls.length === eventEls.length;
                }
              }, function () {
                endingEventElRects = endingEventEls.map(function (e) {
                  return Rectangle.from(e);
                }); // Same number of elements, and all in the same place.
                // TODO: Ask nige about this
                //                t.is(scheduler.timeAxisSubGridElement.querySelectorAll(scheduler.unreleasedEventSelector).length, eventEls.length);

                t.is(endingEventEls.length, eventEls.length); // Not the first one; that's the dragEl which will be in a different place by now

                for (var i = 1; i < eventEls.length; i++) {
                  t.ok(endingEventElRects[i].equals(eventElRects[i]), "Event ".concat(i, " correct"));
                }
              });

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x3) {
      return _ref2.apply(this, arguments);
    };
  }()); // https://app.assembla.com/spaces/bryntum/tickets/7120/details

  t.it('Should work with resources and events that has - in their id', /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return getScheduler({
                resources: [{
                  id: 'r-1',
                  name: 'Resource-1'
                }],
                events: [{
                  id: 'e-1',
                  resourceId: 'r-1',
                  startDate: new Date(2011, 0, 6),
                  endDate: new Date(2011, 0, 7)
                }]
              });

            case 2:
              scheduler = _context3.sent;
              t.chain({
                drag: '[data-event-id="e-1"]',
                by: [-100, 0]
              }, function () {
                t.is(scheduler.eventStore.first.startDate, new Date(2011, 0, 5), 'Drag worked');
              });

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x4) {
      return _ref3.apply(this, arguments);
    };
  }());
  t.it('Event should not disappear when dragging right', /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(t) {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return getScheduler({
                resources: [{
                  id: 1,
                  name: '1'
                }],
                events: [{
                  id: 1,
                  resourceId: 1,
                  startDate: new Date(2018, 11, 6),
                  endDate: new Date(2018, 11, 7)
                }],
                startDate: new Date(2018, 11, 6),
                endDate: new Date(2018, 11, 30)
              });

            case 2:
              scheduler = _context4.sent;
              t.chain({
                drag: scheduler.eventSelector,
                to: '.b-scheduler',
                toOffset: ['100%-25', 70],
                dragOnly: true
              }, {
                waitFor: function waitFor() {
                  return scheduler.scrollLeft > 500;
                }
              }, function (next) {
                t.elementIsVisible(scheduler.eventSelector, 'Still visible');
                next();
              }, {
                mouseUp: null
              });

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    return function (_x5) {
      return _ref4.apply(this, arguments);
    };
  }()); // https://app.assembla.com/spaces/bryntum/tickets/7307

  t.it('Event should not disappear when dragging right with assignment', /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(t) {
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return getScheduler({
                resources: [{
                  id: 1,
                  name: '1'
                }],
                events: [{
                  id: 1,
                  startDate: new Date(2018, 11, 6),
                  endDate: new Date(2018, 11, 7)
                }],
                assignments: [{
                  eventId: 1,
                  resourceId: 1
                }],
                startDate: new Date(2018, 11, 6),
                endDate: new Date(2018, 11, 30)
              });

            case 2:
              scheduler = _context5.sent;
              t.chain({
                drag: scheduler.eventSelector,
                by: [850, 0],
                dragOnly: true
              }, {
                waitFor: function waitFor() {
                  return scheduler.scrollLeft > 500;
                }
              }, function (next) {
                t.elementIsVisible(scheduler.eventSelector, 'Still visible');
                next();
              }, {
                mouseUp: null
              });

            case 4:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    return function (_x6) {
      return _ref5.apply(this, arguments);
    };
  }());
  t.it('should not crash when clicking escape after mousedown which aborts drag', /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(t) {
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return getScheduler({
                resources: [{
                  id: 1,
                  name: '1'
                }],
                events: [{
                  id: 1,
                  startDate: new Date(2018, 11, 6),
                  endDate: new Date(2018, 11, 7)
                }],
                assignments: [{
                  eventId: 1,
                  resourceId: 1
                }],
                startDate: new Date(2018, 11, 6),
                endDate: new Date(2018, 11, 30)
              });

            case 2:
              scheduler = _context6.sent;
              t.chain({
                mousedown: scheduler.eventSelector
              }, {
                type: '[ESCAPE]'
              }, {
                waitFor: 1000,
                desc: 'Make sure the async restore of drag proxy does not crash if drag did not start'
              });

            case 4:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));

    return function (_x7) {
      return _ref6.apply(this, arguments);
    };
  }());
  t.it('Should fire eventDragAbort if user aborts with Escape key', function (t) {
    scheduler = t.getScheduler();
    t.firesOnce(scheduler, 'eventDragAbort', 1);
    scheduler.on('eventDragAbort', function (_ref7) {
      var eventRecords = _ref7.eventRecords,
          context = _ref7.context;
      t.is(eventRecords.length, 1);
      t.isInstanceOf(eventRecords[0], scheduler.eventStore.modelClass);
      t.ok(context);
    });
    t.chain({
      drag: '.b-sch-event',
      by: [20, 0],
      dragOnly: true
    }, {
      type: '[ESCAPE]'
    });
  });
  t.it('Should be able to configure DragHelper using dragHelperConfig', /*#__PURE__*/function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(t) {
      var eventX;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return getScheduler({
                features: {
                  eventDrag: {
                    dragHelperConfig: {
                      lockX: true
                    }
                  }
                },
                events: [{
                  id: 1,
                  resourceId: 'r1',
                  startDate: new Date(2011, 0, 6),
                  endDate: new Date(2011, 0, 7)
                }]
              });

            case 2:
              scheduler = _context7.sent;
              eventX = document.querySelector('.b-sch-event').getBoundingClientRect().left;
              t.chain({
                drag: '.b-sch-event',
                by: [200, 200],
                dragOnly: true
              }, function () {
                var proxyX = document.querySelector('.b-sch-event').getBoundingClientRect().left;
                t.is(proxyX, eventX, 'Constrain worked');
              });

            case 5:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }));

    return function (_x8) {
      return _ref8.apply(this, arguments);
    };
  }());
  t.it('Drag and drop with constrainDragToTimeSlot', /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(t) {
      var _scheduler, tickSize, draggedEvent, startDate, endDate;

      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return getScheduler({
                startDate: new Date(2011, 0, 3),
                events: [{
                  id: 1,
                  resourceId: 'r1',
                  startDate: new Date(2011, 0, 6),
                  endDate: new Date(2011, 0, 7)
                }],
                features: {
                  eventDrag: {
                    constrainDragToTimeSlot: true
                  }
                }
              });

            case 2:
              scheduler = _context8.sent;
              _scheduler = scheduler, tickSize = _scheduler.tickSize, draggedEvent = scheduler.eventStore.first, startDate = draggedEvent.startDate, endDate = draggedEvent.endDate;
              t.willFireNTimes(scheduler.eventStore, 'change', 1);
              t.chain(function (next) {
                t._region = document.querySelector(scheduler.eventSelector).getBoundingClientRect();
                next();
              }, {
                drag: scheduler.eventSelector,
                by: [-tickSize, 0],
                dragOnly: true
              }, function (next) {
                var region = document.querySelector('.b-dragging').getBoundingClientRect();
                t.isApprox(region.left, t._region.left, 1, 'Task constrained left properly');
                next();
              }, {
                action: 'mouseUp'
              }, function (next) {
                // Must not have moved
                t.is(draggedEvent.startDate, startDate);
                t.is(draggedEvent.endDate, endDate);
                next();
              }, {
                drag: scheduler.eventSelector,
                by: [tickSize, 0],
                dragOnly: true
              }, function (next) {
                var region = document.querySelector('.b-dragging').getBoundingClientRect();
                t.isApprox(region.right, t._region.right, 1, 'Task constrained right properly');
                next();
              }, {
                action: 'mouseUp'
              }, function (next) {
                // Must not have moved
                t.is(draggedEvent.startDate, startDate);
                t.is(draggedEvent.endDate, endDate);
                next();
              }, // This drag should move the event down
              {
                drag: scheduler.eventSelector,
                by: [0, scheduler.rowHeight]
              }, function () {
                t.is(draggedEvent.startDate, startDate);
                t.is(draggedEvent.endDate, endDate);
                t.is(draggedEvent.resourceId, 'r2');
              });

            case 6:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    }));

    return function (_x9) {
      return _ref9.apply(this, arguments);
    };
  }()); // https://github.com/bryntum/support/issues/630

  t.xit('Drag and drop with fillTicks', /*#__PURE__*/function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(t) {
      var origLeft;
      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return getScheduler({
                startDate: new Date(2011, 0, 3),
                events: [{
                  id: 1,
                  resourceId: 'r1',
                  startDate: new Date(2011, 0, 6, 10),
                  endDate: new Date(2011, 0, 6, 14)
                }],
                minHeight: '20em',
                viewPreset: 'dayAndWeek',
                rowHeight: 60,
                barMargin: 5,
                fillTicks: true,
                eventStyle: 'colored',
                eventRenderer: function eventRenderer(_ref11) {
                  var eventRecord = _ref11.eventRecord;
                  return "           \n                    <div>\n                    <span>".concat(DateHelper.format(eventRecord.startDate, 'LT'), "</span>\n                    ").concat(eventRecord.name, "\n                    </div>\n                ");
                }
              });

            case 2:
              scheduler = _context11.sent;
              t.chain({
                waitForSelector: '.b-sch-event'
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        return _context9.abrupt("return", origLeft = t.rect('.b-sch-event').left);

                      case 1:
                      case "end":
                        return _context9.stop();
                    }
                  }
                }, _callee9);
              })), {
                drag: '.b-sch-event',
                by: [5, 0]
              }, {
                waitForSelectorNotFound: '.b-dragging-event'
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                  while (1) {
                    switch (_context10.prev = _context10.next) {
                      case 0:
                        return _context10.abrupt("return", t.is(t.rect('.b-sch-event').left, origLeft, 'Event rendered in correct position'));

                      case 1:
                      case "end":
                        return _context10.stop();
                    }
                  }
                }, _callee10);
              })));

            case 4:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    }));

    return function (_x10) {
      return _ref10.apply(this, arguments);
    };
  }());
  t.it('Should dragdrop outside of the view on filtered time axis', /*#__PURE__*/function () {
    var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(t) {
      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return getScheduler({
                timeAxis: {
                  filters: function filters(tick) {
                    return tick.startDate.getDay() !== 1;
                  }
                },
                subGridConfigs: {
                  locked: {
                    width: 200
                  }
                }
              });

            case 2:
              scheduler = _context12.sent;
              t.chain({
                drag: scheduler.unreleasedEventSelector,
                by: [-250, 0]
              }, function () {
                t.is(scheduler.eventStore.first.startDate, scheduler.startDate, 'Event drag is cancelled');
              });

            case 4:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12);
    }));

    return function (_x11) {
      return _ref14.apply(this, arguments);
    };
  }()); // https://github.com/bryntum/support/issues/1286

  t.it('Should be possible to drag narrow event', /*#__PURE__*/function () {
    var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(t) {
      return regeneratorRuntime.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _context13.next = 2;
              return getScheduler({
                startDate: new Date(2017, 0, 1, 6),
                endDate: new Date(2017, 0, 1, 20),
                viewPreset: 'hourAndDay',
                events: [{
                  id: 1,
                  resourceId: 'r1',
                  resizable: false,
                  startDate: new Date(2017, 0, 1, 10),
                  duration: 0.006
                }]
              });

            case 2:
              scheduler = _context13.sent;
              t.firesOnce(scheduler, 'aftereventdrop');
              t.chain({
                drag: scheduler.unreleasedEventSelector,
                by: [scheduler.tickSize, 0],
                offset: [1, '50%']
              }, function () {
                t.is(scheduler.eventStore.first.startDate, new Date(2017, 0, 1, 11), 'Event moved');
              });

            case 5:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13);
    }));

    return function (_x12) {
      return _ref15.apply(this, arguments);
    };
  }());
});