function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var scheduler; // async beforeEach doesn't work in umd

  t.beforeEach( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t, next) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              scheduler && scheduler.destroy();
              _context.next = 3;
              return t.getVerticalSchedulerAsync({
                features: {
                  eventMenu: true,
                  eventDragCreate: false,
                  // Disabled to be able to use EventDragSelect
                  eventDragSelect: true,
                  resourceTimeRanges: true,
                  timeRanges: true
                }
              });

            case 3:
              scheduler = _context.sent;
              next();

            case 5:
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

  function assertEventElement(t, event) {
    var top = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var left = arguments.length > 3 ? arguments[3] : undefined;
    var width = arguments.length > 4 ? arguments[4] : undefined;
    var height = arguments.length > 5 ? arguments[5] : undefined;
    var msg = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : '';
    var selector = "[data-event-id=\"".concat(event.id, "\"]:not(.b-released)");

    if (top === null) {
      t.selectorNotExists(selector, 'Element not found ' + msg);
    } else {
      var element = document.querySelector(selector);
      t.ok(element, 'Element found ' + msg);
      var box = Rectangle.from(element, scheduler.timeAxisSubGridElement);
      t.is(box.top, top, 'Correct top');
      t.is(box.left, left, 'Correct left');
      t.is(box.width, width, 'Correct width');
      t.is(box.height, height, 'Correct height');
    }
  } // Dependencies not supported by vertical
  // DependencyEdit not supported by vertical


  t.it('EventMenu sanity', function (t) {
    t.chain({
      rightClick: '[data-event-id="1"]'
    }, {
      waitForSelector: ':contains(Edit event)'
    });
  }); // EventDrag tested in VerticalEventDrag.t.js
  // EventDragCreate tested in VerticalEventDragCreate.t.js

  t.it('EventDragSelect sanity', function (t) {
    t.chain({
      moveMouseTo: [400, 50]
    }, {
      drag: '.b-sch-timeaxis-cell',
      offset: [50, 50],
      by: [150, 300]
    }, function () {
      t.isDeeply(scheduler.selectedEvents, scheduler.eventStore.getRange(0, 3), 'Correct selection');
      t.selectorExists('[data-event-id="1"] .b-sch-event-selected', 'Element 1 has selection cls');
      t.selectorExists('[data-event-id="2"] .b-sch-event-selected', 'Element 1 has selection cls');
      t.selectorExists('[data-event-id="3"] .b-sch-event-selected', 'Element 1 has selection cls');
    });
  });
  t.it('EventEdit sanity', function (t) {
    t.chain({
      dblClick: '[data-event-id="1"]'
    }, {
      click: '[data-ref="nameField"]'
    }, {
      type: 'Hello',
      clearExisting: true
    }, {
      click: 'button:contains(Save)'
    }, function () {
      t.selectorExists('[data-event-id="1"]:textEquals(Hello)', 'Text updated');
    });
  });
  t.it('EventFilter sanity', function (t) {
    t.chain({
      rightClick: '.b-resourceheader-cell'
    }, {
      moveMouseTo: '.b-menuitem:contains(Filter)'
    }, {
      click: '.b-eventfilter input'
    }, {
      type: 'Event 1[ENTER]',
      clearExisting: true
    }, function () {
      t.selectorCountIs('.b-sch-event-wrap', 1, 'Single event element visible');
    });
  }); // EventResize is tested in VerticalEventResize.t.js

  t.it('EventTooltip sanity', function (t) {
    t.chain({
      moveMouseTo: '.b-sch-event'
    }, {
      waitForSelector: '.b-sch-event-tooltip'
    });
  });
  t.it('TimeAxisHeaderMenu sanity', function (t) {
    t.chain({
      rightClick: '.b-resourceheader-cell'
    }, {
      waitForSelector: ':contains(Zoom)'
    });
  }); // TODO: NonWorkingTime

  t.it('Pan sanity', function (t) {
    scheduler && scheduler.destroy();
    scheduler = t.getVerticalScheduler({
      features: {
        eventDragCreate: false,
        pan: true
      }
    });
    t.chain({
      drag: '.b-sch-timeaxis-cell',
      offset: [400, 400],
      by: [-200, -150]
    }, function () {
      t.is(scheduler.scrollLeft, 200, 'Correct scrollLeft');
      t.is(scheduler.scrollTop, 150, 'Correct scrollTop');
    });
  });
  t.it('ResourceTimeRanges sanity', function (t) {
    var element = document.querySelector('.b-sch-resourcetimerange'),
        box = Rectangle.from(element, scheduler.timeAxisSubGridElement);
    t.is(box.left, 300, 'Correct left');
    t.is(box.top, 100, 'Correct top');
    t.is(box.width, 150, 'Correct width');
    t.is(box.height, 500, 'Correct height');
  });
  t.it('ScheduleMenu sanity', function (t) {
    t.chain({
      rightClick: '.b-sch-timeaxis-cell',
      offset: [200, 60]
    }, {
      click: '.b-menuitem:contains(Add event)'
    }, {
      waitFor: function waitFor() {
        return scheduler.features.eventEdit.editor.containsFocus;
      }
    }, {
      type: 'New test event'
    }, {
      click: 'button:contains(Save)'
    }, function () {
      assertEventElement(t, scheduler.eventStore.last, 50, 150, 150, 50);
    });
  });
  t.it('ScheduleTooltip sanity', function (t) {
    t.chain({
      moveMouseTo: [300, 100]
    }, {
      waitForSelector: '.b-sch-scheduletip'
    }, function () {
      t.selectorExists('.b-sch-clock-text:textEquals(May 27, 2019)', 'Correct text in tip');
    });
  });
  t.it('SimpleEventEdit sanity', function (t) {
    scheduler && scheduler.destroy();
    scheduler = t.getVerticalScheduler({
      features: {
        eventEdit: false,
        simpleEventEdit: true
      }
    });
    t.chain({
      dblClick: '[data-event-id="1"]'
    }, {
      type: 'Hello[ENTER]',
      clearExisting: true
    }, function () {
      t.selectorExists('[data-event-id="1"]:textEquals(Hello)', 'Text updated');
    });
  });
  t.it('TimeRanges sanity', function (t) {
    var _Array$from$map = Array.from(document.querySelectorAll('.b-sch-range')).map(function (el) {
      return Rectangle.from(el, scheduler.timeAxisSubGridElement);
    }),
        _Array$from$map2 = _slicedToArray(_Array$from$map, 2),
        headerRange = _Array$from$map2[0],
        bodyRange = _Array$from$map2[1];

    var _Array$from$map3 = Array.from(document.querySelectorAll('.b-sch-line')).map(function (el) {
      return Rectangle.from(el, scheduler.timeAxisSubGridElement);
    }),
        _Array$from$map4 = _slicedToArray(_Array$from$map3, 2),
        headerLine = _Array$from$map4[0],
        bodyLine = _Array$from$map4[1];

    t.is(headerRange.top, 150, 'Range header y correct');
    t.is(bodyRange.top, 150, 'Range body y correct');
    t.is(headerRange.height, 200, 'Range header height correct');
    t.is(bodyRange.height, 200, 'Range body height correct');
    t.is(bodyRange.width, 1350, 'Range body width correct');
    t.is(headerLine.top, 550, 'Line header y correct');
    t.is(bodyLine.top, 550, 'Line body y correct'); // Not checking header, since it has a label

    t.is(bodyLine.height, 2, 'Line body height correct');
    t.is(bodyLine.width, 1350, 'Line body width correct');
  });
  t.it('Should show both vertical and horizontal column lines', /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
      var expectedInitialOffsets, initialOffsets, expectedOffsets, offsets;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              t.selectorCountIs('.b-column-line-major', 2);
              t.selectorCountIs('.b-column-line', 21);
              t.selectorCountIs('.b-resource-column-line', 8); // 0 - 7

              expectedInitialOffsets = [149, 299, 449, 599, 749, 899, 1049, 1199], initialOffsets = t.query('.b-resource-column-line').map(function (line) {
                return line.offsetLeft;
              });
              t.isDeeply(initialOffsets, expectedInitialOffsets, 'Correct positions initially');
              _context2.next = 7;
              return scheduler.scrollResourceIntoView(scheduler.resourceStore.last, {
                animate: false
              });

            case 7:
              _context2.next = 9;
              return t.waitForAnimationFrame();

            case 9:
              // 1 - 8
              expectedOffsets = [1349, 299, 449, 599, 749, 899, 1049, 1199], offsets = t.query('.b-resource-column-line').map(function (line) {
                return line.offsetLeft;
              });
              t.isDeeply(offsets, expectedOffsets, 'Correct positions after scroll');

            case 11:
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
});