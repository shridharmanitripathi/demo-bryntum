function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var scheduler;
  t.beforeEach(function () {
    return scheduler && scheduler.destroy();
  });
  t.it('Should show generic image if IMG is not found in list of valid names', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return t.getSchedulerAsync({
                resources: [{
                  name: 'bar'
                }],
                resourceImagePath: '../examples/_shared/images/users/',
                columns: [{
                  type: 'resourceInfo',
                  text: 'Staff',
                  validNames: ['foo']
                }]
              }, 1);

            case 2:
              scheduler = _context.sent;
              t.chain({
                waitForSelector: 'img[src*="none.png"]'
              }, {
                waitForTextPresent: '0 events'
              });

            case 4:
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
  t.it('Should show generic image if IMG is not found', /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              scheduler = t.getScheduler({
                resources: [{
                  name: 'foo'
                }],
                resourceImagePath: '../examples/_shared/images/users/',
                columns: [{
                  type: 'resourceInfo',
                  text: 'Staff',
                  validNames: ['foo']
                }]
              }, 1);
              t.isCalledNTimes('setDefaultResourceImage', scheduler.columns.first, 1, 'Default image is set once');
              _context2.next = 4;
              return t.waitForProjectReady();

            case 4:
              t.chain({
                waitForSelector: 'img[src*="none.png"]'
              });

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }()); // https://app.assembla.com/spaces/bryntum/tickets/9127

  t.it('validNames null should allow all names', function (t) {
    scheduler = t.getScheduler({
      resources: [{
        name: 'foo'
      }],
      resourceImagePath: '../examples/_shared/images/users/',
      columns: [{
        type: 'resourceInfo',
        text: 'Staff',
        validNames: null
      }]
    }, 1);
    t.chain({
      waitForSelector: 'img[src*="foo.jpg"]'
    }, {
      waitForProjectReady: scheduler
    } // Dont want to destroy it while calculating, not handled well
    );
  });
  t.it('Should not instantly reload images with invalid resourceImagePath or defaultResourceImageName', /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(t) {
      var errorCount, detacher, checkResourceImages, validPath;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              errorCount = 0;

              checkResourceImages = function checkResourceImages(resourceImagePath, defaultResourceImageName, resourceImageExtension, resourceName, checkImageName, checkErrorCount) {
                return [/*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                  return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          errorCount = 0;
                          scheduler = t.getScheduler({
                            resources: [{
                              name: resourceName
                            }],
                            columns: [{
                              type: 'resourceInfo',
                              validNames: []
                            }],
                            defaultResourceImageName: defaultResourceImageName,
                            resourceImagePath: resourceImagePath,
                            resourceImageExtension: resourceImageExtension
                          }, 1);
                          detacher = EventHelper.on({
                            element: scheduler.element,
                            error: function error() {
                              return errorCount++;
                            },
                            capture: true
                          });
                          _context3.next = 5;
                          return scheduler.project.commitAsync();

                        case 5:
                        case "end":
                          return _context3.stop();
                      }
                    }
                  }, _callee3);
                })), {
                  diag: "path=\"".concat(resourceImagePath, "\" default=\"").concat(defaultResourceImageName, "\"  extension=\"").concat(resourceImageExtension, "\" name=\"").concat(resourceName, "\" => ").concat(checkErrorCount, " error(s)")
                }, {
                  waitForSelector: "img[src=\"".concat(checkImageName, "\"]"),
                  desc: "".concat(checkImageName, " image found")
                }, {
                  waitFor: function waitFor() {
                    return errorCount === checkErrorCount;
                  },
                  desc: "Expected amount of errors = ".concat(checkErrorCount)
                }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                  return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                      switch (_context4.prev = _context4.next) {
                        case 0:
                          scheduler.destroy();
                          scheduler = null;
                          detacher();

                        case 3:
                        case "end":
                          return _context4.stop();
                      }
                    }
                  }, _callee4);
                }))];
              }; // Each resource tries to load image by name and if it fails then loads default one
              // Error count depends on name image and default image existence


              validPath = '../examples/_shared/images/users/';
              t.chain(checkResourceImages(validPath, 'none.png', '.jpg', 'Kate', validPath + 'kate.jpg', 0), checkResourceImages(validPath, 'none.png', '.png', 'Kate', validPath + 'none.png', 1), checkResourceImages(validPath, 'none.png', '.jpg', 'Foo', validPath + 'none.png', 1), checkResourceImages(validPath, 'bad.jpg', '.jpg', 'Foo', validPath + 'bad.jpg', 2), checkResourceImages('', 'none.png', '.jpg', 'Foo', '/none.png', 2), checkResourceImages('..', 'none.png', '.jpg', 'Foo', '../none.png', 2), checkResourceImages('../', 'none.png', '.jpg', 'Foo', '../none.png', 2), checkResourceImages(validPath, 'none.jpg', '.png', 'None', validPath + 'none.png', 0), checkResourceImages('', null, '.png', 'Foo', '/foo.png', 1), checkResourceImages('', undefined, '.png', 'Foo', '/foo.png', 1), checkResourceImages('', '', '.png', 'Foo', '/foo.png', 1));

            case 4:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }()); // https://app.assembla.com/spaces/bryntum/tickets/9316

  t.it('Should be possible to specify renderer for ResourceInfoColumn', /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(t) {
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return t.getSchedulerAsync({
                resources: [{
                  name: 'foo'
                }],
                columns: [{
                  type: 'resourceInfo',
                  text: 'Staff',
                  field: 'name',
                  renderer: function renderer() {
                    return 'custom';
                  }
                }]
              });

            case 2:
              scheduler = _context6.sent;
              t.waitForSelector('.b-grid-cell:contains(custom)');

            case 4:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));

    return function (_x4) {
      return _ref6.apply(this, arguments);
    };
  }());
  t.it('Should contain resource name in default renderer', /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(t) {
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return t.getSchedulerAsync({
                resources: [{
                  name: 'foo'
                }],
                columns: [{
                  type: 'resourceInfo',
                  text: 'Staff',
                  field: 'name'
                }]
              });

            case 2:
              scheduler = _context7.sent;
              t.waitForSelector('.b-grid-cell:contains(foo)');

            case 4:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }));

    return function (_x5) {
      return _ref7.apply(this, arguments);
    };
  }());
  t.it('Should show image by image and imageUrl resource fields', /*#__PURE__*/function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(t) {
      var loadCount;
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              loadCount = 0;
              document.body.addEventListener('load', function (e) {
                if (e.target.nodeName.toUpperCase() === 'IMG') {
                  loadCount++;
                }
              }, true);
              _context10.next = 4;
              return t.getSchedulerAsync({
                resourceImagePath: '../examples/_shared/images/users/',
                resources: [{
                  age: 22,
                  name: 'resource 1',
                  image: 'team.jpg'
                }, {
                  age: 88,
                  name: 'resource 2',
                  imageUrl: '../examples/_shared/images/users/amit.jpg'
                }],
                columns: [{
                  field: 'age'
                }, {
                  autoSyncHtml: false,
                  type: 'resourceInfo'
                }],
                features: {
                  group: 'id'
                }
              }, 1);

            case 4:
              scheduler = _context10.sent;
              t.chain({
                waitForSelector: 'img[src*="examples/_shared/images/users/team.jpg"]'
              }, {
                waitForSelector: 'img[src*="examples/_shared/images/users/amit.jpg"]'
              }, {
                waitFor: function waitFor() {
                  return loadCount === 2;
                }
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        return _context8.abrupt("return", document.body.addEventListener('load', function () {
                          return t.fail('load should not be called after a record update');
                        }, true));

                      case 1:
                      case "end":
                        return _context8.stop();
                    }
                  }
                }, _callee8);
              })), {
                dblClick: '.b-grid-cell:contains("22")'
              }, {
                type: '42[ENTER]',
                clearExisting: true
              }, {
                waitFor: 500,
                desc: 'some to allow the image to load, in case there is a bug in DOM update triggering a reload of the image'
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        return _context9.abrupt("return", t.is(loadCount, 2, 'No load triggered'));

                      case 1:
                      case "end":
                        return _context9.stop();
                    }
                  }
                }, _callee9);
              })));

            case 6:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    }));

    return function (_x6) {
      return _ref8.apply(this, arguments);
    };
  }());
});