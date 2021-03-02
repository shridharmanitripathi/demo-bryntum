import { ResizeHelper, Scheduler, DateHelper } from '../../build/scheduler.module.js?447702';

StartTest(t => {
    const oldReset = ResizeHelper.prototype.reset;

    let scheduler,
        resetCallCount;

    ResizeHelper.prototype.reset = function() {
        ++resetCallCount;
        oldReset.call(this);
    };

    async function getScheduler(t, config = {}, nbrEvents) {
        const scheduler = t.getScheduler(config, nbrEvents);

        await t.waitForProjectReady();

        return scheduler;
    }

    t.beforeEach(() => {
        resetCallCount = 0;
        scheduler && scheduler.destroy();
    });

    t.it('Should not be possible to resize event if resize is in progress', async t => {
        scheduler = await getScheduler(t, {
            startDate  : new Date(2018, 4, 3),
            endDate    : new Date(2018, 4, 5),
            viewPreset : 'hourAndDay',
            events     : [
                {
                    startDate  : new Date(2018, 4, 3, 5),
                    endDate    : new Date(2018, 4, 3, 8),
                    id         : 1,
                    cls        : 'event-1',
                    resourceId : 'r2'
                },
                {
                    startDate  : new Date(2018, 4, 3, 5),
                    endDate    : new Date(2018, 4, 3, 8),
                    id         : 2,
                    cls        : 'event-2',
                    resourceId : 'r3'
                }
            ]
        });

        let doFinalize = false;

        scheduler.on('beforeeventresizefinalize', ({ context }) => {
            context.async = true;

            t.waitFor(() => doFinalize, () => {
                context.finalize(true);
            });
        });

        const eventWidth = document.querySelector('.event-1').offsetWidth,
            event2Box = document.querySelector('.event-2').getBoundingClientRect();

        t.chain(
            { drag : '.event-1', offset : ['100%-5', '50%'], by : [100, 0] },
            { drag : [event2Box.right - 5, (event2Box.top + event2Box.bottom) / 2], offset : ['100%-5', '50%'], by : [100, 0] },
            { drag : [event2Box.right - 5, (event2Box.top + event2Box.bottom) / 2], offset : ['100%-5', '50%'], by : [100, 0] },
            next => {
                doFinalize = true;

                t.waitFor(() => resetCallCount === 1, () => {
                    const eventStore = scheduler.eventStore;

                    t.isGreater(eventStore.getAt(0).endDate, new Date(2018, 4, 3, 9), 'First event resized');
                    t.isGreater(document.querySelector('.event-1').offsetWidth, eventWidth, 'Event is visually bigger');
                    t.is(eventStore.getAt(1).endDate, new Date(2018, 4, 3, 8), 'Second event is not');
                    t.is(document.querySelector('.event-2').offsetWidth, eventWidth, 'Event is visually same');
                    next();
                });
            }
        );
    });

    t.it('Should be possible to resize when using AssignmentStore', t => {
        scheduler = new Scheduler({
            appendTo  : document.body,
            resources : [
                { id : 'r1', name : 'Mike' },
                { id : 'r2', name : 'Linda' }
            ],
            events : [
                {
                    id        : 1,
                    startDate : new Date(2017, 0, 1, 10),
                    endDate   : new Date(2017, 0, 1, 12)
                }
            ],
            assignments : [
                { resourceId : 'r1', eventId : 1 },
                { resourceId : 'r2', eventId : 1 }
            ],
            startDate             : new Date(2017, 0, 1, 6),
            endDate               : new Date(2017, 0, 1, 20),
            viewPreset            : 'hourAndDay',
            enableEventAnimations : false
        });

        t.chain(
            { waitForProjectReady : scheduler },

            { drag : '[data-event-id="1"]', offset : ['100%-5', 10], by : [65, 0] },

            () => {
                t.is(scheduler.eventStore.first.endDate, new Date(2017, 0, 1, 13), 'endDate updated');

                const [first, second] = Array.from(document.querySelectorAll('[data-event-id="1"]'));

                t.is(first.getBoundingClientRect().width, second.getBoundingClientRect().width, 'Both instances resized');
            }
        );
    });

    t.it('Resize should work with empty dependency store', t => {
        scheduler = new Scheduler({
            appendTo : document.body,
            features : {
                dependencies : true,
                eventTooltip : false
            },
            resources : [
                { id : 'r1', name : 'Mike' },
                { id : 'r2', name : 'Linda' }
            ],
            events : [
                {
                    id         : 1,
                    resourceId : 'r1',
                    startDate  : new Date(2017, 0, 1, 10),
                    endDate    : new Date(2017, 0, 1, 12)
                },
                {
                    id         : 2,
                    resourceId : 'r2',
                    startDate  : new Date(2017, 0, 1, 10),
                    endDate    : new Date(2017, 0, 1, 12)
                }
            ],
            startDate             : new Date(2017, 0, 1, 6),
            endDate               : new Date(2017, 0, 1, 20),
            viewPreset            : 'hourAndDay',
            enableEventAnimations : false
        });

        t.firesOnce(scheduler, 'eventresizeend');

        t.chain(
            { waitForProjectReady : scheduler },

            { drag : '.b-sch-event', fromOffset : ['100%-5', '50%'], by : [50, 0] }
        );
    });

    t.it('Resize should not leave extra elements', async t => {
        scheduler = new Scheduler({
            appendTo : document.body,
            features : {
                dependencies : true,
                eventTooltip : false
            },
            resources : [
                { id : 'r1', name : 'Mike' },
                { id : 'r2', name : 'Linda' }
            ],
            events : [
                {
                    id         : 1,
                    cls        : 'event1',
                    resourceId : 'r1',
                    startDate  : new Date(2017, 0, 1, 10),
                    endDate    : new Date(2017, 0, 1, 12)
                },
                {
                    id         : 2,
                    cls        : 'event2',
                    resourceId : 'r2',
                    startDate  : new Date(2017, 0, 1, 10),
                    endDate    : new Date(2017, 0, 1, 12)
                }
            ],
            dependencies : [
                { from : 1, to : 2 }
            ],
            startDate             : new Date(2017, 0, 1, 6),
            endDate               : new Date(2017, 0, 1, 20),
            viewPreset            : 'hourAndDay',
            enableEventAnimations : false
        });

        t.firesOk({
            observable : scheduler,
            events     : {
                eventresizeend : 3
            }
        });

        scheduler.on('eventresizeend', ({ eventRecord }) => {
            scheduler.events[0].setEndDate(eventRecord.endDate, false);
        });

        t.chain(
            { drag : '.event2', fromOffset : ['100%-5', '50%'], by : [scheduler.tickSize, 0] },
            next => {
                t.isLessOrEqual(document.querySelectorAll('.event2 .b-sch-terminal').length, 4, 'No extra terminals found');
                next();
            },
            { drag : '.event2', fromOffset : ['100%-5', '50%'], by : [scheduler.tickSize, 0] },
            next => {
                t.isLessOrEqual(document.querySelectorAll('.event2 .b-sch-terminal').length, 4, 'No extra terminals found');
                next();
            },
            { drag : '.event2', fromOffset : ['100%-5', '50%'], by : [-scheduler.tickSize, 0], dragOnly : true },
            { moveMouseBy : [0, 50] },
            { moveMouseBy : [-scheduler.tickSize, -50] },
            next => {
                t.isLessOrEqual(document.querySelectorAll('.event2 .b-sch-terminal').length, 4, 'No extra terminals found');
                next();
            },
            { mouseUp : null },
            next => {
                t.isLessOrEqual(document.querySelectorAll('.event2 .b-sch-terminal').length, 4, 'No extra terminals found');
                next();
            }
        );
    });

    t.it('Should finalize refresh UI if operation is cancelled asynchronously ', async t => {
        scheduler = await getScheduler(t, {
            startDate  : new Date(2018, 4, 3),
            endDate    : new Date(2018, 4, 5),
            viewPreset : 'hourAndDay',
            events     : [
                {
                    startDate  : new Date(2018, 4, 3, 5),
                    endDate    : new Date(2018, 4, 3, 8),
                    id         : 1,
                    cls        : 'event-1',
                    resourceId : 'r2'
                }
            ]
        });

        scheduler.on('beforeeventresizefinalize', ({ context }) => {
            context.async = true;

            setTimeout(() => context.finalize(false), 100);
        });

        const eventWidth = document.querySelector('.event-1').offsetWidth;

        t.chain(
            { drag : '.event-1', offset : ['100%-5', '50%'], by : [200, 0] },

            { waitForSelectorNotFound : '.b-resizing-event' },

            () => {
                t.is(document.querySelector('.event-1').offsetWidth, eventWidth, 'Event is visually same');
            }
        );
    });

    t.it('Should work with custom non-continuous timeaxis', async t => {
        scheduler = await getScheduler(t, {
            events : [
                {
                    id         : 1,
                    resourceId : 'r1',
                    startDate  : new Date(2011, 0, 4),
                    endDate    : new Date(2011, 0, 6)
                }
            ],

            timeAxis : {
                continuous : false,

                generateTicks(start, end, unit, increment) {
                    const ticks = [];

                    while (start < end) {

                        if ([1, 2, 3].includes(start.getDay())) {
                            ticks.push({
                                startDate : start,
                                endDate   : DateHelper.add(start, increment, unit)
                            });
                        }

                        start = DateHelper.add(start, increment, unit);
                    }
                    return ticks;
                }
            }
        });

        t.chain(
            { drag : '.b-sch-event', offset : ['100%-3', '50%'], by : [scheduler.tickSize, 0] },

            () => {
                t.is(document.querySelector(scheduler.unreleasedEventSelector).offsetWidth, scheduler.tickSize * 3, 'Correct width after resize');
                t.is(scheduler.eventStore.first.startDate, new Date(2011, 0, 4), 'startDate still them same');
                t.is(scheduler.eventStore.first.endDate, new Date(2011, 0, 11), 'endDate correct');
            }
        );
    });

    t.it('ScrollManager should not scroll vertically while resizing', async t => {
        scheduler = await getScheduler(t, {
            startDate     : new Date(2017, 0, 1, 4),
            height        : 210,
            viewPreset    : 'hourAndDay',
            resourceStore : t.getResourceStore2({}, 100),
            events        : [
                {
                    resourceId : 'r3',
                    id         : 1,
                    startDate  : new Date(2017, 0, 1, 6),
                    endDate    : new Date(2017, 0, 1, 8)
                }
            ],
            features : {
                eventDrag : {
                    constrainDragToResource : true
                }
            }
        });

        t.wontFire(scheduler.scrollable, 'scroll');

        t.chain(
            { moveCursorTo : '.b-sch-event' },
            { drag : '.b-sch-event', fromOffset : ['100%-2', '50%'], by : [200, 0] }
        );
    });

    // https://app.assembla.com/spaces/bryntum/tickets/8898
    t.it('Should be possible to resize semi-small events', async t => {
        scheduler = await getScheduler(t, {
            features : {
                eventTooltip : false
            }
        });

        scheduler.zoomToLevel('weekAndDayLetter');

        scheduler.tickSize = 5;

        t.chain(
            { drag : '[data-event-id="1"]', offset : [1, 5], by : [-10, 0] },

            { waitForProjectReady : scheduler },

            next => {
                t.is(document.querySelector('[data-event-id="1"]').offsetWidth, 20, 'Resized left');
                next();
            },

            { drag : '[data-event-id="2"]', offset : ['100%-1', 5], by : [10, 0] },

            { waitForProjectReady : scheduler },

            next => {
                t.is(document.querySelector('[data-event-id="2"]').offsetWidth, 20, 'Resized right');
                next();
            },

            { drag : '[data-event-id="3"]', offset : ['50%', 5], by : [10, 0] },

            { waitForProjectReady : scheduler },

            () => {
                t.is(document.querySelector('[data-event-id="3"]').offsetWidth, 10, 'Not resized');
                t.is(document.querySelector('[data-event-id="3"]').getBoundingClientRect().left, 424, 'Moved');
            }
        );
    });

    // https://github.com/bryntum/support/issues/1546
    t.it('Should not be possible to resize very small events, drag drop is prioritized in this case', async t => {
        scheduler = await getScheduler(t, {
            events : [
                {
                    id         : 1,
                    resourceId : 'r1',
                    startDate  : new Date(2011, 0, 4),
                    duration   : 0.05
                }
            ]
        }, 1);

        await t.waitForAnimations();
        const el = t.query(scheduler.unreleasedEventSelector)[0];

        t.wontFire(scheduler, 'beforeEventResize');
        t.wontFire(scheduler, 'beforeDragCreate');
        t.is(el.offsetWidth, 5, 'Small event, 5px wide');

        // Start drag at every x coordinate in the 5px wide event
        await t.dragBy('.b-sch-event', [20, 0], null, null, null, false, [0, 10]);
        await t.dragBy('.b-sch-event', [20, 0], null, null, null, false, [1, 10]);
        await t.dragBy('.b-sch-event', [20, 0], null, null, null, false, [2, 10]);
        await t.dragBy('.b-sch-event', [20, 0], null, null, null, false, [3, 10]);
        await t.dragBy('.b-sch-event', [20, 0], null, null, null, false, [4, 10]);
    });

    // https://github.com/bryntum/support/issues/410
    t.it('Event element should stay visible when drag resized to 0 duration in horizontal mode', async t => {
        scheduler = t.getScheduler({
            features : {
                eventResize : {
                    showExactResizePosition : true
                }
            }
        }, 1);

        await t.waitForProjectReady();

        await t.dragBy('.b-sch-event', [-250, 0], null, null, null, true, ['100%-2', '50%']);

        t.is(document.querySelector('.b-sch-event-wrap').offsetWidth, 1, 'Event container is visible');
        t.is(document.querySelector('.b-sch-event').offsetWidth, 1, 'Event is visible');
    });

    t.it('Event element should stay visible when drag resized to 0 duration in vertical mode', async t => {
        scheduler = t.getScheduler({
            mode     : 'vertical',
            features : {
                eventResize : {
                    showExactResizePosition : true
                }
            }
        }, 1);

        await t.waitForProjectReady();

        await t.dragBy('.b-sch-event', [0, -250], null, null, null, true, ['50%', '100%-2']);

        t.is(document.querySelector('.b-sch-event-wrap').offsetHeight, 1, 'Event container is visible');
        t.is(document.querySelector('.b-sch-event').offsetHeight, 1, 'Event is visible');
    });
});
