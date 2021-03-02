var scheduler = new Scheduler({
  appendTo: targetElement,
  autoHeight: true,
  resources: DataGenerator.generateData(3),
  startDate: new Date(2018, 0, 7),
  endDate: new Date(2018, 0, 21),
  columns: [{
    field: 'name',
    text: 'Name',
    width: 150,
    renderer: function renderer(_ref) {
      var cellElement = _ref.cellElement,
          record = _ref.record;
      cellElement.style.backgroundColor = record.color;
      cellElement.style.color = '#fff';
      return record.name;
    }
  }]
});