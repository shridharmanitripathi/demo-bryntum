function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var scheduler;
  t.beforeEach(function (t) {
    return scheduler && !scheduler.isDestroyed && scheduler.destroy();
  });

  function setupScheduler(_x) {
    return _setupScheduler.apply(this, arguments);
  }

  function _setupScheduler() {
    _setupScheduler = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22(t) {
      var config,
          _args22 = arguments;
      return regeneratorRuntime.wrap(function _callee22$(_context22) {
        while (1) {
          switch (_context22.prev = _context22.next) {
            case 0:
              config = _args22.length > 1 && _args22[1] !== undefined ? _args22[1] : {};
              scheduler = new Scheduler(Object.assign({
                appendTo: document.body,
                startDate: new Date(2019, 2, 10),
                endDate: new Date(2019, 2, 17),
                features: {
                  dependencies: true
                },
                resources: ArrayHelper.populate(10, function (i) {
                  return {
                    id: 'r' + (i + 1),
                    name: 'Resource ' + (i + 1)
                  };
                }),
                events: [{
                  id: 'e1',
                  startDate: new Date(2019, 2, 10),
                  duration: 2,
                  name: 'Single'
                }, {
                  id: 'e2',
                  startDate: new Date(2019, 2, 14),
                  duration: 2,
                  name: 'Multi A'
                }, {
                  id: 'e3',
                  startDate: new Date(2019, 2, 10),
                  duration: 1,
                  name: 'Multi B'
                }],
                assignments: [{
                  id: 'a1',
                  eventId: 'e1',
                  resourceId: 'r2'
                }, // Single
                {
                  id: 'a2',
                  eventId: 'e2',
                  resourceId: 'r2'
                }, // Multi A
                {
                  id: 'a3',
                  eventId: 'e2',
                  resourceId: 'r5'
                }, // Multi A
                {
                  id: 'a4',
                  eventId: 'e2',
                  resourceId: 'r6'
                }, // Multi A
                {
                  id: 'a5',
                  eventId: 'e3',
                  resourceId: 'r4'
                }, // Multi B
                {
                  id: 'a6',
                  eventId: 'e3',
                  resourceId: 'r5'
                } // Multi B
                ],
                useInitialAnimation: false,
                enableEventAnimations: false
              }, config));
              _context22.next = 4;
              return t.waitForProjectReady(scheduler.project);

            case 4:
              if (!scheduler.dependencies.length) {
                _context22.next = 7;
                break;
              }

              _context22.next = 7;
              return t.waitForDependencies();

            case 7:
            case "end":
              return _context22.stop();
          }
        }
      }, _callee22);
    }));
    return _setupScheduler.apply(this, arguments);
  }

  function assertDepEndToStart(t, from, to) {
    var flip = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var depLine = t.getSVGBox(document.querySelector("[fromId=\"".concat(from, "\"][toId=\"").concat(to, "\"]"))),
        fromElement = document.querySelector("[data-assignment-id=\"".concat(flip ? to : from, "\"]")).getBoundingClientRect(),
        toElement = document.querySelector("[data-assignment-id=\"".concat(flip ? from : to, "\"]")).getBoundingClientRect();
    t.diag("From ".concat(from, " to ").concat(to));
    t.isApprox(depLine.left, fromElement.right, 'Line from right edge of source event');
    t.isApprox(depLine.right, toElement.left, 'Line to left edge of target event');
    var maxTop = Math.max(fromElement.top, toElement.top),
        minTop = Math.min(fromElement.top, toElement.top); // Dependency line has an arrow which is 6px high, also there's a gap on top. Setting threshold to 3px + extra 2px
    // It looks centered

    t.isApprox(depLine.top, minTop + fromElement.height / 2, 5, 'Top');
    t.isApprox(depLine.bottom, maxTop + fromElement.height / 2, 5, 'Bottom');
  }

  function assertDepNotFound(t, from, to) {
    t.selectorNotExists("[fromId=\"".concat(from, "\"][toId=\"").concat(to, "\"]"));
  }

  function assertAllDeps(t) {
    assertDepEndToStart(t, 'a1', 'a2');
    assertDepEndToStart(t, 'a1', 'a3');
    assertDepEndToStart(t, 'a1', 'a4');
    assertDepEndToStart(t, 'a5', 'a2');
    assertDepEndToStart(t, 'a5', 'a3');
    assertDepEndToStart(t, 'a5', 'a4');
    assertDepEndToStart(t, 'a6', 'a2');
    assertDepEndToStart(t, 'a6', 'a3');
    assertDepEndToStart(t, 'a6', 'a4');
  }

  t.it('Basic drawing', function (t) {
    t.it('Should draw correctly for single to multi', /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return setupScheduler(t, {
                  dependencies: [{
                    id: 'd1',
                    from: 'e1',
                    to: 'e2'
                  }]
                });

              case 2:
                assertDepEndToStart(t, 'a1', 'a2');
                assertDepEndToStart(t, 'a1', 'a3');
                assertDepEndToStart(t, 'a1', 'a4');

              case 5:
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
    t.it('Should draw correctly for multi to single', /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return setupScheduler(t, {
                  dependencies: [{
                    id: 'd1',
                    from: 'e2',
                    to: 'e1',
                    fromSide: 'left',
                    toSide: 'right'
                  }]
                });

              case 2:
                assertDepEndToStart(t, 'a2', 'a1', true);
                assertDepEndToStart(t, 'a3', 'a1', true);
                assertDepEndToStart(t, 'a4', 'a1', true);

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x3) {
        return _ref2.apply(this, arguments);
      };
    }());
    t.it('Should draw correctly for multi to multi', /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return setupScheduler(t, {
                  dependencies: [{
                    id: 'd1',
                    from: 'e3',
                    to: 'e2'
                  }]
                });

              case 2:
                assertDepEndToStart(t, 'a5', 'a2');
                assertDepEndToStart(t, 'a5', 'a3');
                assertDepEndToStart(t, 'a5', 'a4');
                assertDepEndToStart(t, 'a6', 'a2');
                assertDepEndToStart(t, 'a6', 'a3');
                assertDepEndToStart(t, 'a6', 'a4');

              case 8:
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
  });
  t.it('Event CRUD', /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(t) {
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return setupScheduler(t, {
                dependencies: [{
                  id: 'd1',
                  from: 'e1',
                  to: 'e2'
                }, {
                  id: 'd2',
                  from: 'e3',
                  to: 'e2'
                }],
                enableEventAnimations: false
              });

            case 2:
              t.chain(function (next) {
                t.waitForEvent(scheduler, 'dependenciesdrawn', next); // Update

                scheduler.eventStore.getById('e2').startDate = new Date(2019, 2, 15);
                scheduler.project.commitAsync();
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        assertAllDeps(t); // Remove

                        scheduler.eventStore.getById('e3').remove();
                        _context4.next = 4;
                        return scheduler.project.commitAsync();

                      case 4:
                        assertDepEndToStart(t, 'a1', 'a2');
                        assertDepEndToStart(t, 'a1', 'a3');
                        assertDepEndToStart(t, 'a1', 'a4');
                        assertDepNotFound(t, 'a5', 'a2');
                        assertDepNotFound(t, 'a5', 'a3');
                        assertDepNotFound(t, 'a5', 'a4');
                        assertDepNotFound(t, 'a6', 'a2');
                        assertDepNotFound(t, 'a6', 'a3');
                        assertDepNotFound(t, 'a6', 'a4'); // Add not covered since it needs an assignment, tested under Assignment CRUD

                      case 13:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              })));

            case 3:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    return function (_x5) {
      return _ref4.apply(this, arguments);
    };
  }());
  t.it('Event filtering', /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(t) {
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return setupScheduler(t, {
                dependencies: [{
                  id: 'd1',
                  from: 'e1',
                  to: 'e2'
                }, {
                  id: 'd2',
                  from: 'e3',
                  to: 'e2'
                }]
              });

            case 2:
              scheduler.eventStore.filterBy(function (event) {
                return event.id !== 'e1';
              });
              t.chain({
                waitForAnimationFrame: null
              }, function (next) {
                assertDepNotFound(t, 'a1', 'a2');
                assertDepNotFound(t, 'a1', 'a3');
                assertDepNotFound(t, 'a1', 'a4');
                assertDepEndToStart(t, 'a5', 'a2');
                assertDepEndToStart(t, 'a5', 'a3');
                assertDepEndToStart(t, 'a5', 'a4');
                assertDepEndToStart(t, 'a6', 'a2');
                assertDepEndToStart(t, 'a6', 'a3');
                assertDepEndToStart(t, 'a6', 'a4');
                scheduler.eventStore.clearFilters();
                next();
              }, {
                waitForAnimationFrame: null
              }, function () {
                assertAllDeps(t);
              });

            case 4:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));

    return function (_x6) {
      return _ref6.apply(this, arguments);
    };
  }());
  t.it('Resource CRUD', /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(t) {
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return setupScheduler(t, {
                dependencies: [{
                  id: 'd1',
                  from: 'e1',
                  to: 'e2'
                }, {
                  id: 'd2',
                  from: 'e3',
                  to: 'e2'
                }]
              });

            case 2:
              t.chain( // Add
              {
                waitForEvent: [scheduler, 'dependenciesDrawn'],
                trigger: function trigger() {
                  return scheduler.resourceStore.insert(3, {
                    id: 'r20'
                  });
                }
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        return _context7.abrupt("return", assertAllDeps(t));

                      case 1:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7);
              })), // Remove empty resource in the middle
              {
                waitForEvent: [scheduler, 'dependenciesDrawn'],
                trigger: function trigger() {
                  return scheduler.resourceStore.remove('r3');
                }
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        return _context8.abrupt("return", assertAllDeps(t));

                      case 1:
                      case "end":
                        return _context8.stop();
                    }
                  }
                }, _callee8);
              })), // Remove resource with events
              {
                waitForEvent: [scheduler, 'dependenciesDrawn'],
                trigger: function trigger() {
                  scheduler.resourceStore.remove('r2');
                }
              }, // Some weird timing thing going on, ends up correct
              {
                waitForAnimationFrame: null
              }, function () {
                assertDepNotFound(t, 'a1', 'a2');
                assertDepNotFound(t, 'a1', 'a3');
                assertDepNotFound(t, 'a1', 'a4');
                assertDepNotFound(t, 'a5', 'a2');
                assertDepEndToStart(t, 'a5', 'a3');
                assertDepEndToStart(t, 'a5', 'a4');
                assertDepNotFound(t, 'a6', 'a2');
                assertDepEndToStart(t, 'a6', 'a3');
                assertDepEndToStart(t, 'a6', 'a4');
              });

            case 3:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    }));

    return function (_x7) {
      return _ref7.apply(this, arguments);
    };
  }());
  t.it('Resource filtering', /*#__PURE__*/function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(t) {
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return setupScheduler(t, {
                dependencies: [{
                  id: 'd1',
                  from: 'e1',
                  to: 'e2'
                }, {
                  id: 'd2',
                  from: 'e3',
                  to: 'e2'
                }]
              });

            case 2:
              scheduler.resourceStore.filterBy(function (resource) {
                return resource.id !== 'r2';
              });
              t.chain({
                waitForAnimationFrame: null
              }, function (next) {
                assertDepNotFound(t, 'a1', 'a2');
                assertDepNotFound(t, 'a1', 'a3');
                assertDepNotFound(t, 'a1', 'a4');
                assertDepNotFound(t, 'a5', 'a2');
                assertDepEndToStart(t, 'a5', 'a3');
                assertDepEndToStart(t, 'a5', 'a4');
                assertDepNotFound(t, 'a6', 'a2');
                assertDepEndToStart(t, 'a6', 'a3');
                assertDepEndToStart(t, 'a6', 'a4');
                scheduler.resourceStore.clearFilters();
                next();
              }, {
                waitForAnimationFrame: null
              }, function () {
                assertAllDeps(t);
              });

            case 4:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    }));

    return function (_x8) {
      return _ref10.apply(this, arguments);
    };
  }());
  t.it('Assignment CRUD', /*#__PURE__*/function () {
    var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(t) {
      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return setupScheduler(t, {
                dependencies: [{
                  id: 'd1',
                  from: 'e1',
                  to: 'e2'
                }, {
                  id: 'd2',
                  from: 'e3',
                  to: 'e2'
                }]
              });

            case 2:
              t.chain(function (next) {
                t.waitForEvent(scheduler, 'dependenciesdrawn', next); // Add

                scheduler.assignmentStore.add({
                  id: 'a7',
                  resourceId: 'r1',
                  eventId: 'e2'
                });
              }, function (next) {
                assertAllDeps(t);
                assertDepEndToStart(t, 'a1', 'a7'); // Remove

                scheduler.assignmentStore.remove('a2');
                next();
              }, {
                waitForProjectReady: scheduler
              }, function (next) {
                assertDepNotFound(t, 'a1', 'a2');
                assertDepEndToStart(t, 'a1', 'a3');
                assertDepEndToStart(t, 'a1', 'a4');
                assertDepNotFound(t, 'a5', 'a2');
                assertDepEndToStart(t, 'a5', 'a3');
                assertDepEndToStart(t, 'a5', 'a4');
                assertDepNotFound(t, 'a6', 'a2');
                assertDepEndToStart(t, 'a6', 'a3');
                assertDepEndToStart(t, 'a6', 'a4');
                t.waitForEvent(scheduler, 'dependenciesdrawn', next); // Update

                scheduler.assignmentStore.getById('a3').resourceId = 'r10'; // TODO: The line above does not invalidate the graph, making the code below fail
              }, {
                waitForProjectReady: scheduler
              }, function () {
                assertDepEndToStart(t, 'a1', 'a3');
                assertDepEndToStart(t, 'a5', 'a3');
                assertDepEndToStart(t, 'a6', 'a3');
              });

            case 3:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    }));

    return function (_x9) {
      return _ref11.apply(this, arguments);
    };
  }());
  t.it('Assignment filtering', /*#__PURE__*/function () {
    var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(t) {
      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return setupScheduler(t, {
                dependencies: [{
                  id: 'd1',
                  from: 'e1',
                  to: 'e2'
                }, {
                  id: 'd2',
                  from: 'e3',
                  to: 'e2'
                }]
              });

            case 2:
              scheduler.assignmentStore.filterBy(function (assignment) {
                return assignment.resourceId !== 'r2';
              });
              t.chain({
                waitForAnimationFrame: null
              }, function (next) {
                assertDepNotFound(t, 'a1', 'a2');
                assertDepNotFound(t, 'a1', 'a3');
                assertDepNotFound(t, 'a1', 'a4');
                assertDepNotFound(t, 'a5', 'a2');
                assertDepEndToStart(t, 'a5', 'a3');
                assertDepEndToStart(t, 'a5', 'a4');
                assertDepNotFound(t, 'a6', 'a2');
                assertDepEndToStart(t, 'a6', 'a3');
                assertDepEndToStart(t, 'a6', 'a4');
                scheduler.assignmentStore.clearFilters();
                next();
              }, {
                waitForAnimationFrame: null
              }, function () {
                assertAllDeps(t);
              });

            case 4:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12);
    }));

    return function (_x10) {
      return _ref12.apply(this, arguments);
    };
  }());
  t.it('Dependency CRUD', /*#__PURE__*/function () {
    var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(t) {
      return regeneratorRuntime.wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              _context16.next = 2;
              return setupScheduler(t, {
                dependencies: [{
                  id: 'd1',
                  from: 'e1',
                  to: 'e2'
                }]
              });

            case 2:
              t.chain( // Add
              {
                waitForEvent: [scheduler, 'dependenciesDrawn'],
                trigger: function trigger() {
                  return scheduler.dependencyStore.add({
                    id: 'd2',
                    from: 'e3',
                    to: 'e2'
                  });
                }
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
                return regeneratorRuntime.wrap(function _callee13$(_context13) {
                  while (1) {
                    switch (_context13.prev = _context13.next) {
                      case 0:
                        return _context13.abrupt("return", assertAllDeps(t));

                      case 1:
                      case "end":
                        return _context13.stop();
                    }
                  }
                }, _callee13);
              })), // Remove
              {
                waitForEvent: [scheduler, 'dependenciesDrawn'],
                trigger: function trigger() {
                  return scheduler.dependencyStore.first.remove();
                }
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
                return regeneratorRuntime.wrap(function _callee14$(_context14) {
                  while (1) {
                    switch (_context14.prev = _context14.next) {
                      case 0:
                        assertDepNotFound(t, 'a1', 'a2');
                        assertDepNotFound(t, 'a1', 'a3');
                        assertDepNotFound(t, 'a1', 'a4');

                      case 3:
                      case "end":
                        return _context14.stop();
                    }
                  }
                }, _callee14);
              })), // Update
              {
                waitForEvent: [scheduler, 'dependenciesDrawn'],
                trigger: function trigger() {
                  return scheduler.dependencyStore.first.from = 'e1';
                }
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
                return regeneratorRuntime.wrap(function _callee15$(_context15) {
                  while (1) {
                    switch (_context15.prev = _context15.next) {
                      case 0:
                        assertDepEndToStart(t, 'a1', 'a2');
                        assertDepEndToStart(t, 'a1', 'a3');
                        assertDepEndToStart(t, 'a1', 'a4');
                        assertDepNotFound(t, 'a5', 'a2');
                        assertDepNotFound(t, 'a5', 'a3');
                        assertDepNotFound(t, 'a5', 'a4');
                        assertDepNotFound(t, 'a6', 'a2');
                        assertDepNotFound(t, 'a6', 'a3');
                        assertDepNotFound(t, 'a6', 'a4');

                      case 9:
                      case "end":
                        return _context15.stop();
                    }
                  }
                }, _callee15);
              })), // Remove all
              {
                waitForEvent: [scheduler, 'dependenciesDrawn'],
                trigger: function trigger() {
                  return scheduler.dependencyStore.removeAll();
                }
              }, function () {
                assertDepNotFound(t, 'a1', 'a2');
                assertDepNotFound(t, 'a1', 'a3');
                assertDepNotFound(t, 'a1', 'a4');
                assertDepNotFound(t, 'a5', 'a2');
                assertDepNotFound(t, 'a5', 'a3');
                assertDepNotFound(t, 'a5', 'a4');
                assertDepNotFound(t, 'a6', 'a2');
                assertDepNotFound(t, 'a6', 'a3');
                assertDepNotFound(t, 'a6', 'a4');
              });

            case 3:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16);
    }));

    return function (_x11) {
      return _ref13.apply(this, arguments);
    };
  }());
  t.it('Dependency filtering', /*#__PURE__*/function () {
    var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(t) {
      return regeneratorRuntime.wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              _context17.next = 2;
              return setupScheduler(t, {
                dependencies: [{
                  id: 'd1',
                  from: 'e1',
                  to: 'e2'
                }, {
                  id: 'd2',
                  from: 'e3',
                  to: 'e2'
                }]
              });

            case 2:
              scheduler.dependencyStore.filterBy(function (dependency) {
                return dependency.id !== 'd2';
              });
              t.chain({
                waitForAnimationFrame: null
              }, function (next) {
                assertDepEndToStart(t, 'a1', 'a2');
                assertDepEndToStart(t, 'a1', 'a3');
                assertDepEndToStart(t, 'a1', 'a4');
                assertDepNotFound(t, 'a5', 'a2');
                assertDepNotFound(t, 'a5', 'a3');
                assertDepNotFound(t, 'a5', 'a4');
                assertDepNotFound(t, 'a6', 'a2');
                assertDepNotFound(t, 'a6', 'a3');
                assertDepNotFound(t, 'a6', 'a4');
                scheduler.dependencyStore.clearFilters();
                next();
              }, {
                waitForAnimationFrame: null
              }, function () {
                assertAllDeps(t);
              });

            case 4:
            case "end":
              return _context17.stop();
          }
        }
      }, _callee17);
    }));

    return function (_x12) {
      return _ref17.apply(this, arguments);
    };
  }());
  t.it('Event drag', /*#__PURE__*/function () {
    var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(t) {
      return regeneratorRuntime.wrap(function _callee18$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              _context18.next = 2;
              return setupScheduler(t, {
                dependencies: [{
                  id: 'd1',
                  from: 'e1',
                  to: 'e2'
                }]
              });

            case 2:
              t.chain({
                drag: '[data-assignment-id="a3"]',
                by: [-146, -60]
              }, function () {
                assertDepEndToStart(t, 'a1', 'a2');
                assertDepEndToStart(t, 'a1', 'a3');
                assertDepEndToStart(t, 'a1', 'a4');
              });

            case 3:
            case "end":
              return _context18.stop();
          }
        }
      }, _callee18);
    }));

    return function (_x13) {
      return _ref18.apply(this, arguments);
    };
  }()); // https://app.assembla.com/spaces/bryntum/tickets/7980

  t.it('Abort should not throw error', /*#__PURE__*/function () {
    var _ref19 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(t) {
      return regeneratorRuntime.wrap(function _callee19$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              _context19.next = 2;
              return setupScheduler(t);

            case 2:
              t.chain({
                moveMouseTo: '.b-sch-event'
              }, // Mousedown and mouseup with no drag aborts the dep create operation.
              {
                click: '.b-sch-event .b-sch-terminal-bottom'
              }, function () {
                t.pass('No error thrown');
              });

            case 3:
            case "end":
              return _context19.stop();
          }
        }
      }, _callee19);
    }));

    return function (_x14) {
      return _ref19.apply(this, arguments);
    };
  }()); // https://app.assembla.com/spaces/bryntum/tickets/8272

  t.it('Vertical re-sort should not leave orphaned lines', /*#__PURE__*/function () {
    var _ref20 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20(t) {
      var event;
      return regeneratorRuntime.wrap(function _callee20$(_context20) {
        while (1) {
          switch (_context20.prev = _context20.next) {
            case 0:
              _context20.next = 2;
              return setupScheduler(t, {
                dependencies: [{
                  id: 'd1',
                  from: 'e1',
                  to: 'e2'
                }]
              });

            case 2:
              event = scheduler.eventStore.getById('e3'); //
              // // Want it to sort first on overlap

              event.name = 'A';
              event.duration = 2; // Put it below multi assigned event
              // [Multi A]
              //     [A      ]

              event.startDate = new Date(2019, 2, 15);
              scheduler.assignmentStore.getById('a6').resourceId = 'r6';
              t.chain({
                waitForProjectReady: scheduler
              }, // Let view refresh before moving again
              {
                waitForAnimationFrame: null
              }, function (next) {
                // Move it to same start, triggering vertical re-sort
                // [Multi A]          -->  [A      ]
                // <---[A      ]           [Multi A]
                event.startDate = new Date(2019, 2, 14);
                next();
              }, {
                waitForProjectReady: scheduler
              }, // Let view refresh before evaluating
              {
                waitForAnimationFrame: null
              }, function () {
                // Should line up with bottom event
                var depBox = Rectangle.from(document.querySelector('[depId=d1][toId=a4]'), scheduler.timeAxisSubGridElement);
                var eventBox = Rectangle.from(document.querySelector('[data-assignment-id=a4]'), scheduler.timeAxisSubGridElement);
                t.isApprox(depBox.bottom, eventBox.top + eventBox.height / 2, 5, 'Aligned correctly'); // const depBox = Rectangle.from(document.querySelector('[depId=d1][toId=a4]'), scheduler.timeAxisSubGridElement);
                // const eventBox = Rectangle.from(document.querySelector('[data-assignment-id=a4]'), scheduler.timeAxisSubGridElement);
                //
                // t.isApprox(depBox.bottom, eventBox.top + eventBox.height / 2, 5, 'Aligned correctly');
              });

            case 8:
            case "end":
              return _context20.stop();
          }
        }
      }, _callee20);
    }));

    return function (_x15) {
      return _ref20.apply(this, arguments);
    };
  }()); // https://github.com/bryntum/support/issues/1384

  t.it('Should draw dependencies for new assignment', /*#__PURE__*/function () {
    var _ref21 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21(t) {
      return regeneratorRuntime.wrap(function _callee21$(_context21) {
        while (1) {
          switch (_context21.prev = _context21.next) {
            case 0:
              _context21.next = 2;
              return setupScheduler(t, {
                dependencies: [{
                  id: 'd1',
                  from: 'e1',
                  to: 'e2'
                }]
              });

            case 2:
              _context21.next = 4;
              return scheduler.editEvent(scheduler.eventStore.getById('e2'));

            case 4:
              t.chain({
                type: 'r[ENTER][ESC][ENTER]',
                target: 'input[name=resource]'
              }, {
                waitFor: function waitFor() {
                  return t.query("polyline[toId=".concat(scheduler.assignmentStore.last.id, "]"));
                },
                desc: 'New line drawn'
              });

            case 5:
            case "end":
              return _context21.stop();
          }
        }
      }, _callee21);
    }));

    return function (_x16) {
      return _ref21.apply(this, arguments);
    };
  }());
});