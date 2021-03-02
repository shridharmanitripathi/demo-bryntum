function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _bryntum$scheduler = bryntum.scheduler,
    ResourceModel = _bryntum$scheduler.ResourceModel,
    EventModel = _bryntum$scheduler.EventModel,
    DateHelper = _bryntum$scheduler.DateHelper,
    Scheduler = _bryntum$scheduler.Scheduler,
    Toast = _bryntum$scheduler.Toast,
    MessageDialog = _bryntum$scheduler.MessageDialog;

var Employee = /*#__PURE__*/function (_ResourceModel) {
  _inherits(Employee, _ResourceModel);

  var _super = _createSuper(Employee);

  function Employee() {
    _classCallCheck(this, Employee);

    return _super.apply(this, arguments);
  }

  _createClass(Employee, [{
    key: "cls",
    get: function get() {
      return this.available ? '' : 'unavailable';
    }
  }], [{
    key: "fields",
    get: function get() {
      return [{
        name: 'available',
        type: 'boolean',
        defaultValue: true
      }, {
        name: 'statusMessage',
        defaultValue: 'Gone fishing'
      }];
    }
  }]);

  return Employee;
}(ResourceModel);

var Task = /*#__PURE__*/function (_EventModel) {
  _inherits(Task, _EventModel);

  var _super2 = _createSuper(Task);

  function Task() {
    _classCallCheck(this, Task);

    return _super2.apply(this, arguments);
  }

  _createClass(Task, [{
    key: "dragValidationText",
    get: function get() {
      var resource = this.resource,
          type = this.type;
      var result = '';

      switch (type) {
        case 'Golf':
          result = 'Only C-suite people can play Golf';
          break;

        case 'Meeting':
          result = "Only ".concat(resource.role, " can participate in meetings");
          break;

        case 'Coding':
          result = "Only ".concat(resource.role, " can do coding");
          break;

        case 'Sales':
          result = "Only ".concat(resource.role, " can prepare marketing strategies");
          break;

        case 'Fixed':
          result = 'Fixed time event - may be reassigned, but not rescheduled';
          break;
      }

      return result;
    }
  }, {
    key: "resizeValidationText",
    get: function get() {
      var result = '';

      switch (this.type) {
        case 'Golf':
          result = 'Golf game has always fixed duration';
          break;

        case 'Coding':
          result = 'Programming task duration cannot be shortened';
          break;
      }

      return result;
    }
  }], [{
    key: "fields",
    get: function get() {
      return ['type'];
    }
  }]);

  return Task;
}(EventModel);

var scheduler = new Scheduler({
  appendTo: 'container',
  minHeight: '20em',
  // don't allow tasks to overlap
  allowOverlap: false,
  resourceImagePath: '../_shared/images/users/',
  features: {
    stripe: true,
    timeRanges: true,
    eventTooltip: {
      template: function template(data) {
        var task = data.eventRecord;
        return "\n                    ".concat(task.name ? "<div class=\"b-sch-event-title\">".concat(task.name, "</div>") : '', "\n                    ").concat(data.startClockHtml, "\n                    ").concat(data.endClockHtml, "\n                    ").concat(task.dragValidationText || task.resizeValidationText ? "<div class=\"restriction-title\"><b>Restrictions:</b></div>\n                    <ul class=\"restriction-list\">\n                        ".concat(task.dragValidationText ? "<li>".concat(task.dragValidationText, "</li>") : '', "\n                        ").concat(task.resizeValidationText ? "<li>".concat(task.resizeValidationText, "</li>") : '', "\n                    </ul>") : '', "\n                ");
      }
    },
    eventDrag: {
      validatorFn: function validatorFn(_ref) {
        var draggedRecords = _ref.draggedRecords,
            newResource = _ref.newResource;
        var task = draggedRecords[0],
            isValid = task.type === 'Fixed' || // Only C-suite people can play Golf
        task.type === 'Golf' && ['CEO', 'CTO'].includes(newResource.role) || // Tasks that have type defined cannot be assigned to another resource type
        !(task.type && newResource.role !== task.resource.role);
        return {
          valid: newResource.available && isValid,
          message: !newResource.available ? newResource.statusMessage : !isValid ? task.dragValidationText : ''
        };
      }
    },
    eventResize: {
      validatorFn: function validatorFn(_ref2) {
        var task = _ref2.eventRecord,
            endDate = _ref2.endDate,
            startDate = _ref2.startDate;
        var originalDuration = task.endDate - task.startDate,
            isValid = !(task.type === 'Golf' || task.type === 'Coding' && originalDuration > endDate - startDate);
        return {
          valid: isValid,
          message: isValid ? '' : task.resizeValidationText
        };
      }
    },
    eventDragCreate: {
      validatorFn: function validatorFn(_ref3) {
        var resource = _ref3.resourceRecord;
        return {
          valid: resource.available,
          message: resource.available ? '' : resource.statusMessage
        };
      }
    }
  },
  subGridConfigs: {
    locked: {
      width: 350
    }
  },
  columns: [{
    type: 'resourceInfo',
    text: 'Staff'
  }, {
    text: 'Role',
    field: 'role',
    flex: 1,
    editor: {
      type: 'combo',
      items: ['Sales', 'Developer', 'Marketing', 'Product manager'],
      editable: false,
      pickerWidth: 140
    }
  }, {
    text: 'Available',
    type: 'check',
    field: 'available'
  }],
  crudManager: {
    autoLoad: true,
    eventStore: {
      modelClass: Task
    },
    resourceStore: {
      modelClass: Employee
    },
    transport: {
      load: {
        url: 'data/data.json'
      }
    }
  },
  barMargin: 2,
  rowHeight: 50,
  startDate: new Date(2019, 1, 7, 8),
  endDate: new Date(2019, 1, 7, 22),
  viewPreset: {
    base: 'hourAndDay',
    tickWidth: 100
  },
  multiEventSelect: true,
  // Specialized body template with header and footer
  eventBodyTemplate: function eventBodyTemplate(data) {
    return "\n        ".concat(data.iconCls ? "<i class=\"".concat(data.iconCls, "\"></i>") : '', "\n        <section>\n            <div class=\"b-sch-event-header\">").concat(data.headerText, "</div>\n            <div class=\"b-sch-event-footer\">").concat(data.footerText, "</div>\n        </section>\n    ");
  },
  eventRenderer: function eventRenderer(_ref4) {
    var eventRecord = _ref4.eventRecord,
        resourceRecord = _ref4.resourceRecord,
        renderData = _ref4.renderData;
    return {
      headerText: DateHelper.format(eventRecord.startDate, 'LT'),
      footerText: eventRecord.name || '',
      iconCls: eventRecord.iconCls
    };
  },
  listeners: {
    beforeEventAdd: function beforeEventAdd(_ref5) {
      var resources = _ref5.resources;
      var available = resources[0].available;

      if (!available) {
        Toast.show("Resource not available: ".concat(resources[0].statusMessage));
      }

      return available;
    },
    beforeEventDrag: function beforeEventDrag(_ref6) {
      var eventRecord = _ref6.eventRecord;
      // Only Henrik can be assigned Marketing tasks.
      // constrainDragToResource prevents dragging up or down.
      scheduler.features.eventDrag.constrainDragToResource = eventRecord.type === 'Marketing' && eventRecord.resource.name === 'Henrik'; // Events with type Fixed must not change time slot.

      scheduler.features.eventDrag.constrainDragToTimeSlot = eventRecord.type === 'Fixed';
    },
    beforeEventDropFinalize: function beforeEventDropFinalize(_ref7) {
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var scheduler, context, namesInQuotes, result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                scheduler = _ref7.source, context = _ref7.context;

                if (!scheduler.confirmationsEnabled) {
                  _context.next = 8;
                  break;
                }

                context.async = true;
                namesInQuotes = context.draggedRecords.map(function (eventRecord) {
                  return "\"".concat(eventRecord.name, "\"");
                });
                _context.next = 6;
                return MessageDialog.confirm({
                  title: 'Please confirm',
                  message: "".concat(namesInQuotes.join(', '), " ").concat(namesInQuotes.length > 1 ? 'were' : 'was', " moved. Allow this operation?")
                });

              case 6:
                result = _context.sent;
                // `true` to accept the changes or `false` to reject them
                context.finalize(result === MessageDialog.yesButton);

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    },
    beforeeventresizefinalize: function beforeeventresizefinalize(_ref8) {
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var scheduler, context, eventRecord, result;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                scheduler = _ref8.source, context = _ref8.context;

                if (!scheduler.confirmationsEnabled) {
                  _context2.next = 8;
                  break;
                }

                context.async = true;
                eventRecord = context.eventRecord;
                _context2.next = 6;
                return MessageDialog.confirm({
                  title: 'Please confirm',
                  message: "\"".concat(eventRecord.name, "\" duration changed. Allow this operation?")
                });

              case 6:
                result = _context2.sent;
                // `true` to accept the changes or `false` to reject them
                context.finalize(result === MessageDialog.yesButton);

              case 8:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }))();
    }
  },
  tbar: [{
    type: 'button',
    ref: 'confirmationBtn',
    text: 'Enable confirmations',
    toggleable: true,
    icon: 'b-fa-square',
    pressedIcon: 'b-fa-check-square',
    onAction: function onAction(_ref9) {
      var button = _ref9.source;
      return scheduler.confirmationsEnabled = button.pressed;
    }
  }, {
    type: 'button',
    ref: 'lockBtn',
    text: 'Read only',
    toggleable: true,
    icon: 'b-fa-square',
    pressedIcon: 'b-fa-check-square',
    onAction: function onAction(_ref10) {
      var button = _ref10.source;
      return scheduler.readOnly = button.pressed;
    }
  }]
});