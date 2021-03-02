function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest( /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
    var scheduler;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            scheduler = bryntum.query('scheduler');
            t.beforeEach(function (t, next) {
              t.waitForSelector('.b-sch-event', function () {
                next();
              });
            });
            _context3.next = 4;
            return t.click('[data-ref=customButton]');

          case 4:
            t.it('sanity', function (t) {
              t.checkGridSanity(scheduler);
            }); // https://app.assembla.com/spaces/bryntum/tickets/9112

            t.it('Should not crash for 1001 resources', function (t) {
              t.chain({
                click: '[data-ref=resourceCountField]'
              }, {
                type: '1001[ENTER]',
                clearExisting: true
              }, {
                waitFor: function waitFor() {
                  return scheduler.eventStore.count === 5005;
                },
                desc: 'Waiting for correct amount of events'
              });
            });
            t.it('Should draw dependencies', function (t) {
              t.ok(scheduler.features.dependencies.disabled, 'Dependencies disabled');
              t.is(scheduler.dependencyStore.count, 0, 'No dependencies initially');
              t.isCalledOnce('updateProject', scheduler, 'Data generated once');
              t.chain({
                click: 'button:contains("Dependencies")'
              }, {
                waitForSelector: '.b-sch-dependency',
                desc: 'Dependency lines rendered'
              }, {
                click: 'button:contains("Dependencies")'
              }, {
                waitForSelectorNotFound: '.b-sch-dependency',
                desc: 'Dependency lines removed'
              }, {
                click: 'button:contains("Dependencies")'
              }, {
                waitForSelector: '.b-sch-dependency',
                desc: 'Dependency lines back'
              });
            });
            t.it('Should not crash for 10 resources', function (t) {
              t.chain({
                click: '[data-ref=resourceCountField]'
              }, {
                type: '10[ENTER]',
                clearExisting: true
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        return _context.abrupt("return", new Promise(function (resolve) {
                          scheduler.on({
                            projectChange: function projectChange(_ref3) {
                              var project = _ref3.project;
                              // Test should not throw before dataReady is fired
                              project.await('dataReady', false).then(function () {
                                return resolve();
                              });
                            }
                          });
                        }));

                      case 1:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              })));
            }); // https://github.com/bryntum/support/issues/1487

            t.it('Should not leave old lines when replacing project', /*#__PURE__*/function () {
              var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        scheduler.features.dependencies.disabled = false;
                        window.brk = true;
                        scheduler.generateResources(10);
                        _context2.next = 5;
                        return scheduler.await('dependenciesDrawn', false);

                      case 5:
                        scheduler.generateResources(5);
                        _context2.next = 8;
                        return scheduler.await('dependenciesDrawn', false);

                      case 8:
                        t.selectorNotExists('polyline[depId="21"]', 'Old dependency not drawn');

                      case 9:
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

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());