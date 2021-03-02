StartTest(t => {
    
    // https://github.com/bryntum/support/issues/276
    t.it('Task shouldn\'t disappear on D&D', t => {
        t.chain(
            { click : 'button-reschedule' },

            { drag : '[data-event-id="r3"', to : '[data-event-id="r1"' },

            { waitForElementVisible : '[data-event-id="r3"' }
        );
    });
});
