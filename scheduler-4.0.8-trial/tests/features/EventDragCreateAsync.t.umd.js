function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var resetCallCount,
      scheduler,
      oldReset = ResizeHelper.prototype.reset;

  ResizeHelper.prototype.reset = function () {
    ++resetCallCount;
    oldReset.call(this);
  };

  t.beforeEach(function () {
    scheduler && scheduler.destroy();
    resetCallCount = 0;
  });
  t.it('Should not be possible to drag create if one is in progress', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
      var dragCreateContext;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              scheduler = t.getScheduler({
                events: []
              });
              _context2.next = 3;
              return t.waitForProjectReady();

            case 3:
              scheduler.on({
                beforedragcreatefinalize: function beforedragcreatefinalize(_ref2) {
                  var context = _ref2.context;
                  context.async = true;
                  dragCreateContext = context;
                },
                once: true
              });
              t.firesOk({
                observable: scheduler,
                events: {
                  beforedragcreate: 3,
                  dragcreatestart: 3,
                  dragcreateend: 3,
                  afterdragcreate: 3,
                  beforedragcreatefinalize: 3
                }
              });
              t.chain( // Kick off a drag create. It will be converted to async, and finalized later
              {
                drag: '.b-sch-timeaxis-cell',
                offset: [200, 50],
                by: [100, 0]
              }, // Attempt another drag create while one is in progress - this should not work
              {
                drag: '.b-sch-timeaxis-cell',
                offset: [200, 100],
                by: [100, 0]
              }, function (next) {
                t.is(scheduler.eventStore.count, 0, 'Second attempt to drag create failed'); // Finish that first dragcreate

                dragCreateContext.finalize(true);
                t.is(scheduler.eventStore.count, 1, 'Only 1 event created');
                next();
              }, function (next) {
                scheduler.on({
                  beforedragcreatefinalize: function beforedragcreatefinalize(_ref3) {
                    var context = _ref3.context;
                    context.async = true;
                    dragCreateContext = context;
                  },
                  once: true
                });
                next();
              }, // This one will also delay completing and creating the second event
              {
                drag: '.b-sch-timeaxis-cell',
                offset: [200, 100],
                by: [100, 0]
              }, // These should not create a third event.
              {
                click: '.b-sch-timeaxis-cell',
                offset: [200, 150]
              }, {
                drag: '.b-sch-timeaxis-cell',
                offset: [200, 150],
                by: [100, 0]
              },
              /*#__PURE__*/
              // Finish the second delayed dragcreate
              _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        dragCreateContext.finalize(true);
                        _context.next = 3;
                        return t.waitForProjectReady();

                      case 3:
                        t.is(scheduler.eventStore.count, 2, '2nd event created');

                      case 4:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              })), {
                drag: '.b-sch-timeaxis-cell',
                offset: [200, 250],
                by: [100, 0]
              }, function () {
                t.is(scheduler.eventStore.count, 3, '3rd event created');
              });

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
  t.it('Event resize during drag create should be possible', /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
      var dragCreateContext;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              scheduler = t.getScheduler({
                events: [{
                  resourceId: 'r1',
                  startDate: '2011-01-04',
                  endDate: '2011-01-05',
                  cls: 'event-1',
                  id: 1
                }]
              });
              _context3.next = 3;
              return t.waitForProjectReady();

            case 3:
              scheduler.on({
                beforedragcreatefinalize: function beforedragcreatefinalize(_ref6) {
                  var context = _ref6.context;
                  context.async = true;
                  dragCreateContext = context;
                },
                once: true
              });
              t.firesOk({
                observable: scheduler,
                events: {
                  beforedragcreate: 2,
                  dragcreatestart: 2,
                  dragcreateend: 2,
                  afterdragcreate: 2,
                  beforedragcreatefinalize: 2,
                  beforeeventresize: 1,
                  eventresizestart: 1,
                  eventresizeend: 1,
                  beforeeventresizefinalize: 1
                }
              });
              t.chain( // Kick off a drag create.
              // The once:true beforedragcreatefinalize handler above changes it to be async
              // and therefore need a programmatic call to its context.finalize method
              {
                drag: '.b-sch-timeaxis-cell',
                offset: [200, 200],
                by: [100, 0]
              }, // While that drag create is outstanding, we resize another event
              {
                drag: '.event-1',
                offset: ['100%-5', '50%'],
                by: [100, 0]
              }, // Then we finalize that drag create
              function (next) {
                dragCreateContext.finalize(true);
                t.is(resetCallCount, 2, 'reset was called once per operation (on resize)');
                next();
              }, // Now a second drag create which will fully complete
              {
                drag: '.b-sch-timeaxis-cell',
                offset: [400, 200],
                by: [100, 0],
                desc: 'Initiate 2nd drag to check for fishy actions'
              }, function (next) {
                t.is(resetCallCount, 3, 'reset was called once per resize operation (on resize)');
                t.is(scheduler.eventStore.count, 3, '2 new events created');
                next();
              });

            case 6:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x2) {
      return _ref5.apply(this, arguments);
    };
  }());
});