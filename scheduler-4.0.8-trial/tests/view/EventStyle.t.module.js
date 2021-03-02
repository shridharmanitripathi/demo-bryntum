import { DependencyStore, EventStore, ResourceStore, PresetManager, Scheduler, BrowserHelper } from '../../build/scheduler.module.js?447702';

StartTest(t => {
    Object.assign(window, {
        Scheduler,
        EventStore,
        ResourceStore,
        DependencyStore,
        PresetManager
    });

    let scheduler;

    t.beforeEach(() => scheduler && scheduler.destroy());

    t.it('Should support setting eventColor to known value with eventStyle colored', async t => {
        scheduler = t.getScheduler({
            startDate : new Date(2011, 0, 2),
            events    : [
                {
                    id         : 'e4-1',
                    startDate  : '2011-01-03',
                    endDate    : '2011-01-04',
                    eventColor : 'red',
                    eventStyle : 'colored',
                    resourceId : 'r1'
                }
            ]
        });

        await t.waitForSelector('.b-sch-event');

        const barEl = t.query('.b-sch-event')[0];

        t.is(window.getComputedStyle(barEl).backgroundColor, 'rgb(255, 231, 231)', 'Background');
        t.is(window.getComputedStyle(barEl).borderLeftColor, 'rgb(255, 96, 96)', 'Border left');
    });

    !(BrowserHelper.isIE11 || BrowserHelper.isEdge) && t.it('Should support setting eventColor to hex value with eventStyle colored', async t => {
        scheduler = t.getScheduler({
            startDate : new Date(2011, 0, 2),
            events    : [
                {
                    id         : 'e4-1',
                    startDate  : '2011-01-03',
                    endDate    : '2011-01-04',
                    eventColor : '#333',
                    eventStyle : 'colored',
                    resourceId : 'r1'
                }
            ]
        });

        await t.waitForSelector('.b-sch-event');

        const barEl = t.query('.b-sch-event')[0];

        t.is(window.getComputedStyle(barEl).backgroundColor, 'rgb(51, 51, 51)', 'Background');
        t.is(window.getComputedStyle(barEl).borderLeftColor, 'rgb(51, 51, 51)', 'Border left');
    });
});
