function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
    Scheduler = _bryntum$scheduler.Scheduler,
    ResourceModel = _bryntum$scheduler.ResourceModel,
    StringHelper = _bryntum$scheduler.StringHelper; //TODO: tree filtering

var Gate = /*#__PURE__*/function (_ResourceModel) {
  _inherits(Gate, _ResourceModel);

  var _super = _createSuper(Gate);

  function Gate() {
    _classCallCheck(this, Gate);

    return _super.apply(this, arguments);
  }

  _createClass(Gate, null, [{
    key: "fields",
    get: function get() {
      return [{
        name: 'capacity',
        type: 'number'
      }];
    }
  }]);

  return Gate;
}(ResourceModel);

Gate.exposeProperties();
new Scheduler({
  appendTo: 'container',
  minHeight: '20em',
  eventColor: null,
  eventStyle: null,
  features: {
    timeRanges: {
      showHeaderElements: false
    },
    tree: true,
    regionResize: true
  },
  rowHeight: 45,
  barMargin: 5,
  columns: [{
    type: 'tree',
    text: 'Name',
    width: 220,
    field: 'name'
  }, {
    type: 'aggregate',
    text: 'Capacity',
    width: 90,
    field: 'capacity'
  }],
  startDate: new Date(2017, 11, 2, 8),
  //endDate   : new Date(2017, 11, 3),
  viewPreset: 'hourAndDay',
  crudManager: {
    autoLoad: true,
    resourceStore: {
      modelClass: Gate
    },
    transport: {
      load: {
        url: 'data/data.json'
      }
    }
  },
  eventRenderer: function eventRenderer(_ref) {
    var eventRecord = _ref.eventRecord,
        resourceRecord = _ref.resourceRecord,
        renderData = _ref.renderData;
    var isLeaf = resourceRecord.isLeaf; // Custom icon

    renderData.iconCls = 'b-fa b-fa-plane'; // Add custom CSS classes to the template element data by setting property names

    renderData.cls.leaf = isLeaf;
    renderData.cls.group = !isLeaf;
    return isLeaf ? StringHelper.encodeHtml(eventRecord.name) : '\xa0';
  }
});