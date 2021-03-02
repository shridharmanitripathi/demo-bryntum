function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  function applyLocale(t, name) {
    t.diag("Applying locale ".concat(name));
    return LocaleManager.locale = window.bryntum.locales[name];
  }

  Object.assign(window, {
    Scheduler: Scheduler,
    EventStore: EventStore,
    ResourceStore: ResourceStore,
    DependencyStore: DependencyStore
  });
  var scheduler;
  t.beforeEach(function (t) {
    scheduler && scheduler.destroy();
    scheduler = null;
  });
  t.it('Should update event editor date pickers weekStartDay on switching locales', function (t) {
    scheduler = t.getScheduler({
      features: {
        eventTooltip: false,
        eventEdit: true // is enabled by default already, but in case we change our minds...

      }
    });
    t.chain({
      waitForRowsVisible: scheduler
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var locale;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              locale = applyLocale(t, 'En');
              t.is(locale.DateHelper.weekStartDay, 0, 'English week starts from Sunday');

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })), {
      doubleClick: '.b-sch-event'
    }, {
      click: '.b-pickerfield[data-ref="startDateField"] .b-icon-calendar'
    }, {
      waitForSelector: '.b-calendar-day-header[data-column-index="0"][data-cell-day="0"]',
      desc: 'Start date: Week starts with correct day'
    }, {
      type: '[ESC]'
    }, {
      click: '.b-pickerfield[data-ref="endDateField"] .b-icon-calendar'
    }, {
      waitForSelector: '.b-calendar-day-header[data-column-index="0"][data-cell-day="0"]',
      desc: 'End date: Week starts with correct day'
    }, {
      type: '[ESC]'
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var locale;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              locale = applyLocale(t, 'Ru');
              t.is(locale.DateHelper.weekStartDay, 1, 'Russian week starts from Monday');

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })), {
      click: '.b-pickerfield[data-ref="startDateField"] .b-icon-calendar'
    }, {
      waitForSelector: '.b-calendar-day-header[data-column-index="0"][data-cell-day="1"]',
      desc: 'Start date: Week starts with correct day'
    }, {
      type: '[ESC]'
    }, {
      click: '.b-pickerfield[data-ref="endDateField"] .b-icon-calendar'
    }, {
      waitForSelector: '.b-calendar-day-header[data-column-index="0"][data-cell-day="1"]',
      desc: 'End date: Week starts with correct day'
    });
  });
  t.it('Should update topDateFormat for dayAndWeek preset on switching locales', function (t) {
    scheduler = t.getScheduler({
      viewPreset: 'dayAndWeek'
    }); // new Intl.DateTimeFormat('ru', { month : 'short' }).format(new Date(2011, 0, 1))
    // Chrome => "янв."
    // IE11   => "янв"

    var ruDateText = BrowserHelper.isIE11 ? 'нед.01 янв 2011' : 'нед.01 янв. 2011';
    t.chain({
      waitForRowsVisible: scheduler
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              applyLocale(t, 'En');

            case 1:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })), {
      waitForSelector: '.b-sch-header-timeaxis-cell[data-tick-index="0"]:contains(w.01 Jan 2011)',
      desc: 'English topDateFormat is correct for dayAndWeek preset'
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              applyLocale(t, 'Ru');

            case 1:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })), {
      waitForSelector: ".b-sch-header-timeaxis-cell[data-tick-index=\"0\"]:contains(".concat(ruDateText, ")"),
      desc: 'Russian topDateFormat is correct for dayAndWeek preset'
    });
  });
  t.it('Should update topDateFormat for dayAndWeek and weekAndDay presets on switching locales', function (t) {
    var customEnLocale = LocaleHelper.mergeLocales(window.bryntum.locales.En, {
      PresetManager: {
        dayAndWeek: {
          topDateFormat: 'MMMM YYYY'
        },
        weekAndDay: {
          topDateFormat: 'YYYY MMM DD'
        }
      }
    });
    LocaleHelper.publishLocale('En-Custom', customEnLocale);
    scheduler = t.getScheduler({
      viewPreset: 'dayAndWeek'
    });
    t.chain({
      waitForRowsVisible: scheduler
    }, function () {
      applyLocale(t, 'En');
      t.selectorExists('.b-sch-header-timeaxis-cell[data-tick-index="0"]:contains(w.01 Jan 2011)', 'English topDateFormat is correct for dayAndWeek preset');
      applyLocale(t, 'En-Custom');
      t.selectorExists('.b-sch-header-timeaxis-cell[data-tick-index="0"]:contains(January 2011)', 'English Custom topDateFormat is correct for dayAndWeek preset');
      scheduler.viewPreset = 'weekAndDay';
      applyLocale(t, 'En');
      t.selectorExists('.b-sch-header-timeaxis-cell[data-tick-index="0"]:contains(2011 January 02)', 'English topDateFormat is correct for weekAndDay preset');
      applyLocale(t, 'En-Custom');
      t.selectorExists('.b-sch-header-timeaxis-cell[data-tick-index="0"]:contains(2011 Jan 02)', 'English Custom topDateFormat is correct for weekAndDay preset');
    });
  });
});