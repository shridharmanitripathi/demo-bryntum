function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var schedulerBase;
  t.beforeEach(function (t) {
    schedulerBase && !schedulerBase.isDestroyed && schedulerBase.destroy();
  });
  t.it('Sanity', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              schedulerBase = new SchedulerBase({
                appendTo: document.body,
                width: 800,
                height: 600,
                startDate: new Date(2019, 8, 18),
                endDate: new Date(2019, 8, 25),
                columns: [{
                  field: 'name',
                  text: 'Name'
                }],
                resources: [{
                  id: 1,
                  name: 'The one and only'
                }],
                events: [{
                  id: 1,
                  resourceId: 1,
                  name: 'Task',
                  startDate: new Date(2019, 8, 18),
                  duration: 2,
                  durationUnit: 'd'
                }]
              });
              _context.next = 3;
              return t.waitForProjectReady();

            case 3:
              t.selectorExists('.b-grid-header:textEquals(Name)', 'Header rendered');
              t.selectorExists('.b-sch-header-timeaxis-cell:textEquals(S)', 'Time axis header rendered');
              t.selectorExists('.b-grid-cell:textEquals(The one and only)', 'Cell rendered');
              t.selectorExists('.b-sch-event:textEquals(Task)', 'Event rendered');
              t.isDeeply(Object.keys(schedulerBase.features), ['regionResize'], 'Only regionResize included by default');

            case 8:
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
});