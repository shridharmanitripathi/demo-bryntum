function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var scheduler;
  t.beforeEach(function (t) {
    return scheduler && scheduler.destroy();
  });
  t.it('Removing a resource should translate other events to correct positions', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
      var targetY, targetX;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return t.getSchedulerAsync();

            case 2:
              scheduler = _context.sent;
              targetY = DomHelper.getTranslateY(document.querySelector('.event2')), targetX = DomHelper.getTranslateX(document.querySelector('.event3')); // should still have this x

              scheduler.resourceStore.getAt(1).remove();
              t.chain({
                waitFor: function waitFor() {
                  return DomHelper.getTranslateY(document.querySelector('.event3')) === targetY;
                },
                desc: 'Event moved to correct y'
              }, function () {
                t.is(DomHelper.getTranslateX(document.querySelector('.event3')), targetX, 'Also at correct x');
              });

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }()); // https://app.assembla.com/spaces/bryntum/tickets/7421

  t.it('Adding an event should not use another events element', /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
      var firstEventElement;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return t.getSchedulerAsync({
                events: [{
                  id: 'e1',
                  resourceId: 'r1',
                  startDate: new Date(2011, 0, 6),
                  duration: 1
                }]
              });

            case 2:
              scheduler = _context2.sent;
              firstEventElement = document.querySelector(scheduler.eventSelector);
              scheduler.eventStore.add({
                id: 'e2',
                resourceId: 'r1',
                startDate: new Date(2011, 0, 4),
                duration: 1
              });
              _context2.next = 7;
              return t.waitForProjectReady();

            case 7:
              t.is(firstEventElement.dataset.eventId, 'e1', 'Element still used for same event');

            case 8:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }()); // https://app.assembla.com/spaces/bryntum/tickets/7263

  t.it('Assigning an unassigned event should not use another events element', /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
      var firstEventElement, _scheduler$eventStore, _scheduler$eventStore2, e2;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return t.getSchedulerAsync({
                events: [{
                  id: 'e1',
                  resourceId: 'r1',
                  startDate: new Date(2011, 0, 6),
                  duration: 1
                }]
              });

            case 2:
              scheduler = _context3.sent;
              firstEventElement = document.querySelector(scheduler.eventSelector);
              _scheduler$eventStore = scheduler.eventStore.add({
                id: 'e2',
                startDate: new Date(2011, 0, 4),
                duration: 1
              }), _scheduler$eventStore2 = _slicedToArray(_scheduler$eventStore, 1), e2 = _scheduler$eventStore2[0];
              e2.resourceId = 'r1';
              _context3.next = 8;
              return t.waitForProjectReady();

            case 8:
              t.is(firstEventElement.dataset.eventId, 'e1', 'Element still used for same event');

            case 9:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }()); // https://app.assembla.com/spaces/bryntum/tickets/8365

  t.it('Style should be cleared on element reusage', /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(t) {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return t.getSchedulerAsync({
                startDate: new Date(2011, 0, 1),
                endDate: new Date(2011, 1, 31),
                events: [{
                  id: 'e1',
                  resourceId: 'r1',
                  startDate: new Date(2011, 0, 6),
                  duration: 1,
                  style: 'background-color : red'
                }, {
                  id: 'e2',
                  resourceId: 'r1',
                  startDate: new Date(2011, 1, 20),
                  duration: 1
                }]
              });

            case 2:
              scheduler = _context4.sent;
              t.chain({
                waitForSelector: scheduler.unreleasedEventSelector
              }, function () {
                var async = t.beginAsync(); // Cannot jump there directly, does not reproduce the bug

                function scroll() {
                  scheduler.subGrids.normal.scrollable.x += 400;

                  if (scheduler.subGrids.normal.scrollable.x < 4800) {
                    requestAnimationFrame(scroll);
                  } else {
                    t.notOk(document.querySelector('.b-sch-event').style.backgroundColor, 'Style not set');
                    t.endAsync(async);
                  }
                }

                requestAnimationFrame(scroll);
              });

            case 4:
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
});