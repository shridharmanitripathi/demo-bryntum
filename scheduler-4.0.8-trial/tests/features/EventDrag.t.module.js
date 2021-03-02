import { AssignmentModel, EventModel, ResourceModel, Rectangle, DateHelper, VersionHelper } from '../../build/scheduler.module.js?447702';

StartTest({ defaultTimeout : 90000 }, t => {
    let scheduler;

    t.beforeEach(() => scheduler?.destroy());

    async function getScheduler(config) {
        scheduler = t.getScheduler(Object.assign({
            features : {
                eventDrag : true
            }
        }, config));

        await t.waitForProjectReady(scheduler);
    }

    t.it('CSS classes + styling sanity checks', async t => {
        await getScheduler({
            features : {
                eventDrag : true
            },
            events : [
                {
                    resourceId : 'r1',
                    startDate  : new Date(2011, 0, 6),
                    endDate    : new Date(2011, 0, 7)
                },
                {
                    resourceId : 'r1',
                    startDate  : new Date(2011, 0, 6),
                    endDate    : new Date(2011, 0, 7)
                }
            ]
        });

        t.chain(
            { drag : scheduler.eventSelector, by : [20, 0], dragOnly : true },

            { waitForSelector : scheduler.eventSelector + '.b-dragging', desc : 'CSS classes applied to event' },
            { waitForSelector : '.b-scheduler.b-dragging-event', desc : 'CSS classes applied to scheduler' },

            next => {
                const dragProxyStyles    = window.getComputedStyle(document.querySelector(scheduler.eventSelector + '.b-dragging')),
                    regularEventStyles = window.getComputedStyle(document.querySelector(scheduler.eventSelector + ':not(.b-dragging)'));

                t.selectorNotExists('.b-drag-invalid');

                t.isGreater(parseInt(dragProxyStyles.zIndex, 10), parseInt(regularEventStyles.zIndex, 10), 'Dragged event has higher z-index');

                next();
            },

            { mouseUp : null },

            () => {
                t.selectorNotExists('.b-dragging');
                t.selectorNotExists('.b-drag-invalid');
                t.selectorNotExists('.b-dragging-event');
            }
        );
    });

    t.it('Should abort on ESC keypress and restore dependencies', async t => {
        await getScheduler({
            features : {
                eventDrag    : true,
                dependencies : true
            },
            events : [
                {
                    id         : 1,
                    resourceId : 'r1',
                    startDate  : new Date(2011, 0, 6),
                    endDate    : new Date(2011, 0, 7)
                },
                {
                    id         : 2,
                    resourceId : 'r1',
                    startDate  : new Date(2011, 0, 6),
                    endDate    : new Date(2011, 0, 7)
                }
            ],
            dependencies : [
                {
                    from : 1,
                    to   : 2
                }
            ]
        });

        const
            eventEls     = scheduler.eventStore.map(e => scheduler.getElementFromEventRecord(e)),
            eventElRects = eventEls.map(e => Rectangle.from(e));

        t.wontFire(scheduler.eventStore, 'update');

        t.chain(
            { drag : scheduler.eventSelector, by : [20, 0], dragOnly : true },

            (next) => {
                t.firesOnce(scheduler, 'dependenciesDrawn');
                next();
            },
            { type : '[ESC]' },

            // There really is no alternative here. The element has a transition
            // on its transform style, so we have to wait for its rectangle to settle back.
            { waitFor : 500 },

            () => {
                const
                    endingEventEls    = scheduler.eventStore.map(e => scheduler.getElementFromEventRecord(e)),
                    endingEventElRecs = endingEventEls.map(e => Rectangle.from(e));

                // Same number of elements, and all in the same place.
                t.is(scheduler.timeAxisSubGridElement.querySelectorAll(scheduler.eventSelector).length, eventEls.length);
                t.is(endingEventEls.length, eventEls.length);
                for (let i = 0; i < eventEls.length; i++) {
                    t.isApproxRect(endingEventElRecs[i],  eventElRects[i], 1, `Event rect is the same`);
                }
            }
        );
    });

    t.it('Drag and drop with validator function', async t => {
        let counter = 0;

        const dragFn = ({ eventRecords, assignmentRecords, newResource, startDate, duration, draggedRecords }, e) => {
            t.ok(draggedRecords[0].isEvent, 'draggedRecords is an array of Event records (deprecated)');

            if (draggedRecords && VersionHelper.checkVersion('scheduler', '5.0.0', '>=')) {
                t.fail('Deprecated `draggedRecords` should be removed!');
            }

            if ((counter % 200) === 0) {
                t.isInstanceOf(eventRecords[0], EventModel, 'Correct function arguments 1');
                t.isInstanceOf(assignmentRecords[0], AssignmentModel, 'Correct function arguments 2');
                t.isInstanceOf(newResource, ResourceModel, 'Correct function arguments 3');
                t.isInstanceOf(startDate, Date, 'Correct function arguments 4');
                t.ok(typeof duration === 'number', 'Correct function arguments 5');
                t.isInstanceOf(e, Event, 'Correct function arguments 6');
            }

            counter++;

            return startDate <= new Date(2011, 0, 6);
        };

        await getScheduler({
            features : {
                eventDrag : {
                    validatorFn : dragFn
                }
            },
            events : [
                {
                    id         : 1,
                    resourceId : 'r1',
                    startDate  : new Date(2011, 0, 6),
                    endDate    : new Date(2011, 0, 7)
                }
            ]
        });

        const evt = scheduler.eventStore.first;

        t.chain(
            { drag : scheduler.eventSelector, by : [100, 0] },

            next => {
                t.isGreater(evt.endDate, new Date(2011, 0, 6), 'Task dragged properly');

                next();
            },

            { waitForSelectorNotFound : '.b-dragging' },
            { waitForSelectorNotFound : '.b-drag-invalid' },

            { drag : scheduler.eventSelector, by : [300, 0] },

            { moveCursorTo : scheduler.eventSelector },

            next => {
                t.isLess(evt.endDate, new Date(2011, 0, 8), 'Task not dragged.');

                next();
            },

            { drag : scheduler.eventSelector, by : [20, 0] }
        );
    });

    t.it('Drag and drop with constraining dates (horizontal)', async t => {
        await getScheduler({
            startDate : new Date(2011, 0, 3),
            events    : [
                {
                    id         : 1,
                    resourceId : 'r1',
                    startDate  : new Date(2011, 0, 6),
                    endDate    : new Date(2011, 0, 7)
                }
            ],

            // Constrain events within their current day
            getDateConstraints(resourceRecord, eventRecord) {
                if (eventRecord) {
                    return doConstraining ? {
                        start : new Date(2011, 0, 6),
                        end   : new Date(2011, 0, 7)
                    } : null;
                }
            }
        });

        const
            { tickSize }           = scheduler,
            draggedEvent           = scheduler.eventStore.first,
            { startDate, endDate } = draggedEvent;

        let doConstraining = true;

        t.willFireNTimes(scheduler.eventStore, 'change', 2);

        t.chain(
            next => {
                t._region = document.querySelector(scheduler.eventSelector).getBoundingClientRect();

                next();
            },

            { drag : scheduler.eventSelector, by : [-tickSize, 0], dragOnly : true },

            next => {
                const region = document.querySelector('.b-dragging').getBoundingClientRect();
                t.isApprox(region.left, t._region.left, 1, 'Task constrained left properly');

                next();
            },

            { action : 'mouseUp' },

            next => {
                // Must not have moved
                t.is(draggedEvent.startDate, startDate);
                t.is(draggedEvent.endDate, endDate);
                next();
            },

            { drag : scheduler.eventSelector, by : [tickSize, 0], dragOnly : true },

            next => {
                const region = document.querySelector('.b-dragging').getBoundingClientRect();
                t.isApprox(region.right, t._region.right, 1, 'Task constrained right properly');
                next();
            },

            { action : 'mouseUp' },

            next => {
                // Must not have moved
                t.is(draggedEvent.startDate, startDate);
                t.is(draggedEvent.endDate, endDate);

                doConstraining = false;
                next();
            },

            // This drag should move the event
            { drag : scheduler.eventSelector, by : [-tickSize, 0], dragOnly : true },

            next => {
                const region = document.querySelector('.b-dragging').getBoundingClientRect();
                t.isApprox(region.left, t._region.left - tickSize, 1, 'Task not constrained');

                next();
            },

            { action : 'mouseUp' },

            next => {
                // Must have moved
                t.is(draggedEvent.startDate, DateHelper.add(startDate, -1, 'day'));
                t.is(draggedEvent.endDate, DateHelper.add(endDate, -1, 'day'));

                doConstraining = false;
                next();
            },

            // This drag should move the event
            { drag : scheduler.eventSelector, by : [tickSize * 2, 0], dragOnly : true },

            next => {
                const region = document.querySelector('.b-dragging').getBoundingClientRect();
                t.isApprox(region.left, t._region.left + tickSize, 1, 'Task not constrained');

                next();
            },

            { action : 'mouseUp' },

            next => {
                // Must have moved
                t.is(draggedEvent.startDate, DateHelper.add(startDate, 1, 'day'));
                t.is(draggedEvent.endDate, DateHelper.add(endDate, 1, 'day'));

                doConstraining = false;
                next();
            }
        );
    });

    t.it('Should not be possible to drag event to group header', async t => {
        await getScheduler({
            startDate  : new Date(2011, 0, 3),
            viewPreset : 'hourAndDay',
            events     : [{
                id         : 1,
                name       : 'Event',
                resourceId : 'r1',
                startDate  : new Date(2011, 0, 3, 4, 13, 18),
                endDate    : new Date(2011, 0, 3, 6)
            }],
            features : {
                group     : 'name',
                eventDrag : true
            }
        });

        const record = scheduler.eventStore.first;

        t.chain(
            { drag : scheduler.eventSelector, to : '.b-grid-subgrid-normal .b-group-row', toOffset : [100, '50%'] },
            () => {
                t.notOk(record.isModified, 'Record has not been changed');
            }
        );
    });

    t.it('Drag and drop with showExactDropPosition w/o snapRelativeToEventStartDate (horizontal)', async t => {
        await getScheduler({
            appendTo   : document.body,
            startDate  : new Date(2011, 0, 3),
            viewPreset : 'hourAndDay',
            events     : [{
                id         : 1,
                name       : 'Event',
                resourceId : 'r1',
                startDate  : new Date(2011, 0, 3, 4, 13, 18),
                endDate    : new Date(2011, 0, 3, 6)
            }],
            features : {
                eventDrag : {
                    showExactDropPosition : true
                }
            }
        });

        const
            tickSize = scheduler.timeAxisViewModel.tickSize,
            record   = scheduler.eventStore.first;

        t.chain(
            { drag : scheduler.eventSelector, by : [-0.2 * tickSize, 0] },
            next => {
                t.is(record.startDate, new Date(2011, 0, 3, 4), 'Event hasn\'t changed place');
                next();
            },
            { drag : scheduler.eventSelector, by : [-0.5 * tickSize, 0] },
            next => {
                t.is(record.startDate, new Date(2011, 0, 3, 3, 30), 'Event changed place');
                next();
            },
            { drag : scheduler.eventSelector, by : [-0.2 * tickSize, 0] },
            () => {
                t.is(record.startDate, new Date(2011, 0, 3, 3, 30), 'Event hasn\'t changed place');
            }
        );
    });

    t.it('Drag and drop with showExactDropPosition w/ snapRelativeToEventStartDate (horizontal)', async t => {
        await getScheduler({
            startDate  : new Date(2011, 0, 3),
            viewPreset : 'hourAndDay',
            events     : [{
                id         : 1,
                name       : 'Event',
                resourceId : 'r1',
                startDate  : new Date(2011, 0, 3, 4, 13, 18),
                endDate    : new Date(2011, 0, 3, 6)
            }],
            features : {
                eventDrag : { showExactDropPosition : true }
            },
            snapRelativeToEventStartDate : true
        });

        const
            tickSize = scheduler.timeAxisViewModel.tickSize,
            record   = scheduler.eventStore.first;

        t.chain(
            { drag : scheduler.eventSelector, by : [0.2 * tickSize, 0] },
            next => {
                t.is(record.startDate, new Date(2011, 0, 3, 4, 13, 18), 'Event hasn\'t changed place');
                next();
            },
            { drag : scheduler.eventSelector, by : [0.5 * tickSize, 0] },
            next => {
                t.is(record.startDate, new Date(2011, 0, 3, 4, 43, 18), 'Event changed place');
                next();
            },
            { drag : scheduler.eventSelector, by : [0.2 * tickSize, 0] },
            () => {
                t.is(record.startDate, new Date(2011, 0, 3, 4, 43, 18), 'Event hasn\'t changed place');
            }
        );
    });

    t.it('Proxy should follow mouse after scroll (horizontal)', async t => {
        await getScheduler({
            resourceStore : t.getResourceStore2({}, 30),
            features      : {
                eventDrag : true
            }
        });

        let startRect,
            proxy;

        t.chain(
            { drag : scheduler.eventSelector, by : [0, 30], dragOnly : true },
            next => {
                proxy = document.querySelector('.b-dragging');
                startRect = Rectangle.from(proxy, scheduler.timeAxisSubGridElement);
                t.isApproxPx(startRect.y, 40, 1);
                next();
            },
            next => {
                scheduler.timeAxisSubGridElement.scrollLeft = 100;
                next();
            },
            next => {
                const rect = Rectangle.from(proxy, scheduler.timeAxisSubGridElement);
                t.isApproxPx(rect.x, startRect.x, 1, 'Horizontal position hasn\'t changed');
                t.isApproxPx(rect.y, startRect.y, 1, 'Vertical position hasn\'t changed');
                next();
            },
            { moveMouseBy : [[0, 30]] },
            next => {
                const rect = Rectangle.from(proxy, scheduler.timeAxisSubGridElement);
                t.isApproxPx(rect.x, startRect.x, 1, 'Horizontal position hasn\'t changed');
                t.isApproxPx(rect.y, startRect.y + 30, 1, 'Vertical position hasn\'t changed');
                next();
            },
            { action : 'mouseUp' }
        );
    });

    t.it('ScrollManager should not be activated until drag actually starts', async t => {
        await getScheduler({
            width         : 400,
            startDate     : new Date(2017, 0, 1, 4),
            viewPreset    : 'hourAndDay',
            resourceStore : t.getResourceStore2({}, 1),
            events        : [
                {
                    resourceId : 'r1',
                    id         : 1,
                    startDate  : new Date(2017, 0, 1, 6),
                    endDate    : new Date(2017, 0, 1, 8)
                }
            ],
            features : {
                eventDrag   : true,
                eventResize : false
            }
        });

        t.wontFire(scheduler, 'eventdragstart');
        t.wontFire(scheduler.subGrids.normal.scrollable, 'scroll');

        t.chain(
            { drag : scheduler.eventSelector, by : [1, 0], fromOffset : ['100%-2', '50%'], dragOnly : true },

            { waitFor : 500, desc : 'Waiting for some time to make sure ScrollManager is not activated' }
        );
    });

    t.it('Should display correct drop position with snap (horizontal)', async t => {
        await getScheduler({
            viewPreset : 'weekAndDayLetter',
            snap       : true,
            features   : {
                eventDrag : {
                    showExactDropPosition : true
                }
            },
            eventRenderer : ({ eventRecord, resourceRecord, renderData }) => {
                renderData.cls['b-sch-event' + resourceRecord.id] = 1;
                return eventRecord.name;
            }
        });

        let testBox;

        t.chain(
            { waitForSelector : '.b-sch-eventr1' },
            next => {
                testBox = Rectangle.from(document.querySelector('.b-sch-eventr1'));
                next();
            },

            // Grab it on the left because allowOver means that the center is occluded by the event tip
            { drag : '.b-sch-eventr1', offset : ['0%+15', '50%'], by : [10, 0], dragOnly : true },

            {
                waitFor : () => {
                    const proxyBox = Rectangle.from(document.querySelector('.b-dragging'));

                    // The snapping to increment should mean that the proxy won't move only 10px.
                    // It has to be dragged past a snap point to jump to the next or previous day.
                    return Math.abs(proxyBox.x - testBox.x) < 1;
                },
                desc : 'Proxy unmoved after dragging 10px right'
            },

            { moveCursorBy : [[-20, 0]] },

            {
                waitFor : () => {
                    const proxyBox = Rectangle.from(document.querySelector('.b-dragging'));

                    // The snapping to increment should mean that the proxy won't move only 10px.
                    // It has to be dragged past a snap point to jump to the next or previous day.
                    return Math.abs(proxyBox.x - testBox.x) < 1;
                },
                desc : 'Proxy unmoved after subsequent drag 20px left'
            },

            { action : 'mouseUp' }
        );
    });

    // TODO: PORT vertical later
    t.xit('Should display correct drop position with snap (vertical)', t => {
        scheduler = getScheduler({
            viewPreset : 'weekAndDayLetter',
            mode       : 'vertical',
            snap       : true,
            features   : {
                eventDrag : {
                    showExactDropPosition : true
                }
            },
            eventRenderer : ({ item, record, renderData }) => {
                renderData.cls['b-sch-event' + record.id] = 1;
                return item.name;
            }
        });

        let testBox;

        t.chain(
            { waitForSelector : '.b-sch-eventr1' },
            next => {
                testBox = scheduler.el.down('.b-sch-eventr1').getBox();
                next();
            },
            { drag : '.sch-eventr1', by : [0, 10], dragOnly : true },
            next => {
                const proxyBox = scheduler.el.down('.x-dd-drag-ghost .sch-event').getBox();
                t.isDeeply(proxyBox, testBox, 'Proxy positioned correctly');
                next();
            },
            { moveCursorBy : [[0, -20]] },
            next => {
                const proxyBox = scheduler.el.down('.x-dd-drag-ghost .sch-event').getBox();
                t.isDeeply(proxyBox, testBox, 'Proxy positioned correctly');
                next();
            },
            { action : 'mouseUp' }
        );
    });
});
