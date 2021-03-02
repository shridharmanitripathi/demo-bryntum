const panel = new Panel({
    appendTo : targetElement,
    height   : '20em',
    width    : '40em',
    header   : 'Panel header',
    tools    : [
        {
            cls     : 'b-fa b-fa-times',
            handler : () => panel.destroy()
        }
    ],
    tbar : [
        {
            icon : 'b-fa b-fa-save'
        },
        {
            icon : 'b-fa b-fa-trash'
        },
        {
            type : 'button',
            text : 'Button with text'
        }
    ],
    bbar : [
        {
            text : 'Button in bottom toolbar'
        }
    ],
    html : `Bacon ipsum dolor amet flank ribeye ham hock rump, 
        alcatra pork belly pancetta leberkas bacon shoulder 
        meatloaf ball tip pig. Tongue jerky meatloaf pancetta 
        pork sirloin. Hamburger corned beef ball tip cupim 
        sirloin frankfurter tri-tip. Swine kevin ham hock, 
        drumstick flank pig shoulder shankle. Tri-tip pork 
        chop fatback turducken pork salami. Tongue boudin 
        salami flank bacon sirloin`
});
