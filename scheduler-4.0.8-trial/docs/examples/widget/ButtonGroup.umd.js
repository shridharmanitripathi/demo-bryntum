targetElement.innerHTML = "<p>A ButtonGroup containing some buttons</p>";
new ButtonGroup({
  appendTo: targetElement,
  cls: 'b-raised',
  items: [{
    icon: 'b-fa b-fa-dog',
    cls: 'b-raised'
  }, {
    icon: 'b-fa b-fa-spider',
    cls: 'b-raised'
  }, {
    icon: 'b-fa b-fa-crow',
    cls: 'b-raised'
  }, {
    icon: 'b-fa b-fa-hippo',
    cls: 'b-raised'
  }, {
    icon: 'b-fa b-fa-cat',
    cls: 'b-raised'
  }, {
    icon: 'b-fa b-fa-fish',
    cls: 'b-raised'
  }]
});