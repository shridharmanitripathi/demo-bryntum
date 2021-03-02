var _bryntum$scheduler = bryntum.scheduler,
    Scheduler = _bryntum$scheduler.Scheduler,
    WidgetHelper = _bryntum$scheduler.WidgetHelper,
    Toast = _bryntum$scheduler.Toast;
var cookie = 'PHPSESSID=scheduler-crudmanager';

if (!document.cookie.includes(cookie)) {
  document.cookie = "".concat(cookie, "-").concat(Math.random().toString(16).substring(2));
}

var scheduler = new Scheduler({
  appendTo: 'container',
  minHeight: '20em',
  startDate: new Date(2018, 4, 21, 6),
  endDate: new Date(2018, 4, 21, 18),
  viewPreset: 'hourAndDay',
  rowHeight: 50,
  barMargin: 5,
  eventColor: 'orange',
  eventStyle: 'colored',
  features: {
    // Configure event editor to display 'brand' as resource name
    eventEdit: {
      resourceFieldConfig: {
        displayField: 'car'
      }
    }
  },
  columns: [{
    text: 'Id',
    field: 'id',
    width: 100,
    editor: false,
    hidden: true
  }, {
    text: 'Car',
    field: 'car',
    width: 150
  }, {
    type: 'date',
    text: 'Modified',
    field: 'dt',
    width: 90,
    format: 'HH:mm:ss',
    editor: false,
    hidden: true
  }],
  crudManager: {
    resourceStore: {
      // Add some custom fields
      fields: ['car', 'dt']
    },
    eventStore: {
      // Add a custom field and redefine durationUnit to default to hours
      fields: ['dt', {
        name: 'durationUnit',
        defaultValue: 'hour'
      }]
    },
    transport: {
      load: {
        url: 'php/read.php',
        paramName: 'data'
      },
      sync: {
        url: 'php/sync.php'
      }
    },
    autoLoad: true,
    autoSync: true,
    onRequestFail: function onRequestFail(event) {
      var requestType = event.requestType,
          response = event.response,
          serverMessage = response && response.message,
          exceptionText = "Action \"".concat(requestType, "\" failed. ").concat(serverMessage ? " Server response: ".concat(serverMessage) : '');
      Toast.show({
        html: exceptionText,
        color: 'b-red',
        style: 'color:white',
        timeout: 3000
      });
      console.error(exceptionText);
    }
  },
  tbar: [{
    type: 'button',
    ref: 'reloadButton',
    icon: 'b-fa b-fa-sync',
    text: 'Reload scheduler',
    onAction: function onAction() {
      scheduler.crudManager.load().then(function () {
        return WidgetHelper.toast('Data reloaded');
      }).catch(function () {
        return WidgetHelper.toast('Loading failed');
      });
    }
  }, {
    type: 'button',
    ref: 'resetButton',
    color: 'b-red',
    icon: 'b-fa b-fa-recycle',
    text: 'Reset database',
    onAction: function onAction() {
      scheduler.crudManager.load({
        // Adding a query string parameter "...&reset=1" to let server know that we want to reset the database
        request: {
          params: {
            reset: 1
          }
        }
      }).then(function () {
        return WidgetHelper.toast('Database was reset');
      }).catch(function () {
        return WidgetHelper.toast('Database reset failed');
      });
    }
  }]
});