function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  Object.assign(window, {
    Scheduler: Scheduler,
    EventStore: EventStore,
    ResourceStore: ResourceStore,
    DependencyStore: DependencyStore,
    PresetManager: PresetManager
  });
  var scheduler;
  t.beforeEach(function () {
    return scheduler && scheduler.destroy();
  });
  t.it('Should support setting eventColor to known value with eventStyle colored', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
      var barEl;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              scheduler = t.getScheduler({
                startDate: new Date(2011, 0, 2),
                events: [{
                  id: 'e4-1',
                  startDate: '2011-01-03',
                  endDate: '2011-01-04',
                  eventColor: 'red',
                  eventStyle: 'colored',
                  resourceId: 'r1'
                }]
              });
              _context.next = 3;
              return t.waitForSelector('.b-sch-event');

            case 3:
              barEl = t.query('.b-sch-event')[0];
              t.is(window.getComputedStyle(barEl).backgroundColor, 'rgb(255, 231, 231)', 'Background');
              t.is(window.getComputedStyle(barEl).borderLeftColor, 'rgb(255, 96, 96)', 'Border left');

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
  }());
  !(BrowserHelper.isIE11 || BrowserHelper.isEdge) && t.it('Should support setting eventColor to hex value with eventStyle colored', /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
      var barEl;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              scheduler = t.getScheduler({
                startDate: new Date(2011, 0, 2),
                events: [{
                  id: 'e4-1',
                  startDate: '2011-01-03',
                  endDate: '2011-01-04',
                  eventColor: '#333',
                  eventStyle: 'colored',
                  resourceId: 'r1'
                }]
              });
              _context2.next = 3;
              return t.waitForSelector('.b-sch-event');

            case 3:
              barEl = t.query('.b-sch-event')[0];
              t.is(window.getComputedStyle(barEl).backgroundColor, 'rgb(51, 51, 51)', 'Background');
              t.is(window.getComputedStyle(barEl).borderLeftColor, 'rgb(51, 51, 51)', 'Border left');

            case 6:
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
});