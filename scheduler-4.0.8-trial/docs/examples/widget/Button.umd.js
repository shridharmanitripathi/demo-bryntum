targetElement.innerHTML = "\n<p class=\"example-desc\">A variety of Buttons, first row has \"b-raised\" style and second row is flat</p>\n<div id=\"first\" class=\"widgetRow\"></div>\n<div id=\"second\" class=\"widgetRow\"></div>\n";
var firstRow = container.querySelector('#first'),
    secondRow = container.querySelector('#second'); // Button with text & icon

new Button({
  appendTo: firstRow,
  cls: 'b-raised',
  icon: 'b-fa-plus',
  text: 'With icon',
  color: 'b-blue',
  onClick: function onClick() {
    return WidgetHelper.toast('Button clicked');
  }
}); // Button with only icon

new Button({
  appendTo: firstRow,
  icon: 'b-fa-trash',
  cls: 'b-raised',
  color: 'b-red',
  onClick: function onClick() {
    return WidgetHelper.toast('Button clicked');
  }
}); // Button with only text

new Button({
  appendTo: firstRow,
  cls: 'b-raised',
  text: 'Only text',
  color: 'b-green',
  onClick: function onClick() {
    return WidgetHelper.toast('Button clicked');
  }
}); // raised disable

new Button({
  appendTo: firstRow,
  cls: 'b-raised',
  icon: 'b-fa-plus',
  text: 'Disabled',
  disabled: true
}); // flat Button with text & icon

new Button({
  appendTo: secondRow,
  icon: 'b-fa-plus',
  text: 'Flat icon',
  onClick: function onClick() {
    return WidgetHelper.toast('Button clicked');
  }
}); // flat Button with icon only

new Button({
  appendTo: secondRow,
  icon: 'b-fa-info',
  onClick: function onClick() {
    return WidgetHelper.toast('Button clicked');
  }
}); // flat Button with text only

new Button({
  appendTo: secondRow,
  text: 'Flat text',
  onClick: function onClick() {
    return WidgetHelper.toast('Button clicked');
  }
}); // flat disabled

new Button({
  appendTo: secondRow,
  text: 'Disabled',
  disabled: true
});