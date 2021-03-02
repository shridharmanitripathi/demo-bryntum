function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var scheduler;
  t.beforeEach(function () {
    return scheduler && scheduler.destroy();
  }); // #8943 - https://app.assembla.com/spaces/bryntum/tickets/8943

  t.it('Should not crash after drag-create', function (t) {
    var eventDragged = false;
    scheduler = t.getScheduler({
      appendTo: document.body,
      resources: [{
        id: 'r1',
        name: 'Resource 1'
      }],
      events: [],
      features: {
        eventEdit: true
      },
      listeners: {
        eventDrag: function eventDrag() {
          eventDragged = true;
        }
      }
    });
    t.chain({
      drag: '.b-sch-timeaxis-cell',
      offset: [100, '50%'],
      by: [200, 0]
    }, {
      waitForSelector: '.b-eventeditor'
    }, {
      type: '123[ENTER]'
    }, {
      waitForSelectorNotFound: '.b-eventeditor'
    }, {
      drag: scheduler.eventSelector,
      by: [50, 0]
    }, function () {
      t.ok(eventDragged, 'Event dragged w/o issues');
    });
  }); // #8943 - https://app.assembla.com/spaces/bryntum/tickets/8943

  t.it('Should not crash after drag-create with Scheduler in multi-assignment mode', function (t) {
    var eventDragged = false;
    scheduler = t.getScheduler({
      appendTo: document.body,
      resources: [{
        id: 'r1',
        name: 'Resource 1'
      }],
      events: [{
        id: 'e1',
        name: '123',
        startDate: new Date(2011, 0, 5),
        endDate: new Date(2011, 0, 6)
      }],
      assignments: [{
        id: 'a1',
        eventId: 'e1',
        resourceId: 'r1'
      }],
      features: {
        eventEdit: true,
        eventTooltip: false
      },
      listeners: {
        eventDrag: function eventDrag() {
          eventDragged = true;
        }
      }
    });
    t.chain({
      drag: '.b-sch-timeaxis-cell',
      offset: [100, '50%'],
      by: [200, 0]
    }, {
      waitForSelector: '.b-eventeditor'
    }, {
      type: '123[ENTER]'
    }, {
      waitForSelectorNotFound: '.b-eventeditor'
    }, {
      drag: scheduler.eventSelector + ' .b-sch-dirty-new',
      by: [50, 0]
    }, function () {
      t.ok(eventDragged, 'Event dragged w/o issues');
    });
  }); // https://github.com/bryntum/support/issues/1376

  t.it('Should not get stuck after minimal drag create', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return t.getSchedulerAsync({
                events: []
              });

            case 2:
              t.chain({
                drag: '.b-sch-timeaxis-cell',
                offset: [100, '50%'],
                by: [3, 0]
              }, function () {
                t.selectorNotExists('.b-sch-dragcreator-proxy', 'No proxy element found');
              });

            case 3:
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