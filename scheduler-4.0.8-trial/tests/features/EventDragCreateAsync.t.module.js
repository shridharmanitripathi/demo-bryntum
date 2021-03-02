import { ResizeHelper } from '../../build/scheduler.module.js?447702';

StartTest(t => {
    let resetCallCount,
        scheduler,
        oldReset = ResizeHelper.prototype.reset;

    ResizeHelper.prototype.reset = function() {
        ++resetCallCount;
        oldReset.call(this);
    };

    t.beforeEach(() => {
        scheduler && scheduler.destroy();
        resetCallCount = 0;
    });

    t.it('Should not be possible to drag create if one is in progress', async t => {
        let dragCreateContext;

        scheduler = t.getScheduler({
            events : []
        });

        await t.waitForProjectReady();

        scheduler.on({
            beforedragcreatefinalize({ context }) {
                context.async = true;
                dragCreateContext = context;
            },
            once : true
        });

        t.firesOk({
            observable : scheduler,
            events     : {
                beforedragcreate         : 3,
                dragcreatestart          : 3,
                dragcreateend            : 3,
                afterdragcreate          : 3,
                beforedragcreatefinalize : 3
            }
        });

        t.chain(
            // Kick off a drag create. It will be converted to async, and finalized later
            { drag : '.b-sch-timeaxis-cell', offset : [200, 50], by : [100, 0] },

            // Attempt another drag create while one is in progress - this should not work
            { drag : '.b-sch-timeaxis-cell', offset : [200, 100], by : [100, 0] },

            next => {
                t.is(scheduler.eventStore.count, 0, 'Second attempt to drag create failed');

                // Finish that first dragcreate
                dragCreateContext.finalize(true);

                t.is(scheduler.eventStore.count, 1, 'Only 1 event created');
                next();
            },

            next => {
                scheduler.on({
                    beforedragcreatefinalize({ context }) {
                        context.async = true;
                        dragCreateContext = context;
                    },
                    once : true
                });
                next();
            },

            // This one will also delay completing and creating the second event
            { drag : '.b-sch-timeaxis-cell', offset : [200, 100], by : [100, 0] },

            // These should not create a third event.
            { click : '.b-sch-timeaxis-cell', offset : [200, 150] },
            { drag : '.b-sch-timeaxis-cell', offset : [200, 150], by : [100, 0] },

            // Finish the second delayed dragcreate
            async() => {
                dragCreateContext.finalize(true);

                await t.waitForProjectReady();

                t.is(scheduler.eventStore.count, 2, '2nd event created');
            },

            { drag : '.b-sch-timeaxis-cell', offset : [200, 250], by : [100, 0] },

            () => {
                t.is(scheduler.eventStore.count, 3, '3rd event created');
            }
        );
    });

    t.it('Event resize during drag create should be possible', async t => {
        let dragCreateContext;

        scheduler = t.getScheduler({
            events : [
                {
                    resourceId : 'r1',
                    startDate  : '2011-01-04',
                    endDate    : '2011-01-05',
                    cls        : 'event-1',
                    id         : 1
                }
            ]
        });

        await t.waitForProjectReady();

        scheduler.on({
            beforedragcreatefinalize({ context }) {
                context.async = true;
                dragCreateContext = context;
            },
            once : true
        });

        t.firesOk({
            observable : scheduler,
            events     : {
                beforedragcreate          : 2,
                dragcreatestart           : 2,
                dragcreateend             : 2,
                afterdragcreate           : 2,
                beforedragcreatefinalize  : 2,
                beforeeventresize         : 1,
                eventresizestart          : 1,
                eventresizeend            : 1,
                beforeeventresizefinalize : 1
            }
        });

        t.chain(
            // Kick off a drag create.
            // The once:true beforedragcreatefinalize handler above changes it to be async
            // and therefore need a programmatic call to its context.finalize method
            { drag : '.b-sch-timeaxis-cell', offset : [200, 200], by : [100, 0] },

            // While that drag create is outstanding, we resize another event
            { drag : '.event-1', offset : ['100%-5', '50%'], by : [100, 0] },

            // Then we finalize that drag create
            next => {
                dragCreateContext.finalize(true);

                t.is(resetCallCount, 2, 'reset was called once per operation (on resize)');
                next();
            },

            // Now a second drag create which will fully complete
            { drag : '.b-sch-timeaxis-cell', offset : [400, 200], by : [100, 0], desc : 'Initiate 2nd drag to check for fishy actions' },

            next => {
                t.is(resetCallCount, 3, 'reset was called once per resize operation (on resize)');
                t.is(scheduler.eventStore.count, 3, '2 new events created');
                next();
            }
        );
    });
});
