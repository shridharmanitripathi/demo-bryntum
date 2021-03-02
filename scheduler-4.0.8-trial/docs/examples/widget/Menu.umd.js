new Button({
  appendTo: targetElement,
  cls: 'b-raised',
  text: 'Show menu',
  onClick: function onClick(_ref) {
    var btn = _ref.source;
    var menu = btn.menu || (btn.menu = new Menu({
      forElement: btn.element,
      items: [{
        icon: 'b-icon b-icon-add',
        text: 'Add'
      }, {
        icon: 'b-icon b-icon-trash',
        text: 'Remove'
      }, {
        icon: 'b-icon b-icon-lock',
        disabled: true,
        text: 'I am disabled'
      }, {
        text: 'Sub menu',
        menu: [{
          icon: 'b-icon b-fa-play',
          text: 'Play'
        }]
      }],
      // Method is called for all ancestor levels
      onItem: function onItem(_ref2) {
        var item = _ref2.item;
        Toast.show('You clicked ' + item.text);
      }
    }));
    menu.show();
  }
});