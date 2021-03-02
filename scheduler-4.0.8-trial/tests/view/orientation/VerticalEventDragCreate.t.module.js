import { Rectangle } from '../../../build/scheduler.module.js?447702';

StartTest(t => {
    let scheduler;

    // async beforeEach doesn't work in umd
    t.beforeEach(async(t, next) => {
        scheduler && scheduler.destroy();

        document.body.innerHTML = '';

        scheduler = await t.getVerticalSchedulerAsync({
            features : {
                eventEdit : false
            }
        });

        next();
    });

    function assertEventElement(t, eventId, top = null, left, width, height, msg = `for event ${eventId}`) {
        const selector = `[data-event-id="${eventId}"]:not(.b-released)`;

        if (top === null) {
            t.selectorNotExists(selector, 'Element not found');
        }
        else {
            const element = document.querySelector(selector);

            t.ok(element, 'Element found ' + msg);

            const box = Rectangle.from(element, scheduler.timeAxisSubGridElement);

            t.is(box.top, top, 'Correct top');
            t.is(box.left, left, 'Correct left');
            t.is(box.width, width, 'Correct width');
            t.is(box.height, height, 'Correct height');
        }
    }

    t.it('Basic drag creation', t => {
        t.chain(
            { drag : '.b-sch-timeaxis-cell', by : [10, 100], offset : [10, 50] },

            () => {
                t.is(scheduler.eventStore.last.startDate, new Date(2019, 4, 27), 'Correct startDate');
                t.is(scheduler.eventStore.last.endDate, new Date(2019, 4, 29), 'Correct endDate');
                assertEventElement(t, 1, 100, 75, 75, 100);
                assertEventElement(t, 2, 150, 0, 75, 200);
                assertEventElement(t, scheduler.eventStore.last.id, 50, 0, 75, 100);
            }
        );
    });

    t.it('Drag creation triggering scroll', t => {
        scheduler.eventStore.removeAll();

        t.chain(
            { drag : '.b-sch-timeaxis-cell', fromOffset : [10, 400], to : '.b-scheduler', toOffset : [140, '100%-25'] },

            { waitForSelector : '.b-sch-event' },

            () => {
                const event = scheduler.eventStore.last;

                t.is(event.startDate, new Date(2019, 5, 3), 'Correct startDate');
                t.isGreater(event.endDate, new Date(2019, 5, 15), 'Likely correct endDate');

                const box = Rectangle.from(document.querySelector(`[data-event-id="${event.id}"]:not(.b-released)`), scheduler.timeAxisSubGridElement);

                t.is(box.top, 400, 'Correct top');
                t.is(box.left, 0, 'Correct left');
                t.is(box.width, 150, 'Correct width');
                t.isGreater(box.height, 600, 'Likely correct height');
            }
        );
    });

    t.it('Drag creation in a scrolled view', async t => {
        scheduler.scrollLeft = 300;
        scheduler.scrollTop = 300;

        await scheduler.await('scroll');
        await scheduler.await('horizontalScroll');

        t.chain(
            { drag : '.b-sch-timeaxis-cell', by : [10, 100], offset : [310, 350] },

            () => {
                t.is(scheduler.eventStore.last.startDate, new Date(2019, 5, 2), 'Correct startDate');
                t.is(scheduler.eventStore.last.endDate, new Date(2019, 5, 4), 'Correct endDate');
                assertEventElement(t, scheduler.eventStore.last.id, 350, 300, 150, 100);
            }
        );
    });

    // https://github.com/bryntum/support/issues/1009
    t.it('Should work on scrolled page', async t => {
        scheduler.destroy();

        document.body.innerHTML = '<div style="height : 1000px"></div><div id="container"></div>';

        scheduler = await t.getVerticalSchedulerAsync({
            appendTo : 'container',
            width    : 1024,
            height   : 768,
            features : {
                eventEdit : false
            }
        });

        window.scroll(0, 500);

        t.chain(
            { drag : '.b-sch-timeaxis-cell', by : [10, 100], offset : [310, 350] },

            () => {
                t.is(scheduler.eventStore.last.startDate, new Date(2019, 5, 2), 'Correct startDate');
                t.is(scheduler.eventStore.last.endDate, new Date(2019, 5, 4), 'Correct endDate');
                assertEventElement(t, scheduler.eventStore.last.id, 350, 300, 150, 100);
            }
        );
    });
});
