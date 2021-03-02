function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  t.describe('All drag events should be fired and handled correctly', function (t) {
    var scheduler,
        beforeFinalize = false;

    function setup(_x) {
      return _setup.apply(this, arguments);
    }

    function _setup() {
      _setup = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(config) {
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                scheduler && scheduler.destroy();
                scheduler = t.getScheduler(Object.assign({
                  features: {
                    eventDragCreate: true,
                    eventDrag: true,
                    eventResize: true,
                    eventEdit: false
                  }
                }, config));
                _context9.next = 4;
                return t.waitForProjectReady(scheduler);

              case 4:
                beforeFinalize = false;
                return _context9.abrupt("return", scheduler);

              case 6:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));
      return _setup.apply(this, arguments);
    }

    t.it('Assert dragcreate events (async)', /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return setup({
                  listeners: {
                    beforedragcreatefinalize: function beforedragcreatefinalize(_ref2) {
                      var context = _ref2.context;
                      beforeFinalize = context.async = true;
                      context.finalize(true);
                    }
                  }
                });

              case 2:
                scheduler = _context.sent;
                t.firesOnce(scheduler, 'dragcreatestart', 'dragcreatestart is fired');
                t.firesOnce(scheduler, 'beforedragcreate', 'beforedragcreate is fired');
                t.firesOnce(scheduler, 'beforeeventadd', 'beforeeventadd is fired');
                t.firesOnce(scheduler, 'afterdragcreate', 'afterdragcreate is fired');
                t.firesOnce(scheduler, 'dragcreateend', 'dragcreateend is fired');
                t.chain({
                  drag: '.b-sch-timeaxis-cell',
                  fromOffset: [2, 2],
                  by: [100, 0]
                }, function () {
                  t.is(beforeFinalize, true, 'beforedragcreatefinalize fired');
                });

              case 9:
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
    t.it('Assert dragcreate events (sync)', /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return setup({
                  listeners: {
                    beforedragcreatefinalize: function beforedragcreatefinalize(_ref4) {
                      var context = _ref4.context;
                      beforeFinalize = true;
                    }
                  }
                });

              case 2:
                scheduler = _context2.sent;
                t.firesOnce(scheduler, 'dragcreatestart', 'dragcreatestart is fired');
                t.firesOnce(scheduler, 'beforedragcreate', 'beforedragcreate is fired');
                t.firesOnce(scheduler, 'beforeeventadd', 'beforeeventadd is fired');
                t.firesOnce(scheduler, 'afterdragcreate', 'afterdragcreate is fired');
                t.firesOnce(scheduler, 'dragcreateend', 'dragcreateend is fired');
                t.chain({
                  drag: '.b-sch-timeaxis-cell',
                  fromOffset: [2, 2],
                  by: [100, 0]
                }, function () {
                  t.is(beforeFinalize, true, 'beforedragcreatefinalize fired');
                });

              case 9:
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
    t.it('Assert drag events (async)', /*#__PURE__*/function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return setup({
                  listeners: {
                    beforeeventdropfinalize: function beforeeventdropfinalize(_ref6) {
                      var context = _ref6.context;
                      beforeFinalize = context.async = true;
                      context.finalize(true);
                    }
                  }
                });

              case 2:
                scheduler = _context3.sent;
                t.firesOnce(scheduler, 'eventdragstart', 'eventdragstart is fired');
                t.firesOnce(scheduler, 'eventdrop', 'eventdrop is fired');
                t.firesOnce(scheduler, 'beforeeventdrag', 'beforeeventdrag is fired');
                t.firesOnce(scheduler, 'aftereventdrop', 'aftereventdrop is fired');
                t.chain({
                  drag: '.b-sch-event',
                  by: [100, 0]
                }, function () {
                  t.is(beforeFinalize, true, 'beforeeventdropfinalize fired');
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
    t.it('Assert drag events (sync)', /*#__PURE__*/function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(t) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return setup({
                  listeners: {
                    beforeeventdropfinalize: function beforeeventdropfinalize(_ref8) {
                      var context = _ref8.context;
                      beforeFinalize = true;
                    }
                  }
                });

              case 2:
                scheduler = _context4.sent;
                t.firesOnce(scheduler, 'eventdragstart', 'eventdragstart is fired');
                t.firesOnce(scheduler, 'eventdrop', 'eventdrop is fired');
                t.firesOnce(scheduler, 'beforeeventdrag', 'beforeeventdrag is fired');
                t.firesOnce(scheduler, 'aftereventdrop', 'aftereventdrop is fired');
                t.chain({
                  drag: '.b-sch-event',
                  by: [100, 0]
                }, function () {
                  t.is(beforeFinalize, true, 'beforeeventdropfinalize fired');
                });

              case 8:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      return function (_x5) {
        return _ref7.apply(this, arguments);
      };
    }());
    t.it('Proxy element should be removed when drop is cancelled asynchronously', /*#__PURE__*/function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(t) {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return setup({
                  listeners: {
                    beforeeventdropfinalize: function beforeeventdropfinalize(_ref10) {
                      var context = _ref10.context;
                      setTimeout(function () {
                        context.finalize(false);
                      }, 100);
                      context.async = true;
                    }
                  }
                });

              case 2:
                scheduler = _context5.sent;
                // Get rid of changes from initial calculations
                scheduler.eventStore.commit();
                t.chain({
                  waitForEvent: [scheduler, 'aftereventdrop'],
                  trigger: {
                    drag: '.b-sch-event',
                    by: [20, 0]
                  }
                }, function () {
                  t.notOk(scheduler.eventStore.changes, 'No modified records'); // https://www.assembla.com/spaces/bryntum/tickets/1524#/activity/ticket

                  var dragProxyElement = document.querySelector('.b-sch-dragproxy');
                  t.notOk(dragProxyElement, 'Drag proxy gone');
                });

              case 5:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      return function (_x6) {
        return _ref9.apply(this, arguments);
      };
    }());
    t.it('Assert resize events (async)', /*#__PURE__*/function () {
      var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(t) {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return setup({
                  listeners: {
                    beforeeventresizefinalize: function beforeeventresizefinalize(_ref12) {
                      var context = _ref12.context;
                      beforeFinalize = context.async = true;
                      context.finalize(true);
                    }
                  }
                });

              case 2:
                scheduler = _context6.sent;
                t.firesOnce(scheduler, 'beforeeventresize', 'beforeeventresize is fired');
                t.firesOnce(scheduler, 'eventresizestart', 'eventresizestart is fired');
                t.firesOnce(scheduler, 'eventresizeend', 'eventresizeend is fired');
                t.firesAtLeastNTimes(scheduler, 'eventpartialresize', 1, 'eventpartialresize is fired');
                t.chain({
                  moveCursorTo: '.b-sch-event'
                }, {
                  drag: '.b-sch-event',
                  by: [100, 0],
                  offset: ['100%-3', 5]
                }, function () {
                  t.is(beforeFinalize, true, 'beforeeventresizefinalize fired');
                });

              case 8:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      return function (_x7) {
        return _ref11.apply(this, arguments);
      };
    }());
    t.it('Assert resize events (sync)', /*#__PURE__*/function () {
      var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(t) {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return setup({
                  listeners: {
                    beforeeventresizefinalize: function beforeeventresizefinalize() {
                      beforeFinalize = true;
                    }
                  }
                });

              case 2:
                scheduler = _context7.sent;
                t.firesOnce(scheduler, 'beforeeventresize', 'beforeeventresize is fired');
                t.firesOnce(scheduler, 'eventresizestart', 'eventresizestart is fired');
                t.firesOnce(scheduler, 'eventresizeend', 'eventresizeend is fired');
                t.firesAtLeastNTimes(scheduler, 'eventpartialresize', 1, 'eventpartialresize is fired');
                t.chain({
                  moveCursorTo: '.b-sch-event'
                }, {
                  drag: '.b-sch-event',
                  by: [100, 0],
                  offset: ['100%-3', 5]
                }, function () {
                  t.is(beforeFinalize, true, 'beforeeventresizefinalize fired');
                });

              case 8:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      return function (_x8) {
        return _ref13.apply(this, arguments);
      };
    }()); // https://github.com/bryntum/support/issues/865

    t.it('afterEventDrop should be fired when event is dropped outside the timeline', /*#__PURE__*/function () {
      var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(t) {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return setup({
                  features: {
                    eventDrag: {
                      constrainDragToTimeline: false
                    }
                  }
                });

              case 2:
                scheduler = _context8.sent;
                t.firesOnce(scheduler, 'afterEventDrop', 'afterEventDrop is fired');
                t.isFiredWithSignature(scheduler, 'afterEventDrop', function (_ref15) {
                  var valid = _ref15.valid;
                  return valid === false;
                }, 'Drop is invalid');
                t.chain({
                  drag: '.b-sch-event',
                  to: '.b-sch-header-row .b-sch-header-timeaxis-cell'
                });

              case 6:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));

      return function (_x9) {
        return _ref14.apply(this, arguments);
      };
    }());
  });
});