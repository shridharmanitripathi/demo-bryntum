function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _bryntum$scheduler = bryntum.scheduler,
    DateHelper = _bryntum$scheduler.DateHelper,
    AsyncHelper = _bryntum$scheduler.AsyncHelper,
    WidgetHelper = _bryntum$scheduler.WidgetHelper,
    DataGenerator = _bryntum$scheduler.DataGenerator,
    Scheduler = _bryntum$scheduler.Scheduler;
var scheduler, resourceCountField, eventCountField;

function generateResources() {
  return _generateResources.apply(this, arguments);
}

function _generateResources() {
  _generateResources = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var resourceCount,
        eventCount,
        today,
        mask,
        colors,
        resources,
        events,
        assignments,
        dependencies,
        useDependencies,
        schedulerEndDate,
        j,
        step,
        generator,
        res,
        startDate,
        duration,
        endDate,
        eventId,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            resourceCount = _args.length > 0 && _args[0] !== undefined ? _args[0] : resourceCountField.value;
            eventCount = _args.length > 1 && _args[1] !== undefined ? _args[1] : eventCountField.value;
            today = DateHelper.clearTime(new Date()), mask = WidgetHelper.mask(scheduler.element, 'Generating records'), colors = ['cyan', 'green', 'indigo'], resources = [], events = [], assignments = [], dependencies = [], useDependencies = !scheduler.features.dependencies.disabled;
            schedulerEndDate = today;
            console.time('generate');
            generator = DataGenerator.generate(resourceCount);

          case 6:
            if (!((step = generator.next()) && !step.done)) {
              _context.next = 16;
              break;
            }

            res = step.value;
            resources.push(res);

            for (j = 0; j < eventCount; j++) {
              startDate = DateHelper.add(today, Math.round(Math.random() * (j + 1) * 20), 'days'), duration = Math.round(Math.random() * 9) + 2, endDate = DateHelper.add(startDate, duration, 'days'), eventId = events.length + 1;
              events.push({
                id: eventId,
                name: 'Task #' + (events.length + 1),
                startDate: startDate,
                duration: duration,
                endDate: endDate,
                eventColor: colors[resources.length % 3]
              });
              assignments.push({
                id: 'a' + eventId,
                event: eventId,
                resource: res.id
              });

              if (useDependencies && j > 0) {
                dependencies.push({
                  id: dependencies.length + 1,
                  from: eventId - 1,
                  to: eventId
                });
              }

              if (endDate > schedulerEndDate) {
                schedulerEndDate = endDate;
              }
            }

            if (!(resources.length % 2000 === 0)) {
              _context.next = 14;
              break;
            }

            mask.text = "Generated ".concat(resources.length * eventCount, " of ").concat(resourceCount * eventCount, " records");
            _context.next = 14;
            return AsyncHelper.animationFrame();

          case 14:
            _context.next = 6;
            break;

          case 16:
            mask.text = 'Loading data';
            _context.next = 19;
            return AsyncHelper.sleep(100);

          case 19:
            console.timeEnd('generate');
            console.time('data');
            scheduler.suspendRefresh();
            scheduler.endDate = schedulerEndDate;
            scheduler.project = {
              assignmentStore: {
                useRawData: true,
                data: assignments
              },
              resourceStore: {
                useRawData: true,
                data: resources
              },
              eventStore: {
                useRawData: true,
                data: events
              },
              dependencyStore: {
                useRawData: true,
                data: dependencies
              }
            };
            scheduler.resumeRefresh(true);
            _context.next = 27;
            return scheduler.project.await('refresh');

          case 27:
            console.timeEnd('data');
            mask.close();

          case 29:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _generateResources.apply(this, arguments);
}

function toggleCustom(show) {
  scheduler.widgetMap.dependenciesButton.hidden = resourceCountField.hidden = eventCountField.hidden = !show;
}

function applyPreset(resources, events) {
  toggleCustom(false);
  resourceCountField.value = resources;
  eventCountField.value = events;
  generateResources();
}

function initialize() {
  return _initialize.apply(this, arguments);
}

function _initialize() {
  _initialize = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            scheduler = new Scheduler({
              appendTo: 'container',
              minHeight: '20em',
              eventStyle: 'border',
              rowHeight: 50,
              columns: [{
                type: 'rownumber'
              }, {
                text: 'Id',
                field: 'id',
                width: 50,
                hidden: true
              }, {
                text: 'First name',
                field: 'firstName',
                flex: 1
              }, {
                text: 'Surname',
                field: 'surName',
                flex: 1
              }, {
                text: 'Score',
                field: 'score',
                type: 'number',
                flex: 1
              }],
              features: {
                dependencies: {
                  disabled: true
                }
              },
              generateResources: generateResources,
              tbar: ['Presets', {
                type: 'buttongroup',
                defaults: {
                  width: '8em'
                },
                toggleGroup: true,
                items: [{
                  text: '1K events',
                  pressed: true,
                  onClick: function onClick() {
                    applyPreset(200, 5);
                  }
                }, {
                  text: '5K events',
                  onClick: function onClick() {
                    applyPreset(1000, 5);
                  }
                }, {
                  text: '10K events',
                  onClick: function onClick() {
                    applyPreset(1000, 10);
                  }
                }, {
                  text: 'Custom',
                  ref: 'customButton',
                  onClick: function onClick() {
                    toggleCustom(true);
                  }
                }]
              }, '->', {
                ref: 'resourceCountField',
                type: 'number',
                placeholder: 'Number of resources',
                label: 'Resources',
                tooltip: 'Enter number of resource rows to generate and press [ENTER]',
                min: 1,
                max: 10000,
                value: 1000,
                width: 200,
                keyStrokeChangeDelay: 500,
                changeOnSpin: 500,
                hidden: true,
                onChange: function onChange() {
                  return generateResources();
                }
              }, {
                ref: 'eventCountField',
                type: 'number',
                placeholder: 'Number of events',
                label: 'Events',
                tooltip: 'Enter number of events per resource to generate and press [ENTER]',
                min: 1,
                max: 100,
                value: 5,
                width: 180,
                keyStrokeChangeDelay: 500,
                changeOnSpin: 500,
                hidden: true,
                onChange: function onChange() {
                  return generateResources();
                }
              }, {
                type: 'button',
                ref: 'dependenciesButton',
                toggleable: true,
                icon: 'b-fa-square',
                pressedIcon: 'b-fa-check-square',
                text: 'Dependencies',
                hidden: true,
                onToggle: function onToggle(_ref) {
                  var pressed = _ref.pressed;
                  scheduler.features.dependencies.disabled = !pressed;

                  if (pressed && !scheduler.dependencyStore.count) {
                    generateResources();
                  }
                }
              }]
            });
            resourceCountField = scheduler.widgetMap.resourceCountField;
            eventCountField = scheduler.widgetMap.eventCountField;
            _context2.next = 5;
            return scheduler.project.commitAsync();

          case 5:
            generateResources();

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _initialize.apply(this, arguments);
}

initialize();