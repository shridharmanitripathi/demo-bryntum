new Button({
  appendTo: targetElement,
  text: 'Hover me',
  tooltip: 'Tooltip for widget'
});
new Button({
  appendTo: targetElement,
  text: 'I\'m async',
  tooltip: {
    listeners: {
      beforeShow: function beforeShow(_ref) {
        var tip = _ref.source;
        tip.html = new Promise(function (resolve) {
          setTimeout(function () {
            return resolve('Async content!');
          }, 2000);
        }); // AjaxHelper.get('someurl').then(response => tip.html = 'Done!');
      }
    }
  }
});