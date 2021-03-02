var panel = new Panel({
  appendTo: targetElement,
  height: '20em',
  width: '40em',
  header: 'Panel header',
  tools: [{
    cls: 'b-fa b-fa-times',
    handler: function handler() {
      return panel.destroy();
    }
  }],
  tbar: [{
    icon: 'b-fa b-fa-save'
  }, {
    icon: 'b-fa b-fa-trash'
  }, {
    type: 'button',
    text: 'Button with text'
  }],
  bbar: [{
    text: 'Button in bottom toolbar'
  }],
  html: "Bacon ipsum dolor amet flank ribeye ham hock rump, \n        alcatra pork belly pancetta leberkas bacon shoulder \n        meatloaf ball tip pig. Tongue jerky meatloaf pancetta \n        pork sirloin. Hamburger corned beef ball tip cupim \n        sirloin frankfurter tri-tip. Swine kevin ham hock, \n        drumstick flank pig shoulder shankle. Tri-tip pork \n        chop fatback turducken pork salami. Tongue boudin \n        salami flank bacon sirloin"
});