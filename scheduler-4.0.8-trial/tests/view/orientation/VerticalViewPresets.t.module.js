import { Rectangle } from '../../../build/scheduler.module.js?447702';

StartTest(t => {
    let scheduler;

    t.beforeEach(t => {
        scheduler && scheduler.destroy();
    });

    async function createScheduler(config = {}) {
        scheduler = await t.getVerticalSchedulerAsync(config);
    }

    function assertEventElement(t, eventId, x = null, y, width, height, msg = '') {
        const selector = `[data-event-id="${eventId}"]:not(.b-released)`;

        if (x === null) {
            t.selectorNotExists(selector, 'Element not found ' + msg);
        }
        else {
            const element = document.querySelector(selector);

            t.ok(element, 'Element found ' + msg);

            const box = Rectangle.from(element, scheduler.timeAxisSubGridElement);

            t.isApprox(box.left, x, 'Correct x');
            t.isApprox(box.top, y, 'Correct y');
            t.isApprox(box.width, width, 'Correct width');
            t.isApprox(box.height, height, 'Correct height');
        }
    }

    t.it('secondAndMinute', async t => {
        const tickHeight = 40;

        await createScheduler({
            viewPreset : 'secondAndMinute',

            startDate : new Date(2019, 5, 1, 10),
            endDate   : new Date(2019, 5, 1, 10, 10), // 6 * 10 = 60 ticks

            events : [
                { id             : 1,
                    resourceId   : 'r1',
                    startDate    : new Date(2019, 5, 1, 10, 1),
                    duration     : 1,
                    durationUnit : 'minute'
                }
            ]
        });

        t.is(scheduler.timeAxisSubGridElement.offsetHeight, 60 * tickHeight + 1, 'Correct height');

        assertEventElement(t, 1, 0, 6 * tickHeight, 150, 6 * tickHeight);
    });

    t.it('minuteAndHour', async t => {
        const tickHeight = 60;

        await createScheduler({
            viewPreset : 'minuteAndHour',

            startDate : new Date(2019, 5, 1, 10),
            endDate   : new Date(2019, 5, 1, 20), // 10 * 2 = 20 ticks

            events : [
                { id : 1, resourceId : 'r1', startDate : new Date(2019, 5, 1, 11), duration : 1, durationUnit : 'hour' }
            ]
        });

        t.is(scheduler.timeAxisSubGridElement.offsetHeight, 20 * tickHeight + 1, 'Correct height');

        assertEventElement(t, 1, 0, 2 * tickHeight, 150, 2 * tickHeight);
    });

    t.it('hourAndDay', async t => {
        const tickHeight = 40;

        await createScheduler({
            viewPreset : 'hourAndDay',

            startDate : new Date(2019, 5, 1),
            endDate   : new Date(2019, 5, 4), // 3 * 24 = 72 ticks

            events : [
                { id : 1, resourceId : 'r1', startDate : new Date(2019, 5, 1, 11), duration : 2, durationUnit : 'hour' }
            ]
        });

        t.is(scheduler.timeAxisSubGridElement.offsetHeight, 72 * tickHeight + 1, 'Correct height');

        assertEventElement(t, 1, 0, 11 * tickHeight, 150, 2 * tickHeight);
    });

    t.it('dayAndWeek', async t => {
        const tickHeight = 80;

        await createScheduler({
            viewPreset : 'dayAndWeek',

            startDate : new Date(2019, 5, 2),
            endDate   : new Date(2019, 5, 23), // 21 ticks

            events : [
                { id : 1, resourceId : 'r1', startDate : new Date(2019, 5, 3), duration : 2, durationUnit : 'days' }
            ]
        });

        t.is(scheduler.timeAxisSubGridElement.offsetHeight, 21 * tickHeight + 1, 'Correct height');

        assertEventElement(t, 1, 0, tickHeight, 150, 2 * tickHeight);
    });

    t.it('weekAndDay', async t => {
        const tickHeight = 80;

        await createScheduler({
            viewPreset : 'weekAndDay',

            startDate : new Date(2019, 5, 2),
            endDate   : new Date(2019, 5, 23), // 21 ticks

            events : [
                { id : 1, resourceId : 'r1', startDate : new Date(2019, 5, 3), duration : 2, durationUnit : 'days' }
            ]
        });

        t.is(scheduler.timeAxisSubGridElement.offsetHeight, 21 * tickHeight + 1, 'Correct height');

        assertEventElement(t, 1, 0, tickHeight, 150, 2 * tickHeight);
    });

    t.it('weekAndMonth', async t => {
        const tickHeight = 105;

        await createScheduler({
            viewPreset : 'weekAndMonth',

            startDate : new Date(2019, 5, 2),
            endDate   : new Date(2019, 9, 1), // 18 ticks

            events : [
                { id : 1, resourceId : 'r1', startDate : new Date(2019, 5, 9), duration : 1, durationUnit : 'week' }
            ]
        });

        t.is(scheduler.timeAxisSubGridElement.offsetHeight, 18 * tickHeight + 1, 'Correct height');

        assertEventElement(t, 1, 0, tickHeight, 150, tickHeight);
    });

    t.it('monthAndYear', async t => {
        const tickHeight = 110;

        await createScheduler({
            viewPreset : 'monthAndYear',

            startDate : new Date(2019, 5, 1),
            endDate   : new Date(2021, 6, 1), // 25 ticks

            events : [
                { id : 1, resourceId : 'r1', startDate : new Date(2019, 6, 1), duration : 3, durationUnit : 'months' }
            ]
        });

        t.is(scheduler.timeAxisSubGridElement.offsetHeight, 25 * tickHeight + 1, 'Correct height');

        assertEventElement(t, 1, 0, tickHeight, 150, 3 * tickHeight);
    });

    t.it('year', async t => {
        const tickHeight = 100;

        await createScheduler({
            viewPreset : 'year',

            startDate : new Date(2019, 1, 1),
            endDate   : new Date(2022, 12, 31), // 17 ticks

            events : [
                { id : 1, resourceId : 'r1', startDate : new Date(2019, 6, 1), duration : 3, durationUnit : 'quarters' }
            ]
        });

        t.is(scheduler.timeAxisSubGridElement.offsetHeight, 17 * tickHeight + 1, 'Correct height');

        assertEventElement(t, 1, 0, 2 * tickHeight, 150, 3 * tickHeight);
    });

    t.it('manyYears', async t => {
        const tickHeight = 50;

        await createScheduler({
            viewPreset : 'manyYears',

            startDate : new Date(2010, 1, 1),
            endDate   : new Date(2030, 12, 31), // 22 ticks

            events : [
                { id : 1, resourceId : 'r1', startDate : new Date(2010, 6, 1), duration : 4, durationUnit : 'years' }
            ]
        });

        t.is(scheduler.timeAxisSubGridElement.offsetHeight, 22 * tickHeight + 1, 'Correct height');

        assertEventElement(t, 1, 0, tickHeight / 2, 150, 4 * tickHeight);
    });

    t.it('weekAndDayLetter', async t => {
        const tickHeight = 50;

        await createScheduler({
            viewPreset : 'weekAndDayLetter',

            startDate : new Date(2019, 5, 1),
            endDate   : new Date(2019, 6, 30), // 70 ticks

            events : [
                { id : 1, resourceId : 'r1', startDate : new Date(2019, 5, 10), duration : 5, durationUnit : 'd' }
            ]
        });

        t.is(scheduler.timeAxisSubGridElement.offsetHeight, 70 * tickHeight + 1, 'Correct height');

        assertEventElement(t, 1, 0, 15 * tickHeight, 150, 5 * tickHeight);
    });

    t.it('weekDateAndMonth', async t => {
        const tickHeight = 40;

        await createScheduler({
            viewPreset : 'weekDateAndMonth',

            startDate : new Date(2019, 5, 1),
            endDate   : new Date(2019, 9, 30), // 23 ticks

            events : [
                { id : 1, resourceId : 'r1', startDate : new Date(2019, 5, 16), duration : 2, durationUnit : 'w' }
            ]
        });

        t.is(scheduler.timeAxisSubGridElement.offsetHeight, 23 * tickHeight + 1, 'Correct height');

        assertEventElement(t, 1, 0, 3 * tickHeight, 150, 2 * tickHeight);
    });

    t.it('weekDateAndMonth', async t => {
        const tickHeight = 40;

        await createScheduler({
            viewPreset : 'weekDateAndMonth',

            startDate : new Date(2019, 5, 1),
            endDate   : new Date(2019, 9, 30), // 23 ticks

            events : [
                { id : 1, resourceId : 'r1', startDate : new Date(2019, 5, 16), duration : 2, durationUnit : 'w' }
            ]
        });

        t.is(scheduler.timeAxisSubGridElement.offsetHeight, 23 * tickHeight + 1, 'Correct height');

        assertEventElement(t, 1, 0, 3 * tickHeight, 150, 2 * tickHeight);
    });

});
