import { DomHelper } from '../../../build/scheduler.module.js?447702';

StartTest(t => {
    let scheduler;

    t.beforeEach(t => scheduler && scheduler.destroy());

    t.it('Removing a resource should translate other events to correct positions', async t => {
        scheduler = await t.getSchedulerAsync();

        const
            targetY = DomHelper.getTranslateY(document.querySelector('.event2')), // will be moved up here
            targetX = DomHelper.getTranslateX(document.querySelector('.event3')); // should still have this x

        scheduler.resourceStore.getAt(1).remove();

        t.chain(
            {
                waitFor : () => DomHelper.getTranslateY(document.querySelector('.event3')) === targetY,
                desc    : 'Event moved to correct y'
            },

            () => {
                t.is(DomHelper.getTranslateX(document.querySelector('.event3')), targetX, 'Also at correct x');
            }
        );
    });

    // https://app.assembla.com/spaces/bryntum/tickets/7421
    t.it('Adding an event should not use another events element', async t => {
        scheduler = await t.getSchedulerAsync({
            events : [
                { id : 'e1', resourceId : 'r1', startDate : new Date(2011, 0, 6), duration : 1 }
            ]
        });

        const firstEventElement = document.querySelector(scheduler.eventSelector);

        scheduler.eventStore.add({ id : 'e2', resourceId : 'r1', startDate : new Date(2011, 0, 4), duration : 1 });

        await t.waitForProjectReady();

        t.is(firstEventElement.dataset.eventId, 'e1', 'Element still used for same event');
    });

    // https://app.assembla.com/spaces/bryntum/tickets/7263
    t.it('Assigning an unassigned event should not use another events element', async t => {
        scheduler = await t.getSchedulerAsync({
            events : [
                { id : 'e1', resourceId : 'r1', startDate : new Date(2011, 0, 6), duration : 1 }
            ]
        });

        const firstEventElement = document.querySelector(scheduler.eventSelector);

        const [e2]    = scheduler.eventStore.add({ id : 'e2', startDate : new Date(2011, 0, 4), duration : 1 });
        e2.resourceId = 'r1';

        await t.waitForProjectReady();

        t.is(firstEventElement.dataset.eventId, 'e1', 'Element still used for same event');
    });

    // https://app.assembla.com/spaces/bryntum/tickets/8365
    t.it('Style should be cleared on element reusage', async t => {
        scheduler = await t.getSchedulerAsync({
            startDate : new Date(2011, 0, 1),
            endDate   : new Date(2011, 1, 31),

            events : [
                {
                    id         : 'e1',
                    resourceId : 'r1',
                    startDate  : new Date(2011, 0, 6),
                    duration   : 1,
                    style      : 'background-color : red'
                },
                { id : 'e2', resourceId : 'r1', startDate : new Date(2011, 1, 20), duration : 1 }
            ]
        });

        t.chain(
            { waitForSelector : scheduler.unreleasedEventSelector },
            () => {
                const async = t.beginAsync();

                // Cannot jump there directly, does not reproduce the bug
                function scroll() {
                    scheduler.subGrids.normal.scrollable.x += 400;

                    if (scheduler.subGrids.normal.scrollable.x < 4800) {
                        requestAnimationFrame(scroll);
                    }
                    else {
                        t.notOk(document.querySelector('.b-sch-event').style.backgroundColor, 'Style not set');

                        t.endAsync(async);
                    }
                }

                requestAnimationFrame(scroll);
            }
        );

    });
});
