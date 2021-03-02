targetElement.innerHTML = `
<p class="example-desc">A variety of Buttons, first row has "b-raised" style and second row is flat</p>
<div id="first" class="widgetRow"></div>
<div id="second" class="widgetRow"></div>
`;
const firstRow = container.querySelector('#first'),
      secondRow = container.querySelector('#second');

// Button with text & icon
new Button({
    appendTo : firstRow,
    cls      : 'b-raised',
    icon     : 'b-fa-plus',
    text     : 'With icon',
    color    : 'b-blue',
    onClick  : () => WidgetHelper.toast('Button clicked')
});

// Button with only icon
new Button({
    appendTo : firstRow,
    icon     : 'b-fa-trash',
    cls      : 'b-raised',
    color    : 'b-red',
    onClick  : () => WidgetHelper.toast('Button clicked')
});

// Button with only text
new Button({
    appendTo : firstRow,
    cls      : 'b-raised',
    text     : 'Only text',
    color    : 'b-green',
    onClick  : () => WidgetHelper.toast('Button clicked')
});

// raised disable
new Button({
    appendTo : firstRow,
    cls      : 'b-raised',
    icon     : 'b-fa-plus',
    text     : 'Disabled',
    disabled : true
});

// flat Button with text & icon
new Button({
    appendTo : secondRow,
    icon     : 'b-fa-plus',
    text     : 'Flat icon',
    onClick  : () => WidgetHelper.toast('Button clicked')
});

// flat Button with icon only
new Button({
    appendTo : secondRow,
    icon     : 'b-fa-info',
    onClick  : () => WidgetHelper.toast('Button clicked')
});

// flat Button with text only
new Button({
    appendTo : secondRow,
    text     : 'Flat text',
    onClick  : () => WidgetHelper.toast('Button clicked')
});

// flat disabled
new Button({
    appendTo : secondRow,
    text     : 'Disabled',
    disabled : true
});
