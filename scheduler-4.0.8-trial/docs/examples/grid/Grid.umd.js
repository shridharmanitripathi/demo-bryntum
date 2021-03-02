// grid with basic configuration
var grid = new Grid({
  // makes grid as high as it needs to be to fit rows
  autoHeight: true,
  appendTo: targetElement,
  columns: [{
    field: 'name',
    text: 'Name'
  }, {
    field: 'job',
    text: 'Job',
    renderer: function renderer(_ref) {
      var value = _ref.value;
      return value || 'Unemployed';
    }
  }],
  data: [{
    id: 1,
    name: 'Bill',
    job: 'Retired'
  }, {
    id: 2,
    name: 'Elon',
    job: 'Visionary'
  }, {
    id: 3,
    name: 'Me'
  }]
});