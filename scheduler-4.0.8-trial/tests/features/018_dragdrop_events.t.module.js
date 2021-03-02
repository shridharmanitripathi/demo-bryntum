
StartTest(t => {
    t.describe('All drag events should be fired and handled correctly', t => {
        let scheduler,
            beforeFinalize = false;

        async function setup(config) {
            scheduler && scheduler.destroy();

            scheduler = t.getScheduler(Object.assign({
                features : {
                    eventDragCreate : true,
                    eventDrag       : true,
                    eventResize     : true,
                    eventEdit       : false
                }
            }, config));

            await t.waitForProjectReady(scheduler);

            beforeFinalize = false;

            return scheduler;
        }

        t.it('Assert dragcreate events (async)', async t => {
            scheduler = await setup({
                listeners : {
                    beforedragcreatefinalize({ context }) {
                        beforeFinalize = context.async = true;
                        context.finalize(true);
                    }
                }
            });

            t.firesOnce(scheduler, 'dragcreatestart', 'dragcreatestart is fired');
            t.firesOnce(scheduler, 'beforedragcreate', 'beforedragcreate is fired');
            t.firesOnce(scheduler, 'beforeeventadd', 'beforeeventadd is fired');
            t.firesOnce(scheduler, 'afterdragcreate', 'afterdragcreate is fired');
            t.firesOnce(scheduler, 'dragcreateend', 'dragcreateend is fired');

            t.chain(
                { drag : '.b-sch-timeaxis-cell', fromOffset : [2, 2], by : [100, 0] },
                () => {
                    t.is(beforeFinalize, true, 'beforedragcreatefinalize fired');
                }
            );
        });

        t.it('Assert dragcreate events (sync)', async t => {
            scheduler = await setup({
                listeners : {
                    beforedragcreatefinalize({ context }) {
                        beforeFinalize = true;
                    }
                }
            });

            t.firesOnce(scheduler, 'dragcreatestart', 'dragcreatestart is fired');
            t.firesOnce(scheduler, 'beforedragcreate', 'beforedragcreate is fired');
            t.firesOnce(scheduler, 'beforeeventadd', 'beforeeventadd is fired');
            t.firesOnce(scheduler, 'afterdragcreate', 'afterdragcreate is fired');
            t.firesOnce(scheduler, 'dragcreateend', 'dragcreateend is fired');

            t.chain(
                { drag : '.b-sch-timeaxis-cell', fromOffset : [2, 2], by : [100, 0] },
                () => {
                    t.is(beforeFinalize, true, 'beforedragcreatefinalize fired');
                }
            );
        });

        t.it('Assert drag events (async)', async t => {
            scheduler = await setup({
                listeners : {
                    beforeeventdropfinalize({ context }) {
                        beforeFinalize = context.async = true;
                        context.finalize(true);
                    }
                }
            });

            t.firesOnce(scheduler, 'eventdragstart', 'eventdragstart is fired');
            t.firesOnce(scheduler, 'eventdrop', 'eventdrop is fired');
            t.firesOnce(scheduler, 'beforeeventdrag', 'beforeeventdrag is fired');
            t.firesOnce(scheduler, 'aftereventdrop', 'aftereventdrop is fired');

            t.chain(
                { drag : '.b-sch-event', by : [100, 0] },
                () => {
                    t.is(beforeFinalize, true, 'beforeeventdropfinalize fired');
                }
            );
        });

        t.it('Assert drag events (sync)', async t => {
            scheduler = await setup({
                listeners : {
                    beforeeventdropfinalize({ context }) {
                        beforeFinalize = true;
                    }
                }
            });

            t.firesOnce(scheduler, 'eventdragstart', 'eventdragstart is fired');
            t.firesOnce(scheduler, 'eventdrop', 'eventdrop is fired');
            t.firesOnce(scheduler, 'beforeeventdrag', 'beforeeventdrag is fired');
            t.firesOnce(scheduler, 'aftereventdrop', 'aftereventdrop is fired');

            t.chain(
                { drag : '.b-sch-event', by : [100, 0] },
                () => {
                    t.is(beforeFinalize, true, 'beforeeventdropfinalize fired');
                }
            );
        });

        t.it('Proxy element should be removed when drop is cancelled asynchronously', async t => {
            scheduler = await setup({
                listeners : {
                    beforeeventdropfinalize({ context }) {
                        setTimeout(() => {
                            context.finalize(false);
                        }, 100);
                        context.async = true;
                    }
                }
            });

            // Get rid of changes from initial calculations
            scheduler.eventStore.commit();

            t.chain(
                { waitForEvent : [scheduler, 'aftereventdrop'], trigger : { drag : '.b-sch-event', by : [20, 0] } },

                () => {
                    t.notOk(scheduler.eventStore.changes, 'No modified records');

                    // https://www.assembla.com/spaces/bryntum/tickets/1524#/activity/ticket
                    const dragProxyElement = document.querySelector('.b-sch-dragproxy');
                    t.notOk(dragProxyElement, 'Drag proxy gone');
                }
            );
        });

        t.it('Assert resize events (async)', async t => {
            scheduler = await setup({
                listeners : {
                    beforeeventresizefinalize({ context }) {
                        beforeFinalize = context.async = true;
                        context.finalize(true);
                    }
                }
            });

            t.firesOnce(scheduler, 'beforeeventresize', 'beforeeventresize is fired');
            t.firesOnce(scheduler, 'eventresizestart', 'eventresizestart is fired');
            t.firesOnce(scheduler, 'eventresizeend', 'eventresizeend is fired');
            t.firesAtLeastNTimes(scheduler, 'eventpartialresize', 1, 'eventpartialresize is fired');

            t.chain(
                { moveCursorTo : '.b-sch-event' },
                { drag : '.b-sch-event', by : [100, 0], offset : ['100%-3', 5] },
                () => {
                    t.is(beforeFinalize, true, 'beforeeventresizefinalize fired');
                }
            );
        });

        t.it('Assert resize events (sync)', async t => {
            scheduler = await setup({
                listeners : {
                    beforeeventresizefinalize() {
                        beforeFinalize = true;
                    }
                }
            });

            t.firesOnce(scheduler, 'beforeeventresize', 'beforeeventresize is fired');
            t.firesOnce(scheduler, 'eventresizestart', 'eventresizestart is fired');
            t.firesOnce(scheduler, 'eventresizeend', 'eventresizeend is fired');
            t.firesAtLeastNTimes(scheduler, 'eventpartialresize', 1, 'eventpartialresize is fired');

            t.chain(
                { moveCursorTo : '.b-sch-event' },
                { drag : '.b-sch-event', by : [100, 0], offset : ['100%-3', 5] },
                () => {
                    t.is(beforeFinalize, true, 'beforeeventresizefinalize fired');
                }
            );
        });

        // https://github.com/bryntum/support/issues/865
        t.it('afterEventDrop should be fired when event is dropped outside the timeline', async t => {
            scheduler = await setup({
                features : {
                    eventDrag : {
                        constrainDragToTimeline : false
                    }
                }
            });

            t.firesOnce(scheduler, 'afterEventDrop', 'afterEventDrop is fired');

            t.isFiredWithSignature(scheduler, 'afterEventDrop', ({ valid }) => {
                return valid === false;
            }, 'Drop is invalid');

            t.chain(
                { drag : '.b-sch-event', to : '.b-sch-header-row .b-sch-header-timeaxis-cell' }
            );
        });
    });
});
