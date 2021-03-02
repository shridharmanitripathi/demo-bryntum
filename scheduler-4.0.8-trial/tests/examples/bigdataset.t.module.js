StartTest(async t => {
    const scheduler = bryntum.query('scheduler');

    t.beforeEach((t, next) => {
        t.waitForSelector('.b-sch-event', () => {
            next();
        });
    });

    await t.click('[data-ref=customButton]');

    t.it('sanity', t => {
        t.checkGridSanity(scheduler);
    });

    // https://app.assembla.com/spaces/bryntum/tickets/9112
    t.it('Should not crash for 1001 resources', t => {
        t.chain(
            { click : '[data-ref=resourceCountField]' },

            { type : '1001[ENTER]', clearExisting : true },

            { waitFor : () => scheduler.eventStore.count === 5005, desc : 'Waiting for correct amount of events' }
        );
    });

    t.it('Should draw dependencies', t => {
        t.ok(scheduler.features.dependencies.disabled, 'Dependencies disabled');
        t.is(scheduler.dependencyStore.count, 0, 'No dependencies initially');

        t.isCalledOnce('updateProject', scheduler, 'Data generated once');

        t.chain(
            { click : 'button:contains("Dependencies")' },

            { waitForSelector : '.b-sch-dependency', desc : 'Dependency lines rendered' },

            { click : 'button:contains("Dependencies")' },

            { waitForSelectorNotFound : '.b-sch-dependency', desc : 'Dependency lines removed' },

            { click : 'button:contains("Dependencies")' },

            { waitForSelector : '.b-sch-dependency', desc : 'Dependency lines back' }
        );
    });

    t.it('Should not crash for 10 resources', t => {
        t.chain(
            { click : '[data-ref=resourceCountField]' },

            { type : '10[ENTER]', clearExisting : true },

            async() => {
                return new Promise(resolve => {
                    scheduler.on({
                        projectChange({ project }) {
                            // Test should not throw before dataReady is fired
                            project.await('dataReady', false).then(() => resolve());
                        }
                    });
                });
            }
        );
    });

    // https://github.com/bryntum/support/issues/1487
    t.it('Should not leave old lines when replacing project', async t => {
        scheduler.features.dependencies.disabled = false;

        window.brk = true;

        scheduler.generateResources(10);

        await scheduler.await('dependenciesDrawn', false);

        scheduler.generateResources(5);

        await scheduler.await('dependenciesDrawn', false);

        t.selectorNotExists('polyline[depId="21"]', 'Old dependency not drawn');
    });
});
