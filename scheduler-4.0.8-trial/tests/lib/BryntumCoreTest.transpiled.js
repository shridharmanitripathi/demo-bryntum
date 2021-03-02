function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var paramValueRegExp = /^(\w+)=(.*)$/,
    parseParams = function parseParams(paramString) {
  var result = {},
      params = paramString ? paramString.split('&') : []; // loop through each 'filter={"field":"name","operator":"=","value":"Sweden","caseSensitive":true}' string
  // So we cannot use .split('='). Using forEach instead of for...of for IE

  params.forEach(function (nameValuePair) {
    var _paramValueRegExp$exe = paramValueRegExp.exec(nameValuePair),
        _paramValueRegExp$exe2 = _slicedToArray(_paramValueRegExp$exe, 3),
        match = _paramValueRegExp$exe2[0],
        name = _paramValueRegExp$exe2[1],
        value = _paramValueRegExp$exe2[2],
        decodedName = decodeURIComponent(name),
        decodedValue = decodeURIComponent(value);

    if (match) {
      var paramValue = result[decodedName];

      if (paramValue) {
        if (!Array.isArray(paramValue)) {
          paramValue = result[decodedName] = [paramValue];
        }

        paramValue.push(decodedValue);
      } else {
        result[decodedName] = decodedValue;
      }
    }
  });
  return result;
};

Class('BryntumCoreTest', {
  isa: Siesta.Test.Browser,
  has: {
    waitForScrolling: true,
    applyTestConfigs: true,
    waitForPollInterval: 20
  },
  override: {
    setup: function setup(callback, errorCallback) {
      var me = this,
          isTeamCity = location.search.includes('IS_TEAMCITY'),
          harness = me.harness,
          global = me.global,
          testConfig = me.getConfig(),
          b = global.bryntum,
          ns = b && (b.core || b.grid || b.scheduler || b.schedulerpro || b.gantt || b.calendar); // running with bundle, but tests are written for import. need to publish all classes to global

      if (ns) {
        // If there's no UI, disable creation of debugging data by Base constructor
        if (!window.Ext) {
          global.bryntum.DISABLE_DEBUG = true;
        }

        for (var className in ns) {
          if (!global[className]) global[className] = ns[className];
        }
      }

      me.setupConsoleHook(global); // Allow tests to modify configuration of class instances

      global.__applyTestConfigs = 'applyTestConfigs' in testConfig ? testConfig.applyTestConfigs : me.applyTestConfigs; // Don't use video recording for IE11 tests

      if (isTeamCity && harness.isRerunningFailedTests && !this.bowser.msie) {
        me.startVideoRecording(callback);
      } else {
        me.SUPER(callback, errorCallback);
      }

      if (global !== null && global !== void 0 && global.DOMRect) {
        Object.defineProperty(global.DOMRect.prototype, 'x', {
          get: function get() {
            return me.fail('x property accessed from a DOMRect');
          }
        });
        Object.defineProperty(global.DOMRect.prototype, 'y', {
          get: function get() {
            return me.fail('y property accessed from a DOMRect');
          }
        });
      }
    },
    it: function it(name, callback) {
      if (name.startsWith('TOUCH:') && (!window.Touch || !window.TouchEvent)) {
        arguments[1] = function (t) {
          t.diag('Test skipped for non-touch browsers');
        };
      }

      return this.SUPERARG(arguments);
    },
    launchSpecs: function launchSpecs() {
      var me = this,
          beforeEach = me.beforeEachHooks[0]; // If beforeEach inside the test doesn't create new instances, let's wait for any timeouts to complete before starting new t.it

      if (!beforeEach || !beforeEach.code.toString().match('new ')) {
        me.beforeEach(function (t, callback) {
          return me.verifyNoTimeoutsBeforeSubTest(t, callback);
        });
      }

      return me.SUPERARG(arguments);
    },
    earlySetup: function earlySetup(callback, errorCallback) {
      var me = this,
          testConfig = me.getConfig(),
          earlySetup = testConfig.earlySetup; // if we have a URL to load early before the test gets started

      if (earlySetup) {
        var SUPER = me.SUPER,
            args = arguments; // request earlySetup.url before running the test

        fetch(earlySetup.url).then(function (response) {
          earlySetup.callback(response, testConfig, me, function () {
            return SUPER.apply(me, args);
          });
        }).catch(function () {
          return errorCallback("Requesting ".concat(earlySetup.url, " failed"));
        });
      } else {
        me.SUPER(callback, errorCallback);
      }
    },
    onTearDown: function onTearDown(fn) {
      this._tearDownHook = fn;
    },
    tearDown: function tearDown(callback, errorCallback) {
      var _me$rootCause;

      var me = this,
          testConfig = me.getConfig(),
          tearDown = testConfig.tearDown,
          SUPER = me.SUPER,
          args = arguments;

      if (me.isFailed() && ((_me$rootCause = me.rootCause) === null || _me$rootCause === void 0 ? void 0 : _me$rootCause.nbrFramesRecorded) > 3) {
        var _failedAssertions$, _failedAssertions$2;

        var failedAssertions = me.getFailedAssertions(),
            failMsg = ((_failedAssertions$ = failedAssertions[0]) === null || _failedAssertions$ === void 0 ? void 0 : _failedAssertions$.description) || ((_failedAssertions$2 = failedAssertions[0]) === null || _failedAssertions$2 === void 0 ? void 0 : _failedAssertions$2.annotation),
            err = new Error(me.name + ' - ' + (failMsg || ''));
        me.rootCause.finalizeSiestaTestCallback = callback;
        me.rootCause.logException(err);
      } else if (me._tearDownHook) {
        me._tearDownHook(function () {
          return SUPER.apply(me, args);
        });
      } // if we have a URL to load after the test finishes
      else if (tearDown) {
          // request tearDown.url after the test completion
          fetch(tearDown.url).then(function (response) {
            tearDown.callback(response, testConfig, me, function () {
              return SUPER.apply(me, args);
            });
          }).catch(function () {
            return errorCallback("Requesting ".concat(tearDown.url, " failed"));
          });
        } else {
          me.SUPERARG(args);
        }
    },
    // Ensure we don't start next t.it if there are active timeouts
    verifyNoTimeoutsBeforeSubTest: function verifyNoTimeoutsBeforeSubTest(test, callback) {
      var me = this;

      if (!me.getConfig().disableNoTimeoutsCheck) {
        var _me$global;

        var pollCount = 0;

        var bryntum = (_me$global = me.global) === null || _me$global === void 0 ? void 0 : _me$global.bryntum,
            poll = function poll() {
          if (!bryntum || !bryntum.globalDelays || bryntum.globalDelays.isEmpty()) {
            callback();
          } else {
            var _me$global2;

            (_me$global2 = me.global) === null || _me$global2 === void 0 ? void 0 : _me$global2.setTimeout(poll, pollCount ? 50 : 0);
            pollCount++;
          }
        };

        poll();
      } else {
        callback();
      }
    } // Do not remove, handy for finding "leaking" timers
    // launchSubTest(subTest, callback) {
    //     if (this.global.bryntum? && this.global.bryntum.globalDelays && !this.global.bryntum.globalDelays.isEmpty()) {
    //         debugger;
    //         this.fail('Active timeouts found');
    //     }
    //     this.SUPERARG(arguments);
    // }

  },
  methods: {
    initialize: function initialize() {
      this.SUPERARG(arguments);
      this.on('beforetestfinalizeearly', this.performPostTestSanityChecks);
    },
    // Fail tests in automation containing iit()
    iit: function iit(description) {
      if (this.project.isAutomated && location.host !== 'lh') {
        this.fail('No iit allowed in automation mode - t.iit: ' + description);
      }

      return this.SUPERARG(arguments);
    },
    performPostTestSanityChecks: function performPostTestSanityChecks(evt, t) {
      if (!this.parent && !this.url.match(/docs\//)) {
        this.assertNoDomGarbage(t);
        this.assertNoResizeMonitors();
      }
    },
    delayedTouchDragBy: function delayedTouchDragBy(target, delta) {
      var _this = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _this.touchStart(target);

              case 2:
                _context.next = 4;
                return _this.waitForTouchTimeoutToExpire();

              case 4:
                _context.next = 6;
                return _this.movePointerBy(delta);

              case 6:
                _this.touchEnd(); // sync event


              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    },
    delayedTouchDragTo: function delayedTouchDragTo(source, target) {
      var _this2 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _this2.touchStart(source);

              case 2:
                _context2.next = 4;
                return _this2.waitForTouchTimeoutToExpire();

              case 4:
                _context2.next = 6;
                return _this2.movePointerTo(target);

              case 6:
                _this2.touchEnd();

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }))();
    },
    waitForTouchTimeoutToExpire: function waitForTouchTimeoutToExpire() {
      var _this3 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var delays;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                delays = _this3.global.bryntum.globalDelays;
                return _context3.abrupt("return", _this3.waitFor(function () {
                  var foundTimeout;
                  delays.timeouts.forEach(function (o) {
                    if (o.name === 'touchStartDelay') {
                      foundTimeout = true;
                    }
                  });
                  return !foundTimeout;
                }));

              case 2:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }))();
    },
    isOnline: function isOnline() {
      return /^(www\.)?bryntum\.com/.test(window.location.host);
    },
    isApproximatelyEqual: function isApproximatelyEqual(value1, value2, threshold) {
      if (arguments.length === 2) {
        threshold = 0;
      }

      return Math.abs(value2 - value1) <= threshold;
    },
    addListenerToObservable: function addListenerToObservable(observable, event, listener) {
      if ('on' in observable) {
        observable.on(event, listener);
      } else if ('addEventListener' in observable) {
        observable.addEventListener(event, listener);
      }
    },
    removeListenerFromObservable: function removeListenerFromObservable(observable, event, listener) {
      // Observable might be destroyed way before test is finalized. In that case it won't have `un` method
      // t.firesOnce(popup, 'beforehide');
      // t.firesOnce(popup, 'hide');
      // popup.destroy();
      if (observable !== null && observable !== void 0 && observable.un) {
        observable.un(event, listener);
      }
    },
    getTimeZone: function getTimeZone() {
      var Date = this.global.Date,
          date = new Date();
      return date.toLocaleString().replace(/.*(GMT.*)/, '$1');
    },
    getDSTDates: function getDSTDates() {
      var year = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2012;
      var Date = this.global.Date,
          yearStart = new Date(year, 0, 1),
          yearEnd = new Date(year, 11, 31),
          dstDates = [];

      for (var i = yearStart; i <= yearEnd; i = new Date(i.setDate(i.getDate() + 1))) {
        var midnightOffset = new Date(year, i.getMonth(), i.getDate()).getTimezoneOffset(),
            noonOffset = new Date(year, i.getMonth(), i.getDate(), 12).getTimezoneOffset();
        if (midnightOffset !== noonOffset) dstDates.push(i);
      }

      return dstDates;
    },
    assertNoDomGarbage: function assertNoDomGarbage(t) {
      var me = this,
          body = me.global.document.body,
          invalid = ['[id*="undefined"]', '[id*="null"]', '[class*="undefined"]', '[class*="null"]']; // Data URL can violate the check for NaN in some cases
      // Array.from() used for IE11 compatibility
      //Array.from(body.querySelectorAll('.b-sch-background-canvas')).forEach(e => e.remove());

      if (body.innerHTML.match(/NaN|id=""/)) {
        me.contentNotLike(body, 'NaN', 'No "NaN" string found in DOM');
        me.contentNotLike(body, ' id=""', 'No empty id found in DOM'); //me.contentNotLike(body, /L{.*?}/, 'No non-localized string templates L{xx}');
      } // If no floating Widgets have been shown, there will not be a floatRoot.
      // But if there have, there must only be one floatRoot.


      if (document.querySelectorAll('.b-float-root').length > 1) {
        me.fail('Only one .b-float-root element must be present');
      }

      if (!t.skipSanityChecks) {
        // Remove embedded JS code blocks like `href="data:text/javascript;..."` or `<code>...</code>` from checking
        var outerHTML = body.outerHTML.replace(/href="data:text\/javascript[\s\S]*?"/gm, '').replace(/<code[\s\S]*?<\/code>/gm, '');

        if (outerHTML.match(/object object|undefined/i)) {
          me.fail('No "Object object" or undefined string found in DOM');
          me.fail('Monkey steps:' + JSON.stringify(me.global.monkeyActions));
        }
      }

      if (me.$(invalid.join(','), body).length) {
        me.selectorNotExists(invalid, 'No DOM attribute garbage found in DOM');

        if (me.global.monkeyActions && body.querySelector(invalid)) {
          me.fail('Monkey steps:' + JSON.stringify(me.global.monkeyActions));
        }
      }
    },
    assertNoResizeMonitors: function assertNoResizeMonitors() {
      var _this4 = this;

      Array.from(document.querySelectorAll('*')).forEach(function (e) {
        var _e$_bResizemonitor;

        if ((_e$_bResizemonitor = e._bResizemonitor) !== null && _e$_bResizemonitor !== void 0 && _e$_bResizemonitor.handlers.length) {
          _this4.fail("".concat(e.tagName, "#e.id has ").concat(e._bResizemonitor.handlers.length, " resize monitors attached"));
        }
      });
    },
    // Never start an action is animations or scrolling is ongoing
    waitForAnimations: function waitForAnimations() {
      var _arguments = arguments,
          _this5 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var callback;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                callback = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : function () {};
                return _context4.abrupt("return", _this5.waitForSelectorNotFound(".b-animating,.b-aborting".concat(_this5.waitForScrolling ? ',.b-scrolling' : ''), callback));

              case 2:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }))();
    },
    waitForAnimationFrame: function waitForAnimationFrame(next) {
      var _this6 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        var frameFired;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                frameFired = false;
                requestAnimationFrame(function () {
                  return frameFired = true;
                });
                return _context5.abrupt("return", _this6.waitFor(function () {
                  return frameFired;
                }, next));

              case 3:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }))();
    },
    waitForScroll: function waitForScroll(next) {
      var _this7 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt("return", new _this7.global.Promise(function (resolve) {
                  var me = _this7,
                      as = me.beginAsync(),
                      global = me.global,
                      onFinished = function onFinished() {
                    me.endAsync(as);
                    global.removeEventListener('scroll', onScroll, true);
                    next === null || next === void 0 ? void 0 : next();
                    resolve();
                  };

                  var timer = global.setTimeout(onFinished, 500);

                  var onScroll = function onScroll() {
                    global.clearTimeout(timer);
                    timer = global.setTimeout(onFinished, 200);
                  };

                  global.addEventListener('scroll', onScroll, true);
                }));

              case 1:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }))();
    },
    waitForScrollEnd: function waitForScrollEnd(target, next) {
      var _this8 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                target = _this8.normalizeElement(target);
                return _context7.abrupt("return", new _this8.global.Promise(function (resolve) {
                  var timer;

                  var onScroll = function onScroll() {
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                      target.removeEventListener('scroll', onScroll);
                      next === null || next === void 0 ? void 0 : next();
                      resolve();
                    }, 100);
                  };

                  target.addEventListener('scroll', onScroll, {
                    passive: true
                  });
                }));

              case 2:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }))();
    },
    waitForAllImagesLoaded: function waitForAllImagesLoaded(next) {
      var _this9 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
        var images;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                images = Array.from(_this9.global.document.querySelectorAll('img[src]'));
                _context8.next = 3;
                return _this9.waitFor(function () {
                  return !images.some(function (img) {
                    return !img.complete;
                  });
                }, next);

              case 3:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }))();
    },
    // Allows `await t.animationFrame`
    animationFrame: function animationFrame() {
      var _arguments2 = arguments,
          _this10 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
        var frames, count, resolveFn, global, frame;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                frames = _arguments2.length > 0 && _arguments2[0] !== undefined ? _arguments2[0] : 1;
                count = 0;
                global = _this10.global, frame = function frame() {
                  if (count++ < frames) {
                    global.requestAnimationFrame(function () {
                      return frame();
                    });
                  } else {
                    resolveFn();
                  }
                };
                return _context9.abrupt("return", new Promise(function (resolve) {
                  resolveFn = resolve;
                  frame();
                }));

              case 4:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }))();
    },

    /**
     * Registers the passed URL to return the passed mocked up Fetch Response object to the
     * AjaxHelper's promise resolve function.
     * @param {String} url The url to return mock data for
     * @param {Object|Function} response A mocked up Fetch Response object which must contain
     * at least a `responseText` property, or a function to which the `url` and a `params` object
     * is passed which returns that.
     * @param {String} response.responseText The data to return.
     * @param {Boolean} [response.synchronous] resolve the Promise immediately
     * @param {Number} [response.delay=100] resolve the Promise after this number of milliseconds.
     */
    mockUrl: function mockUrl(url, response) {
      var me = this,
          AjaxHelper = me.global.AjaxHelper;

      if (!AjaxHelper) {
        throw new Error('AjaxHelper must be injected into the global namespace');
      }

      (me.mockAjaxMap || (me.mockAjaxMap = {}))[url] = response; // Inject the override into the AjaxHelper instance

      if (!AjaxHelper.originalFetch) {
        // cannot use Reflect in IE11
        //Reflect.set(AjaxHelper, 'originalFetch', AjaxHelper.fetch);
        //Reflect.set(AjaxHelper, 'fetch', Test.mockAjaxFetch.bind(Test));
        AjaxHelper.originalFetch = AjaxHelper.fetch;
      }

      AjaxHelper.fetch = me.mockAjaxFetch.bind(me);
    },
    mockAjaxFetch: function mockAjaxFetch(url, options) {
      var urlAndParams = url.split('?'),
          win = this.global;
      var result = this.mockAjaxMap[urlAndParams[0]],
          parsedJson = null;

      if (result) {
        if (typeof result === 'function') {
          result = result(urlAndParams[0], parseParams(urlAndParams[1]), options);
        }

        try {
          parsedJson = options.parseJson && JSON.parse(result.responseText);
        } catch (error) {
          parsedJson = null;
          result.error = error;
        }

        result = win.Object.assign({
          status: 200,
          ok: true,
          headers: new win.Headers(),
          statusText: 'OK',
          url: url,
          parsedJson: parsedJson,
          text: function text() {
            return new Promise(function (resolve) {
              resolve(result.responseText);
            });
          },
          json: function json() {
            return new Promise(function (resolve) {
              resolve(parsedJson);
            });
          }
        }, result);
        return new win.Promise(function (resolve, reject) {
          if (result.synchronous) {
            result.rejectPromise ? reject('Promise rejected!') : resolve(result);
          } else {
            win.setTimeout(function () {
              result.rejectPromise ? reject('Promise rejected!') : resolve(result);
            }, 'delay' in result ? result.delay : 100);
          }
        });
      } else {
        return win.AjaxHelper.originalFetch(url, options);
      }
    },

    /**
     * Unregisters the passed URL from the mocked URL map
     */
    unmockUrl: function unmockUrl(url) {
      if (this.mockAjaxMap) {
        delete this.mockAjaxMap[url];
      }
    },
    isDeeplyUnordered: function isDeeplyUnordered(array, toMatch, desc) {
      var failDesc = 'isDeeplyUnordered check failed: ' + desc,
          passDesc = 'isDeeplyUnordered check passed: ' + desc;

      if (!this.global.Array.isArray(array) || !this.global.Array.isArray(toMatch)) {
        return this.isDeeply.apply(this, arguments);
      }

      if (array.length !== toMatch.length) {
        this.fail(failDesc);
        return;
      }

      var joined = array.concat(toMatch),
          set = new this.global.Set(joined);

      if (set.size !== array.length) {
        this.fail(failDesc);
        return;
      }

      this.pass(passDesc);
    },
    isRectApproxEqual: function isRectApproxEqual(rect1, rect2, threshold, description) {
      for (var param in rect1) {
        this.isApprox(rect1[param], rect2[param], threshold, description || '');
      }
    },
    // t.isCssTextEqual(element, 'position: absolute; color: blue;')
    isCssTextEqual: function isCssTextEqual(src, cssText, desc) {
      if (src instanceof this.global.HTMLElement) {
        src = src.style.cssText;
      }

      if (src === cssText) {
        this.pass(desc || 'Style matches');
      } else {
        var srcParts = src.split(';').map(function (p) {
          return p.trim();
        }),
            targetParts = cssText.split(';').map(function (p) {
          return p.trim();
        });
        srcParts.sort();
        targetParts.sort();
        this.isDeeply(srcParts, targetParts);
      }
    },
    startVideoRecording: function startVideoRecording(callback) {
      var me = this,
          document = me.global.document,
          script = document.createElement('script'),
          startRootCause = function startRootCause() {
        var _me$rootCause$socket;

        me.on('testupdate', me.onTestUpdate, me);
        me.rootCause = new me.global.RC.Logger({
          nbrFramesRecorded: 0,
          captureScreenshot: false,
          applicationId: '2709a8dbc83ccd7c7dd07f79b92b5f3a90182f93',
          maxNbrLogs: 1,
          recordSessionVideo: true,
          videoBaseUrl: me.global.location.href.replace(me.global.location.host, 'qa.bryntum.com'),
          logToConsole: function logToConsole() {},
          // Ignore fails in non-DOM tests which should never be flaky, and video won't help
          processVideoFrameFn: function processVideoFrameFn(frame) {
            // enum VideoRecordingMessage {
            //     setBaseUrl,
            //     applyDomSnapshot,
            //     applyPointerPosition,
            //     applyPointerState,
            //     applyElementValueChange,
            //     applyElementCheckedChange,
            //     applyWindowResize,
            //     applyDomScroll,
            //     applyDomMutation
            // }
            // Ignore initial video snapshot frames
            if ((frame === null || frame === void 0 ? void 0 : frame[0]) > 1) {
              this.nbrFramesRecorded++;
            }
          },
          onErrorLogged: function onErrorLogged(responseText) {
            var _data, _this$finalizeSiestaT;

            var data;

            try {
              data = JSON.parse(responseText);
            } catch (e) {}

            if ((_data = data) !== null && _data !== void 0 && _data.id) {
              me.fail("[video=".concat(data.id, "]"));
            }

            (_this$finalizeSiestaT = this.finalizeSiestaTestCallback) === null || _this$finalizeSiestaT === void 0 ? void 0 : _this$finalizeSiestaT.call(this);
          },
          onErrorLogFailed: function onErrorLogFailed() {
            var _this$finalizeSiestaT2;

            (_this$finalizeSiestaT2 = this.finalizeSiestaTestCallback) === null || _this$finalizeSiestaT2 === void 0 ? void 0 : _this$finalizeSiestaT2.call(this);
          }
        });

        if (((_me$rootCause$socket = me.rootCause.socket) === null || _me$rootCause$socket === void 0 ? void 0 : _me$rootCause$socket.readyState) === WebSocket.OPEN) {
          callback.call(me);
        } else {
          me.rootCause.socket.addEventListener('open', callback.bind(me));
        }
      };

      script.crossOrigin = 'anonymous';
      script.src = 'https://app.therootcause.io/rootcause-full.js';
      script.addEventListener('load', startRootCause);
      script.addEventListener('error', callback);
      document.head.appendChild(script);
    },
    onTestUpdate: function onTestUpdate(event, test, result) {
      if (typeof result.passed === 'boolean') {
        var _this$rootCause;

        (_this$rootCause = this.rootCause) === null || _this$rootCause === void 0 ? void 0 : _this$rootCause.addLogEntry({
          type: result.passed ? 'pass' : 'fail',
          glyph: result.passed ? 'check' : 'times',
          message: (result.description || '') + (result.annotation ? result.annotation + ' \nresult.annotation' : '')
        });
      }
    },
    handlerThrowsOk: function handlerThrowsOk(fn) {
      var success = false,
          doneCalled = false;

      var me = this,
          oldOnError = me.global.onerror,
          done = function done() {
        if (!doneCalled) {
          doneCalled = true;
          me.global.onerror = oldOnError;

          if (success) {
            me.pass('Expected error was thrown');
          } else {
            me.fail('Expected error was not thrown');
          }

          me.endAsync(async);
        }
      };

      me.global.onerror = function () {
        success = true;
        done();
        return true;
      };

      var async = me.beginAsync(); // We must return the destroy method first in case the
      // passed method is not in fact async.

      setTimeout(fn, 0);
      return done;
    },
    removeIframe: function removeIframe(iframeId) {
      var t = this,
          _document = t.global.document,
          iframe = _document.getElementById(iframeId);

      if (iframe) {
        iframe.parentElement.removeChild(iframe);
      } else {
        t.fail('Cannot find iframe with id ' + iframeId);
      }
    },
    setIframeUrl: function setIframeUrl(iframe, url, callback) {
      var _this11 = this;

      var async = this.beginAsync(),
          doc = iframe.contentDocument;

      iframe.onload = function () {
        _this11.endAsync(async);

        iframe.onload = undefined;
        callback();
      };

      if (url && doc.location !== url) {
        doc.location = url;
      } else {
        doc.location.reload();
      }
    },
    setIframeAsync: function setIframeAsync(config) {
      var _this12 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                return _context10.abrupt("return", new _this12.global.Promise(function (resolve) {
                  _this12.setIframe(_this12.global.Object.assign(config, {
                    onload: function onload(document, iframe) {
                      resolve({
                        document: document,
                        iframe: iframe
                      });
                    }
                  }));
                }));

              case 1:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10);
      }))();
    },
    setIframe: function setIframe(config) {
      config = config || {};

      var t = this,
          id = config.iframeId || config.id,
          _config = config,
          onload = _config.onload,
          html = _config.html,
          _config$height = _config.height,
          height = _config$height === void 0 ? 1600 : _config$height,
          _config$width = _config.width,
          width = _config$width === void 0 ? 900 : _config$width,
          _document = t.global.document,
          iframe = _document.body.appendChild(_document.createElement('iframe'));

      var async = config.async;
      iframe.width = width;
      iframe.height = height;

      if (id) {
        iframe.setAttribute('id', id);
      }

      var doc = iframe.contentWindow.document;

      if (onload) {
        async = async || t.beginAsync();

        iframe.onload = function () {
          t.endAsync(async);
          onload(doc, iframe);
        };
      }

      if (html) {
        doc.open();
        doc.write(html);
        doc.close();
      }

      return iframe;
    },
    scrollIntoView: function scrollIntoView(selector, callback) {
      this.global.document.querySelector(selector).scrollIntoView();
      callback === null || callback === void 0 ? void 0 : callback();
    },
    getSVGBox: function getSVGBox(svgElement) {
      var svgBox = svgElement.getBBox(),
          containerBox = svgElement.viewportElement.getBoundingClientRect();
      return {
        left: svgBox.x + containerBox.left,
        right: svgBox.x + containerBox.left + svgBox.width,
        top: svgBox.y + containerBox.top,
        bottom: svgBox.y + containerBox.top + svgBox.height
      };
    },
    getPx: function getPx(value) {
      // Return pixel value according to window.devicePixelRatio for HiDPI display measurements
      return value * (window.devicePixelRatio || 1);
    },
    samePx: function samePx(value, compareWith) {
      var threshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      return Math.abs(value - compareWith) <= this.getPx(threshold);
    },
    sameRect: function sameRect(rect1, rect2) {
      var threshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      return this.samePx(rect1.top, rect2.top, threshold) && this.samePx(rect1.left, rect2.left, threshold) && this.samePx(rect1.width, rect2.width, threshold) && this.samePx(rect1.height, rect2.height, threshold);
    },
    isApproxPx: function isApproxPx(value, compareWith) {
      var threshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var desc = arguments.length > 3 ? arguments[3] : undefined;

      if (typeof threshold === 'string') {
        desc = threshold;
        threshold = 1;
      } // Extend isApprox to use window.devicePixelRatio for HiDPI display measurements


      this.isApprox(value, compareWith, threshold * (window.devicePixelRatio || 1), desc);
    },
    isApproxRect: function isApproxRect(rect1, rect2) {
      var threshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var desc = arguments.length > 3 ? arguments[3] : undefined;

      if (typeof threshold === 'string') {
        desc = threshold;
        threshold = 1;
      }

      desc = desc ? "".concat(desc, " ") : '';
      this.isApproxPx(rect1.top, rect2.top, threshold, "".concat(desc, "Correct rectangle top"));
      this.isApproxPx(rect1.left, rect2.left, threshold, "".concat(desc, "Correct rectangle left"));
      this.isApproxPx(rect1.width, rect2.width, threshold, "".concat(desc, "Correct rectangle width"));
      this.isApproxPx(rect1.height, rect2.height, threshold, "".concat(desc, " Correct rectangle height"));
    },

    /**
     * Asserts element height
     * @param {String} selector CSS selector to identify an element
     * @param {Number} height Expected height in px
     * @param {String} [desc] Assertion description
     */
    hasHeight: function hasHeight(selector, height, desc) {
      this.is(this.rect(selector).height, height, desc || 'Correct height for ' + selector);
    },
    DOMtoObject: function DOMtoObject(element) {
      if (element instanceof this.global.HTMLElement) {
        var result = {
          children: []
        },
            attributes = element.attributes,
            children = element.children;

        for (var i = 0, l = attributes.length; i < l; i++) {
          var attr = attributes[i];
          result[attr.name] = attr.value;
        }

        for (var _i2 = 0, _l = children.length; _i2 < _l; _i2++) {
          result.children.push(this.DOMtoObject(children[_i2]));
        }

        return result;
      }
    },
    elementToObject: function elementToObject(element) {
      if (element instanceof this.global.HTMLElement) {
        var result = {
          children: []
        },
            attributes = element.attributes,
            children = element.children;

        for (var i = 0, l = attributes.length; i < l; i++) {
          var attr = attributes[i];

          if (typeof attr.value === 'string') {
            if (attr.value.length > 0) {
              result[attr.name] = attr.value;
            }
          } else {
            result[attr.name] = attr.value;
          }
        }

        for (var _i3 = 0, _l2 = children.length; _i3 < _l2; _i3++) {
          result.children.push(this.elementToObject(children[_i3]));
        }

        return result;
      }
    },
    smartMonkeys: function smartMonkeys(description) {
      var buttons = this.global.document.querySelectorAll('.demo-header .b-button:not(disabled):not(#fullscreen-button):not([data-ref=fileButton]):not(#docs-button)');

      if (buttons.length > 0) {
        // Array.from() used for IE11 compatibility. Extra fullscreen check for framework buttons
        Array.from(buttons).forEach(function (button) {
          return !button.disabled && !button.querySelector('.b-icon-fullscreen') && button.click();
        });
        this.pass(description || 'Smart monkeys clicking around did not produce errors');
      }
    },
    query: function query(selector, root) {
      var me = this;
      selector = selector.trim(); // Handle potential nested iframes

      root = root || me.getNestedRoot(selector);
      selector = selector.split('->').pop().trim();

      if (selector.match(/=>/)) {
        var bryntum = me.getGlobal(root).bryntum,
            parts = selector.split('=>'),
            cssSelector = parts.pop().trim(),
            bryntumSelector = parts[0].trim(),
            widgets = bryntum.queryAll(bryntumSelector);
        return widgets.map(function (widget) {
          return me.query(cssSelector, widget.element)[0];
        }).filter(function (result) {
          return Boolean(result);
        });
      } else if (selector.match(/\s*>>/)) {
        var _bryntum = me.getGlobal(root).bryntum;
        return _bryntum.queryAll(selector.substr(2)).map(function (widget) {
          return widget.element;
        });
      }

      return me.SUPERARG([selector, root]);
    },
    setRandomPHPSession: function setRandomPHPSession() {
      // Sets random cookie session ID per test
      var rndStr = Math.random().toString(16).substring(2),
          cookie = "".concat(this.url, " ").concat(rndStr).replace(/[ .\\/&?=]/gm, '-').toLowerCase();
      this.diag("PHPSESSID: ".concat(cookie));
      this.global.document.cookie = "PHPSESSID=".concat(cookie);
    },
    rect: function rect(selectorOrEl) {
      return this.normalizeElement(selectorOrEl).getBoundingClientRect();
    },

    /**
     * Returns test configuration
     */
    getConfig: function getConfig() {
      return this.harness.getScriptDescriptor(this.url);
    },

    /**
     * Searches over all parents in test configuration to get param value
     */
    getConfigParam: function getConfigParam(param) {
      return this.harness.getDescriptorConfig(this.getConfig(), param);
    },

    /**
     * Returns test mode 'es6', 'umd', 'module'
     */
    getMode: function getMode() {
      return this.getConfigParam('mode');
    },

    /**
     * Enables intercepting console errors.
     */
    setupConsoleHook: function setupConsoleHook(parent) {
      var me = this; // No need to install hooks twice

      if (!me._consoleHooks) {
        var parentWindow = parent || me.global,
            usesConsole = me.getConfigParam('usesConsole'),
            consoleFailLevels = usesConsole ? [] : me.getConfigParam('consoleFail') || ['error', 'warn', 'log', 'info'],
            allowedConsoleMessageRe = me.getConfigParam('allowedConsoleMessageRe');
        me.diag("Console fails: [".concat(consoleFailLevels.join(', '), "]")); // Allow console message filtering by level

        consoleFailLevels.forEach(function (level) {
          parentWindow.console[level] = function () {
            var _console;

            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            var msg = args[0],
                isAllowed = allowedConsoleMessageRe === null || allowedConsoleMessageRe === void 0 ? void 0 : allowedConsoleMessageRe.test(args[0]),
                isTrialNote = BryntumTestHelper.isTrial && /Bryntum .* Trial Version/.test(msg);

            if (!isAllowed && !isTrialNote) {
              me.fail(["Console ".concat(level, ": ")].concat(args).join(''));
            }

            (_console = console)[level].apply(_console, args);
          };

          parentWindow.console[level].direct = function () {
            var _console2;

            return (_console2 = console)[level].apply(_console2, arguments);
          };
        });
        me._consoleHooks = true;
      }
    },
    // region docs
    findMemberInClass: function findMemberInClass(clsRecord, propertyType, memberName, isStatic) {
      var store = clsRecord.stores[0];
      var found = (clsRecord.data[propertyType] || []).find(function (mem) {
        return mem.name === memberName && mem.scope === 'static' === isStatic;
      });

      if (!found && clsRecord.data.extends) {
        var superClass = store.getById(clsRecord.data.extends[0]);
        found = this.findMemberInClass(superClass, propertyType, memberName, isStatic);
      } // search in mixed in members


      if (!found && clsRecord.data.mixes) {
        var mixins = clsRecord.data.mixes.slice();
        var mixin;

        while (!found && (mixin = mixins.shift())) {
          var mixinCls = store.getById(mixin);
          found = this.findMemberInClass(mixinCls, propertyType, memberName, isStatic);
        }
      }

      return found;
    },
    assertDocsLinks: function assertDocsLinks(classRecord) {
      var me = this,
          linkTag = /{@link/i,
          contentElement = me.global.document.getElementById('content');
      me.selectorNotExists('.path-not-found', 'Resource missing');
      me.contentNotLike(contentElement, '<div class="description">undefined</div>', 'No undefined descriptions'); // Guides don't have a predictable title

      if (!classRecord.isGuide) {
        me.contentLike(contentElement.querySelector('h1'), classRecord.readableName, 'Document has the correct name');
      }

      me.contentNotLike(contentElement, linkTag, 'No "{@link" string found in content'); // verify all configs, properties, functions etc are rendered properly

      me.assertClassMembers(classRecord); // verify all internal links are correct, in the left pane + inheritance / mixin lists

      me.assertInternalDocsLinks(classRecord, contentElement); // verify all links to global symbols (Date, HTMLElement etc) are OK

      me.assertExternalDocsLinks();
    },
    assertClassMembers: function assertClassMembers(classRecord) {
      var _data$extends;

      var me = this,
          contentElement = me.global.document.getElementById('content'),
          treeStore = classRecord.stores[0],
          data = treeStore.getById(classRecord.id).data,
          _data$configs = data.configs,
          configs = _data$configs === void 0 ? [] : _data$configs,
          _data$functions = data.functions,
          functions = _data$functions === void 0 ? [] : _data$functions,
          _data$properties = data.properties,
          properties = _data$properties === void 0 ? [] : _data$properties,
          _data$events = data.events,
          events = _data$events === void 0 ? [] : _data$events;
      configs.forEach(function (config) {
        var types = config.type; // only verify public configs

        if (!config.access) {
          if ((types === null || types === void 0 ? void 0 : types.length) > 0) {
            var defaultValue = config.defaultValue,
                defaultValueType = _typeof(defaultValue); // Skip checking configs with just one complex type since we cannot verify it


            if (types.length === 1 && types[0].includes('.')) {
              return;
            } // Skip checking lazy config values for now, JsDoc garbles them


            if (defaultValueType === 'string' && defaultValue.startsWith('{"$config')) {
              return;
            } // Some default values are stringified objects


            if (defaultValueType === 'string') {
              if (defaultValue[0] === '{') {
                defaultValueType = 'object';
              } else if (defaultValue[0] === '[' && types.find(function (type) {
                return type.endsWith('[]');
              })) {
                // For array default values, just pick first value as a smoke check
                defaultValue = JSON.parse(defaultValue);

                if (defaultValue.length > 0) {
                  defaultValue = defaultValue[0];
                  defaultValueType = _typeof(defaultValue);
                }
              } else if (types[0] === 'Number' && !isNaN(Number(defaultValue))) {
                defaultValueType = 'number';
              }
            } // If there's a default value, match it with config type


            if (defaultValue != null && !types.map(function (type) {
              return type.toLowerCase().replace(/\[]/, '');
            }).includes(defaultValueType)) {
              var found; // Sometimes default value is a snippet of code

              try {
                var evalResult = defaultValueType === 'string' && me.global.eval(defaultValue);
                found = types.find(function (type) {
                  try {
                    var _constructor = me.global.eval(type);

                    return evalResult instanceof _constructor;
                  } catch (e) {}
                });
              } catch (e) {}

              if (!found) {
                me.fail("Config ".concat(classRecord.name, "#").concat(config.name, " has default value ").concat(defaultValue, " [").concat(defaultValueType, "]. Documented types: ").concat(types.join('|')));
              }
            }
          } else {
            me.fail("Config ".concat(classRecord.name, "#").concat(config.name, " is missing type"));
          }
        }
      });

      if ((_data$extends = data.extends) !== null && _data$extends !== void 0 && _data$extends.length) {
        me.isGreater(contentElement.querySelectorAll('.class-hierarchy li').length, 1, 'Class + superclass rendered');
      }

      var _iterator = _createForOfIteratorHelper(functions),
          _step;

      try {
        var _loop = function _loop() {
          var func = _step.value;
          var fId = func.scope === 'static' ? func.name + '-static' : func.name;

          if (func.parameters) {
            if (!classRecord.access && !func.access || func.access === 'static') {
              func.parameters.forEach(function (param) {
                if (param.type.length === 0) {
                  me.fail("Function ".concat(classRecord.name, "#").concat(fId, " param ").concat(param.name, " missing type"));
                }
              });
            }
          }

          if (contentElement.querySelectorAll('#function-' + fId + ' .function-body .parameter').length !== (func.parameters || []).length) {
            me.fail('#function-' + fId + ': wrong function params rendered');
          }
        };

        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      properties.forEach(function (p) {
        var _p$type;

        if ((!p.access || p.access === 'static') && !((_p$type = p.type) !== null && _p$type !== void 0 && _p$type[0])) {
          me.fail("Property ".concat(classRecord.name, "#").concat(p.name, " missing type"));
        }
      });

      var _iterator2 = _createForOfIteratorHelper(events),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var e = _step2.value;

          if (e.parameters && contentElement.querySelectorAll('#event-' + e.name + '.event .parameter').length !== e.parameters.length) {
            me.fail(e.name + ': wrong event params rendered');
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      me.selectorCountIs('.configs .config', contentElement, configs.length, 'Configs rendered');
      me.selectorCountIs('.properties .property', contentElement, properties.length, 'Properties rendered');
      me.selectorCountIs('.events .event', contentElement, events.length, 'Events rendered');
    },
    assertInternalDocsLinks: function assertInternalDocsLinks(classRecord, contentElement) {
      var me = this,
          treeStore = classRecord.stores[0],
          ignoreLinks = me.getConfig().ignoreLinks || [],
          ignoreClasses = me.getConfig().ignoreClasses || [],
          linkSelector = 'a[href^="#"]:not(.summary-icon):not(.inherited)',
          memberCategories = ['events', 'properties', 'configs', 'functions'],
          nodes = contentElement.querySelectorAll(".left-pane ".concat(linkSelector, ", .right-pane > :not(.class-contents-container) ").concat(linkSelector));
      Array.from(nodes).forEach(function (node) {
        var href = node.getAttribute('href').substring(1),
            className = href.split('#')[0],
            member = href.split('#')[1],
            linkedClassRecord = treeStore.getById(className);

        if (!linkedClassRecord && !ignoreClasses.includes(className)) {
          me.fail(classRecord.id + ': ' + className + ' not found');
        } else if (linkedClassRecord && !member && !classRecord.access && linkedClassRecord.access === 'private') {
          var isLinkedFromPublicMember = node.closest('.member:not(.private):not(.internal)');

          if (isLinkedFromPublicMember) {
            me.fail("Public class ".concat(classRecord.name, " links to private class ").concat(linkedClassRecord.name));
          }
        } else if (!(linkedClassRecord !== null && linkedClassRecord !== void 0 && linkedClassRecord.isGuide) && member && !ignoreLinks.includes(href)) {
          var parts = member.split('-'),
              name = parts[1],
              category = parts[0],
              isStatic = parts.length === 3,
              propertyName = category === 'property' ? 'properties' : category + 's';
          var found = false;

          if (parts.length > 1) {
            found = me.findMemberInClass(linkedClassRecord, propertyName, name, isStatic);
          }

          if (!found && !memberCategories.includes(category)) {
            me.fail(classRecord.id + ' - docs link not found: ' + href);
          } else if (classRecord.access !== 'private' && linkedClassRecord.access === 'private') {
            var _isLinkedFromPublicMember = node.closest('.member:not(.private):not(.internal)');

            if (_isLinkedFromPublicMember) {
              me.fail("".concat(classRecord.name, " links to private member ").concat(linkedClassRecord.name));
            }
          }
        }
      });
    },
    assertExternalDocsLinks: function assertExternalDocsLinks() {
      var _this13 = this;

      var contentElement = this.global.document.getElementById('content'),
          global = this.global,
          linkNodes = contentElement.querySelectorAll('a.type[target=_blank]'),
          ignoreSymbols = {
        TouchEvent: 1,
        null: 1,
        DragEvent: this.bowser.safari // DragEvent somehow missing in Safari

      };

      if (!this.global.freshWindow) {
        var _frame = document.createElement('iframe');

        this.global.document.body.appendChild(_frame);
        _frame.style.display = 'none';
        this.global.freshWindow = _frame.contentWindow;
      } // verify all links to global symbols are OK


      global.Array.from(linkNodes).forEach(function (node) {
        var symbolName = node.innerHTML.trim().replace('[]', '').replace('...', '');

        if (!ignoreSymbols[symbolName] && !(symbolName in _this13.global.freshWindow)) {
          _this13.fail(global.location.hash + ' - docs link not found: ' + symbolName);
        }
      });
    } // endregion docs

  }
});

var BryntumTestHelper = /*#__PURE__*/function () {
  function BryntumTestHelper() {
    _classCallCheck(this, BryntumTestHelper);
  }

  _createClass(BryntumTestHelper, null, [{
    key: "detectTrial",
    value: function detectTrial() {
      var result = true;
      /*  */

      return result;
    }
  }, {
    key: "expandUrl",
    value: function expandUrl(url, root) {
      // Append root to the string item if it doesn't start with it (to simplify configs)
      return url.startsWith(root) ? url : "".concat(root, "/").concat(url);
    }
  }, {
    key: "prepareFrameworkTests",
    value: function prepareFrameworkTests(items) {
      var _this14 = this;

      var examplesRoot = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '../examples/frameworks';
      var testsRoot = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'examples/frameworks';
      return items.map(function (item) {
        if (item.pageUrl != null && item.url != null) {
          return Object.assign({}, item, {
            pageUrl: _this14.expandUrl(item.pageUrl, examplesRoot),
            url: _this14.expandUrl(item.url, testsRoot),
            keepPageUrl: true
          });
        }
      });
    }
  }, {
    key: "prepareFrameworkMonkeyTests",
    value: function prepareFrameworkMonkeyTests(_ref) {
      var items = _ref.items,
          _ref$examplesRoot = _ref.examplesRoot,
          examplesRoot = _ref$examplesRoot === void 0 ? '../examples/frameworks' : _ref$examplesRoot,
          _ref$config = _ref.config,
          config = _ref$config === void 0 ? {} : _ref$config;
      return this.prepareMonkeyTests({
        items: items,
        examplesRoot: examplesRoot,
        config: config
      });
    }
  }, {
    key: "prepareMonkeyTests",
    value: function prepareMonkeyTests(_ref2) {
      var _this15 = this;

      var items = _ref2.items,
          mode = _ref2.mode,
          _ref2$examplesRoot = _ref2.examplesRoot,
          examplesRoot = _ref2$examplesRoot === void 0 ? '../examples' : _ref2$examplesRoot,
          _ref2$config = _ref2.config,
          config = _ref2$config === void 0 ? {} : _ref2$config;
      var urls = [];
      return items.filter(function (item) {
        return item;
      }).map(function (item) {
        // Skip monkeys for PR tests where we have example test (test setup has url)
        if (item.skipMonkey || BryntumTestHelper.isPR && item.url) {
          return;
        }

        var cfg = Object.assign({}, item instanceof Object ? item : {
          pageUrl: item
        }, config);

        if (cfg.pageUrl) {
          cfg.pageUrl = _this15.expandUrl(cfg.pageUrl, examplesRoot);

          if (!cfg.keepPageUrl && ['umd', 'module'].includes(mode)) {
            var parts = cfg.pageUrl.split('?');
            cfg.pageUrl = parts[0] + (parts[0].endsWith('/') ? '' : '/') + "index.".concat(mode, ".html?") + (parts[1] || '');
          } // Prepare url-friendly id


          var id = cfg.pageUrl.replace(/\.+\//g, '').replace(/[?&./]/g, '-').replace('--', '-');
          cfg.isMonkey = true;
          cfg.isPR = BryntumTestHelper.isPR;
          cfg.keepPageUrl = true;
          cfg.url = "examples/monkey.t.js?id=".concat(id, "&monkey&test"); // Avoid duplicates

          if (!urls.includes(cfg.url)) {
            urls.push(cfg.url);
            return cfg;
          }
        }
      });
    }
  }, {
    key: "updateTitle",
    value: function updateTitle(item, testUrl) {
      // Split testUrl to display in tree grid
      if (testUrl && typeof URL === 'function') {
        var url = new URL("http://bryntum.com/".concat(testUrl)),
            pathName = url.pathname,
            idx = pathName.lastIndexOf('/'),
            testName = pathName.substring(idx + 1),
            testPath = !item.isMonkey ? pathName.substring(1, idx) : item.pageUrl;
        item.title = "".concat(testName).concat(url.search, " ").concat(testPath !== '' ? "[ ".concat(testPath, " ]") : '');
      }
    }
  }, {
    key: "prepareItem",
    value: function prepareItem(item, mode) {
      // Update test url and pageUrl for mode
      if (mode !== 'es6') {
        if (item.url && !item.keepUrl) {
          item.url = item.url.replace('.t.js', ".t.".concat(mode, ".js"));
        }

        if (item.pageUrl && !item.keepPageUrl && !(mode === 'module' && BryntumTestHelper.isTrial)) {
          // keep querystring also for bundle (works with both url/?develop and url?develop)
          var qs = item.pageUrl.match(/(.*?)(\/*)([?#].*)/);

          if (qs) {
            item.pageUrl = "".concat(qs[1], "/index.").concat(mode, ".html").concat(qs[3]);
          } else {
            item.pageUrl += "/index.".concat(mode, ".html");
          }
        }
      }

      this.updateTitle(item, item.url || item.pageUrl);
    }
  }, {
    key: "normalizeItem",
    value: function normalizeItem(item, mode) {
      // Apply custom properties for mode or default
      if (item instanceof Object) {
        for (var key in item) {
          if (Object.prototype.hasOwnProperty.call(item, key)) {
            var val = item[key];

            if (val && (val[mode] || val.default)) {
              item[key] = val[mode] ? val[mode] : val.default;
            }
          }
        }
      }
    }
  }, {
    key: "prepareItems",
    value: function prepareItems(items, mode) {
      items === null || items === void 0 ? void 0 : items.map(function (item, i) {
        if (item) {
          var _item$includeFor2;

          BryntumTestHelper.normalizeItem(item, mode); // Only include es6 specific tests + module tests in PR mode

          if (BryntumTestHelper.isPR && !item.items) {
            var _item$includeFor;

            if (mode === 'es6' && !((_item$includeFor = item.includeFor) !== null && _item$includeFor !== void 0 && _item$includeFor.includes('es6')) || mode === 'umd') {
              items[i] = null;
              return;
            }
          } // Include for bundle and skip handling


          if (item.skip !== null && item.skip === true || ((_item$includeFor2 = item.includeFor) === null || _item$includeFor2 === void 0 ? void 0 : _item$includeFor2.replace(' ', '').split(',').indexOf(mode)) === -1) {
            items[i] = null;
          } else {
            var _item$items;

            // Normalize URL
            if (typeof item === 'string') {
              item = items[i] = {
                url: item
              };
            }

            BryntumTestHelper.prepareItem(items[i], mode);
            BryntumTestHelper.prepareItems(item.items, mode); // Remove groups with all items excluded

            if ((_item$items = item.items) !== null && _item$items !== void 0 && _item$items.every(function (item) {
              return item == null;
            })) {
              items[i] = null;
            }
          }
        }
      });
      return items;
    }
  }]);

  return BryntumTestHelper;
}();

BryntumTestHelper.isTC = /IS_TEAMCITY/.test(location.href);
BryntumTestHelper.isPR = /IS_PR/.test(location.href);
BryntumTestHelper.isTrial = BryntumTestHelper.detectTrial();