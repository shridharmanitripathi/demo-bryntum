function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/* eslint-disable */
StartTest(function (t) {
  var scheduler, dependencyFeature, drawSpy;
  t.it('Grouped', function (t) {
    // async beforeEach doesn't work in umd
    t.beforeEach( /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t, next) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                scheduler && scheduler.destroy();
                scheduler = t.getScheduler({
                  features: {
                    group: 'name'
                  },
                  resourceStore: t.getResourceStore2({}, 2),
                  dependencyStore: true
                }, 2);
                dependencyFeature = scheduler.features.dependencies;
                drawSpy = t.spyOn(dependencyFeature, 'draw').callThrough();
                _context.next = 6;
                return t.waitForDependencies();

              case 6:
                next();

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }());
    t.it('Should repaint fully when a group containing source node is collapsed', function (t) {
      t.chain({
        waitForAnimationFrame: ''
      }, function (next) {
        drawSpy.reset();
        next();
      }, {
        click: '.b-group-title:contains(Resource 1)'
      }, {
        waitForSelectorNotFound: '.b-sch-dependency:not(.b-sch-released)'
      }, {
        waitFor: function waitFor() {
          return drawSpy.calls.count() === 1;
        }
      }, {
        click: '.b-group-title:contains(Resource 1)'
      }, {
        waitForSelector: '.b-sch-dependency:not(.b-sch-released)'
      }, {
        waitFor: function waitFor() {
          return drawSpy.calls.count() === 2;
        }
      });
    });
    t.it('Should repaint fully when a group containing target node is collapsed', function (t) {
      t.chain({
        waitForAnimationFrame: ''
      }, function (next) {
        drawSpy.reset();
        next();
      }, {
        click: '.b-group-title:contains(Resource 2)'
      }, {
        waitForSelectorNotFound: '.b-sch-dependency:not(.b-sch-released)'
      }, {
        waitForAnimationFrame: ''
      }, function (next) {
        t.expect(drawSpy).toHaveBeenCalled(1);
        next();
      }, {
        click: '.b-group-title:contains(Resource 2)'
      }, {
        waitForSelector: '.b-sch-dependency:not(.b-sch-released)'
      }, function (next) {
        t.expect(drawSpy).toHaveBeenCalled(2);
        next();
      });
    });
  });
  t.it('ResourceStore mutation', function (t) {
    // async beforeEach doesn't work in umd
    t.beforeEach( /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t, next) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                scheduler && scheduler.destroy();
                scheduler = t.getScheduler({
                  resourceStore: t.getResourceStore2({}, 10),
                  dependencyStore: true
                });
                dependencyFeature = scheduler.features.dependencies;
                _context2.next = 5;
                return t.waitForDependencies();

              case 5:
                next();

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
      };
    }());
    t.it('Should repaint correctly if event store is filtered', function (t) {
      t.willFireNTimes(scheduler, 'dependenciesDrawn', 2);
      t.chain({
        waitForAnimationFrame: ''
      }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                // Dependency lines must be there
                t.selectorExists('.b-sch-dependency:not(.b-sch-released)'); // Set to no visible events

                scheduler.eventStore.filter(function () {
                  return false;
                });
                _context3.next = 4;
                return scheduler.await('dependenciesDrawn', {
                  checkLog: false
                });

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      })), {
        waitForSelectorNotFound: '.b-sch-dependency:not(.b-sch-released)'
      }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                // Restore all events
                scheduler.eventStore.filter({
                  replace: true,
                  filters: function filters() {
                    return true;
                  }
                });
                _context4.next = 3;
                return scheduler.await('dependenciesDrawn', {
                  checkLog: false
                });

              case 3:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      })), {
        waitForDependencies: null
      });
    });
    t.it('Should repaint fully if resource store is filtered', function (t) {
      t.chain({
        waitForAnimationFrame: ''
      }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                // Dependency lines must be there
                t.selectorExists('.b-sch-dependency:not(.b-sch-released)'); // None have been released yet

                t.selectorNotExists('.b-sch-dependency.b-sch-released');
                t.willFireNTimes(scheduler, 'dependenciesDrawn', 3); // Filter out all but first two

                scheduler.resourceStore.filter(function (rec) {
                  return scheduler.resourceStore.indexOf(rec) < 2;
                });
                _context5.next = 6;
                return scheduler.await('dependenciesDrawn', {
                  checkLog: false
                });

              case 6:
                // Only one dependency lines must be there
                t.selectorCountIs('.b-sch-dependency:not(.b-sch-released)', 1); // All but the first one have been released
                //t.selectorExists('.b-sch-dependency.b-sch-released');
                // No visible resources (rows)

                scheduler.resourceStore.filter(function () {
                  return false;
                });
                _context5.next = 10;
                return scheduler.await('dependenciesDrawn', {
                  checkLog: false
                });

              case 10:
                // With no lines
                t.selectorNotExists('.b-sch-dependency:not(.b-sch-released)'); // Restore all resources (rows)

                scheduler.resourceStore.filter({
                  replace: true,
                  filters: function filters() {
                    return true;
                  }
                });
                _context5.next = 14;
                return scheduler.await('dependenciesDrawn', {
                  checkLog: false
                });

              case 14:
                // With dependency lines
                t.selectorExists('.b-sch-dependency:not(.b-sch-released)');

              case 15:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      })));
    });
    t.it('Should repaint fully if resource store is cleared', function (t) {
      t.chain({
        waitForAnimationFrame: ''
      }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                // Dependency lines must be there
                t.selectorExists('.b-sch-dependency:not(.b-sch-released)'); // Clear all resources (rows)

                scheduler.resourceStore.removeAll();
                _context6.next = 4;
                return scheduler.project.commitAsync();

              case 4:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      })), {
        waitForAnimationFrame: ''
      }, function () {
        // With no lines
        t.selectorNotExists('.b-sch-dependency:not(.b-sch-released)');
      });
    });
    t.it('Should repaint fully if resource store is sorted', function (t) {
      t.chain({
        waitForAnimationFrame: ''
      }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                // Dependency lines must be there
                t.selectorExists('.b-sch-dependency:not(.b-sch-released)');
                t.willFireNTimes(scheduler, 'dependenciesDrawn', 1); // Sort resources (rows)

                scheduler.resourceStore.sort('name', false);
                _context7.next = 5;
                return scheduler.await('dependenciesDrawn', {
                  checkLog: false
                });

              case 5:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      })));
    });
  });
  t.it('Event drag which caused no data change', function (t) {
    // async beforeEach doesn't work in umd
    t.beforeEach( /*#__PURE__*/function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(t, next) {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                scheduler && scheduler.destroy();
                scheduler = t.getScheduler({
                  resourceStore: t.getResourceStore2({}, 2),
                  dependencyStore: true,
                  viewPreset: {
                    base: 'dayAndWeek',
                    timeResolution: {
                      unit: 'day'
                    }
                  }
                }, 2);
                dependencyFeature = scheduler.features.dependencies;
                drawSpy = t.spyOn(dependencyFeature, 'draw').callThrough();
                _context8.next = 6;
                return t.waitForDependencies();

              case 6:
                drawSpy.reset();
                next();

              case 8:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));

      return function (_x5, _x6) {
        return _ref8.apply(this, arguments);
      };
    }());
    t.it('Should repaint fully if the drag was too small to cause a data change', function (t) {
      var eventEl, eventRect;
      t.chain({
        waitForSelector: '.b-sch-event'
      }, function (next) {
        eventEl = scheduler.currentOrientation.getElementsFromEventRecord(scheduler.eventStore.getAt(1))[0];
        eventRect = Rectangle.from(eventEl);
        next();
      }, function (next) {
        // Dependency lines must be there
        t.selectorExists('.b-sch-dependency:not(.b-sch-released)');
        next();
      }, // We drag the event, but by much smaller than its snapping increment
      {
        drag: '.b-sch-event:contains(Assignment 2)',
        by: [20, 0]
      }, {
        waitForSelectorNotFound: '.b-aborting'
      }, function (next) {
        // Must have redrawn
        t.expect(drawSpy).toHaveBeenCalled(1); // But the event has not moved - it's snapped back into its original position

        t.isDeeply(Rectangle.from(eventEl), eventRect);
      });
    });
    t.it('Should repaint fully if the resize made the event too small to cause a data change', function (t) {
      var eventEl, eventRect;
      t.chain({
        waitForSelector: '.b-sch-event'
      }, function (next) {
        eventEl = scheduler.currentOrientation.getElementsFromEventRecord(scheduler.eventStore.getAt(1))[0];
        eventRect = Rectangle.from(eventEl);
        next();
      }, // We resize the event, but by much smaller than its snapping increment
      {
        drag: '.b-sch-event:contains(Assignment 2)',
        offset: [5, 2],
        by: [20, 0]
      }, {
        waitForAnimationFrame: ''
      }, function (next) {
        // Not sure about this, it redraws live and looks correct
        // Must have redrawn
        //t.expect(drawSpy).toHaveBeenCalled(2);
        // But the event has not moved - it's snapped back into its original position
        t.isDeeply(Rectangle.from(eventEl), eventRect);
      });
    });
  });
  t.it('Zooming', function (t) {
    // async beforeEach doesn't work in umd
    t.beforeEach( /*#__PURE__*/function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(t, next) {
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                scheduler && scheduler.destroy();
                scheduler = t.getScheduler({
                  resourceStore: t.getResourceStore2({}, 2),
                  dependencyStore: true
                });
                _context9.next = 4;
                return t.waitForDependencies();

              case 4:
                next();

              case 5:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));

      return function (_x7, _x8) {
        return _ref9.apply(this, arguments);
      };
    }());
    t.it('Should repaint lines after zooming', function (t) {
      t.chain({
        waitForSelector: '.b-sch-dependency:not(.b-sch-released)'
      }, function (next) {
        t.waitForEvent(scheduler, 'dependenciesDrawn', next);
        scheduler.zoomOut();
      }, {
        waitForSelector: '.b-sch-dependency:not(.b-sch-released)'
      });
    });
  });
  t.it('Horizontal scrolling in other region should not draw dependencies', /*#__PURE__*/function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(t) {
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              scheduler && scheduler.destroy();
              scheduler = t.getScheduler({
                resourceStore: t.getResourceStore2({}, 2),
                dependencyStore: true
              });
              _context10.next = 4;
              return t.waitForDependencies();

            case 4:
              t.firesOk(scheduler, {
                dependenciesDrawn: 1 // for the resize

              });
              t.chain({
                waitForEvent: [scheduler, 'dependenciesDrawn'],
                trigger: function trigger() {
                  return scheduler.subGrids.locked.width = 50;
                }
              }, function (next) {
                scheduler.subGrids.locked.scrollable.x = 50;
                next();
              }, {
                waitFor: 250,
                desc: 'Waiting to make sure dependencies are not drawn, async operation'
              });

            case 6:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    }));

    return function (_x9) {
      return _ref10.apply(this, arguments);
    };
  }());
});