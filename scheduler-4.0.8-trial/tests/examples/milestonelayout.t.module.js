StartTest(t => {
    const selector = '[data-event-id="2"]';

    bryntum.query('scheduler').enableEventAnimations = false;

    let scheduler;

    t.it('sanity', t => {
        t.chain(
            { waitForSelector : '.b-sch-foreground-canvas' },

            (next, el) => {
                scheduler = bryntum.fromElement(el[0], 'scheduler');
                next();
            },

            () => t.checkGridSanity(scheduler)
        );
    });

    t.it('sizes', t => {
        t.chain(
            { waitForSelector : '.b-sch-event' },

            { click : '.b-combo' },

            { click : '.b-list-item:contains(Default)' },

            next => {
                t.isApprox(document.querySelector(selector + ' .b-sch-event').getBoundingClientRect().width, 40, 'Correct width');
                next();
            },

            { click : '.b-combo' },

            { click : '.b-list-item:contains(Estimate)' },

            next => {
                t.isApprox(document.querySelector(selector).getBoundingClientRect().width, 240, 'Correct width');
                next();
            },

            { click : '.b-combo' },

            { click : '.b-list-item:contains(Data)' },

            next => {
                t.isApprox(document.querySelector(selector).getBoundingClientRect().width, 200, 'Correct width');
                next();
            },

            { click : '.b-combo' },

            { click : '.b-list-item:contains(Measure)' },

            () => {
                t.isApprox(document.querySelector(selector).getBoundingClientRect().width, 185, 'Correct width');
            }
        );
    });
});
