var picker = new DatePicker({
  appendTo: targetElement,
  width: '24em',
  onSelectionChange: function onSelectionChange(_ref) {
    var selection = _ref.selection;
    Toast.show("You picked ".concat(DateHelper.format(selection[0], 'MMM DD')));
  }
});