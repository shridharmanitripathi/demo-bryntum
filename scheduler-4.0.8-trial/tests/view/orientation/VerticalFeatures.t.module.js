import { Rectangle } from '../../../build/scheduler.module.js?447702';

StartTest(t => {
    let scheduler;

    // async beforeEach doesn't work in umd
    t.beforeEach(async(t, next) => {
        scheduler && scheduler.destroy();

        scheduler = await t.getVerticalSchedulerAsync({
            features : {
                eventMenu          : true,
                eventDragCreate    : false, // Disabled to be able to use EventDragSelect
                eventDragSelect    : true,
                resourceTimeRanges : true,
                timeRanges         : true
            }
        });

        next();
    });

    function assertEventElement(t, event, top = null, left, width, height, msg = '') {
        const selector = `[data-event-id="${event.id}"]:not(.b-released)`;

        if (top === null) {
            t.selectorNotExists(selector, 'Element not found ' + msg);
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

    // Dependencies not supported by vertical
    // DependencyEdit not supported by vertical

    t.it('EventMenu sanity', t => {
        t.chain(
            { rightClick : '[data-event-id="1"]' },

            { waitForSelector : ':contains(Edit event)' }
        );
    });

    // EventDrag tested in VerticalEventDrag.t.js
    // EventDragCreate tested in VerticalEventDragCreate.t.js

    t.it('EventDragSelect sanity', t => {
        t.chain(
            { moveMouseTo : [400, 50] },

            { drag : '.b-sch-timeaxis-cell', offset : [50, 50], by : [150, 300] },

            () => {
                t.isDeeply(scheduler.selectedEvents, scheduler.eventStore.getRange(0, 3), 'Correct selection');

                t.selectorExists('[data-event-id="1"] .b-sch-event-selected', 'Element 1 has selection cls');
                t.selectorExists('[data-event-id="2"] .b-sch-event-selected', 'Element 1 has selection cls');
                t.selectorExists('[data-event-id="3"] .b-sch-event-selected', 'Element 1 has selection cls');
            }
        );
    });

    t.it('EventEdit sanity', t => {
        t.chain(
            { dblClick : '[data-event-id="1"]' },

            { click : '[data-ref="nameField"]' },

            { type : 'Hello', clearExisting : true },

            { click : 'button:contains(Save)' },

            () => {
                t.selectorExists('[data-event-id="1"]:textEquals(Hello)', 'Text updated');
            }
        );
    });

    t.it('EventFilter sanity', t => {
        t.chain(
            { rightClick : '.b-resourceheader-cell' },

            { moveMouseTo : '.b-menuitem:contains(Filter)' },

            { click : '.b-eventfilter input' },

            { type : 'Event 1[ENTER]', clearExisting : true },

            () => {
                t.selectorCountIs('.b-sch-event-wrap', 1, 'Single event element visible');
            }
        );
    });

    // EventResize is tested in VerticalEventResize.t.js

    t.it('EventTooltip sanity', t => {
        t.chain(
            { moveMouseTo : '.b-sch-event' },

            { waitForSelector : '.b-sch-event-tooltip' }
        );
    });

    t.it('TimeAxisHeaderMenu sanity', t => {
        t.chain(
            { rightClick : '.b-resourceheader-cell' },

            { waitForSelector : ':contains(Zoom)' }
        );
    });

    // TODO: NonWorkingTime

    t.it('Pan sanity', t => {
        scheduler && scheduler.destroy();

        scheduler = t.getVerticalScheduler({
            features : {
                eventDragCreate : false,
                pan             : true
            }
        });

        t.chain(
            { drag : '.b-sch-timeaxis-cell', offset : [400, 400], by : [-200, -150] },

            () => {
                t.is(scheduler.scrollLeft, 200, 'Correct scrollLeft');
                t.is(scheduler.scrollTop, 150, 'Correct scrollTop');
            }
        );
    });

    t.it('ResourceTimeRanges sanity', t => {
        const
            element = document.querySelector('.b-sch-resourcetimerange'),
            box = Rectangle.from(element, scheduler.timeAxisSubGridElement);

        t.is(box.left, 300, 'Correct left');
        t.is(box.top, 100, 'Correct top');
        t.is(box.width, 150, 'Correct width');
        t.is(box.height, 500, 'Correct height');
    });

    t.it('ScheduleMenu sanity', t => {
        t.chain(
            { rightClick : '.b-sch-timeaxis-cell', offset : [200, 60] },

            { click : '.b-menuitem:contains(Add event)' },

            { waitFor : () => scheduler.features.eventEdit.editor.containsFocus },
            { type : 'New test event' },

            { click : 'button:contains(Save)' },

            () => {
                assertEventElement(t, scheduler.eventStore.last, 50, 150, 150, 50);
            }
        );
    });

    t.it('ScheduleTooltip sanity', t => {
        t.chain(
            { moveMouseTo : [300, 100] },

            { waitForSelector : '.b-sch-scheduletip' },

            () => {
                t.selectorExists('.b-sch-clock-text:textEquals(May 27, 2019)', 'Correct text in tip');
            }
        );
    });

    t.it('SimpleEventEdit sanity', t => {
        scheduler && scheduler.destroy();

        scheduler = t.getVerticalScheduler({
            features : {
                eventEdit       : false,
                simpleEventEdit : true
            }
        });

        t.chain(
            { dblClick : '[data-event-id="1"]' },

            { type : 'Hello[ENTER]', clearExisting : true },

            () => {
                t.selectorExists('[data-event-id="1"]:textEquals(Hello)', 'Text updated');
            }
        );
    });

    t.it('TimeRanges sanity', t => {
        const [headerRange, bodyRange] = Array.from(document.querySelectorAll('.b-sch-range')).map(el => Rectangle.from(el, scheduler.timeAxisSubGridElement));
        const [headerLine, bodyLine] = Array.from(document.querySelectorAll('.b-sch-line')).map(el => Rectangle.from(el, scheduler.timeAxisSubGridElement));

        t.is(headerRange.top, 150, 'Range header y correct');
        t.is(bodyRange.top, 150, 'Range body y correct');
        t.is(headerRange.height, 200, 'Range header height correct');
        t.is(bodyRange.height, 200, 'Range body height correct');
        t.is(bodyRange.width, 1350, 'Range body width correct');

        t.is(headerLine.top, 550, 'Line header y correct');
        t.is(bodyLine.top, 550, 'Line body y correct');
        // Not checking header, since it has a label
        t.is(bodyLine.height, 2, 'Line body height correct');
        t.is(bodyLine.width, 1350, 'Line body width correct');
    });

    t.it('Should show both vertical and horizontal column lines', async t => {
        t.selectorCountIs('.b-column-line-major', 2);
        t.selectorCountIs('.b-column-line', 21);
        t.selectorCountIs('.b-resource-column-line', 8);

        // 0 - 7
        const
            expectedInitialOffsets = [149, 299, 449, 599, 749, 899, 1049, 1199],
            initialOffsets          = t.query('.b-resource-column-line').map(line => line.offsetLeft);

        t.isDeeply(initialOffsets, expectedInitialOffsets, 'Correct positions initially');

        await scheduler.scrollResourceIntoView(scheduler.resourceStore.last, { animate : false });
        await t.waitForAnimationFrame();

        // 1 - 8
        const
            expectedOffsets = [1349, 299, 449, 599, 749, 899, 1049, 1199],
            offsets          = t.query('.b-resource-column-line').map(line => line.offsetLeft);

        t.isDeeply(offsets, expectedOffsets, 'Correct positions after scroll');

    });
});
