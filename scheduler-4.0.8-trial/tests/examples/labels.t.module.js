StartTest(t => {
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

    t.it('Edit the duration', t => {
        let scheduler,
            event,
            duration;

        t.chain(
            { waitForSelector : '.b-sch-event-wrap' },

            (next) => {
                scheduler = bryntum.query('scheduler');
                event = scheduler.eventStore.findByField('name', 'Out of office')[0].data;
                duration = event.duration;

                next();
            },

            { dblclick : `.b-sch-event-wrap:contains(Out of office) .b-sch-label-left` },

            // Wait to focus the label feature's left editor
            { waitFor : () => document.activeElement === scheduler.features.labels.left.editor.inputField.input },

            // Spin up
            next => {
                t.click(scheduler.features.labels.left.editor.inputField.triggers.spin.upButton, next);
            },

            { type : '[ENTER]' },

            () => {
                t.is(event.duration, duration + 1);
            }
        );
    });
});
