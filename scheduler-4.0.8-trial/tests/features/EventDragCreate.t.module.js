import { EventStore, ResourceStore, ResourceModel, Scheduler, BrowserHelper } from '../../build/scheduler.module.js?447702';

StartTest(t => {
    let counter = 0,
        scheduler;

    t.beforeEach(() => scheduler && scheduler.destroy());

    const createFn = ({ resourceRecord, startDate, endDate }, event) => {
        //limiting number of assertions
        if (counter < 2) {
            t.ok(resourceRecord instanceof ResourceModel &&
                startDate instanceof Date &&
                endDate instanceof Date &&
                (event ? event instanceof Event : true), 'Correct function arguments');
        }
        counter++;

        if (endDate > new Date(2011, 0, 10)) return false;
    };

    document.body.style.width = '500px';

    t.it('Should not create an event if validatorFn returns false', t => {
        scheduler = t.getScheduler({
            aaa           : 'aaa',
            startDate     : new Date(2011, 0, 3),
            endDate       : new Date(2011, 3, 3),
            viewPreset    : 'weekAndMonth',
            resourceStore : new ResourceStore({
                data : [
                    // Put some empty rows first to make sure tooltip fits above for alignment checks
                    {},
                    {},
                    {
                        id   : 1,
                        name : 'Foo'
                    }
                ]
            }),
            eventStore : new EventStore(),
            features   : {
                eventDragCreate : {
                    validatorFn : () => false
                }
            }
        });

        //t.ok(scheduler.enableDragCreation === true, 'Should see enableDragCreation configured correctly on the view');
        t.ok(scheduler.features.eventDragCreate, 'EventDragCreate is there');

        t.wontFire(scheduler.eventStore, 'add');
        t.wontFire(scheduler, 'scheduleclick');

        t.chain(
            { drag : '.b-sch-timeaxis-cell', fromOffset : [2, 2], by : [50, 0] }
        );
    });

    t.it('Should hide creator proxy after cancelled operation', async t => {
        scheduler = await t.getSchedulerAsync({
            eventStore : new EventStore(),
            features   : {
                eventEdit       : false,
                eventDragCreate : true
            }
        });

        const generateListener = doFinalize =>
            ({ context }) => {
                context.async = true;
                setTimeout(() => {
                    context.finalize(doFinalize);
                }, 100);
            };

        // do first drag passing false to finalize call
        scheduler.on('beforedragcreatefinalize', { fn : generateListener(false), once : true });

        t.chain(
            { drag : '.b-sch-timeaxis-cell', offset : [5, '100%+20'], by : [100, 0], dragOnly : true },

            { waitForEvent : [scheduler, 'afterdragcreate'], trigger : { mouseUp : null } },

            async() => {
                // do second drag passing true to finalize call
                scheduler.on('beforedragcreatefinalize', { fn : generateListener(true), once : true });
                t.selectorNotExists('.b-sch-dragcreator-proxy', 'Proxy removed after stopped');
                t.selectorNotExists('.b-sch-event', 'Event not created');
            },

            { drag : '.b-sch-timeaxis-cell', offset : [20, 75], by : [100, 0], dragOnly : true },

            { waitForEvent : [scheduler, 'afterdragcreate'], trigger : { mouseUp : null } },

            { waitForProjectReady : scheduler },

            () => {
                t.selectorNotExists('.b-sch-dragcreator-proxy', 'Proxy hidden after stopped');
                t.selectorExists('.b-sch-event', 'Event created');
            }
        );
    });

    t.it('Should create an event if createValidator returns true', async t => {
        scheduler = await t.getSchedulerAsync({
            startDate : new Date(2011, 0, 3),
            endDate   : new Date(2011, 3, 3),
            features  : {
                eventEdit       : false,
                eventDragCreate : {
                    validatorFn : createFn
                }
            },
            viewPreset    : 'dayAndWeek',
            resourceStore : new ResourceStore({
                data : [
                    // Put some empty rows first to make sure tooltip fits above for alignment checks
                    {},
                    {},
                    {
                        id   : 1,
                        name : 'Foo'
                    }
                ]
            }),
            eventStore : new EventStore()
        });

        t.willFireNTimes(scheduler.eventStore, 'add', 2);
        t.wontFire(scheduler, 'scheduleclick');

        // eventpaint vs eventrepaint no longer matters
        t.willFireNTimes(scheduler, 'renderEvent', 2);

        t.chain(
            { drag : '.b-sch-timeaxis-cell', fromOffset : [1, 2], by : [99, 0], dragOnly : true },

            next => {
                const
                    tipBox   = scheduler.features.eventDragCreate.tip.element.getBoundingClientRect(),
                    eventBox = document.querySelector('.b-sch-dragcreator-proxy').getBoundingClientRect();

                t.isApprox(tipBox.right, eventBox.right, 15, 'Tip x should be aligned with proxy');
                t.isApprox(tipBox.top, eventBox.bottom, 10, 'Tip y should be aligned with proxy');
                next();
            },

            { action : 'mouseUp' },

            next => {
                scheduler.eventStore.removeAll();
                next();
            },

            { drag : '.b-sch-timeaxis-cell', fromOffset : [1, 2], by : [99, 0], dragOnly : true },

            next => {
                const
                    tipBox   = scheduler.features.eventDragCreate.tip.element.getBoundingClientRect(),
                    eventBox = document.querySelector('.b-sch-dragcreator-proxy').getBoundingClientRect();

                t.isApprox(tipBox.right, eventBox.right, 15, 'Tip x should be aligned with proxy');
                t.isApprox(tipBox.top, eventBox.bottom, 10, 'Tip y should be aligned with proxy');

                next();
            },

            { action : 'mouseUp' },

            () => {
                t.is(scheduler.eventStore.count, 1, '1 new event added');
                const event = scheduler.eventStore.first;

                t.is(event.startDate, new Date(2011, 0, 3), 'StartDate read ok');
                t.is(event.endDate, new Date(2011, 0, 4), 'EndDate read ok');

                t.selectorNotExists('.b-sch-dragcreator-proxy', 'Proxy removed');
            }
        );
    });

    t.it('Should trigger scroll when creating event close to timeaxis edges', t => {
        scheduler = t.getScheduler({
            startDate     : new Date(2011, 0, 2),
            endDate       : new Date(2011, 3, 3),
            viewPreset    : 'weekAndMonth',
            resourceStore : new ResourceStore({
                data : [
                    // Put some empty rows first to make sure tooltip fits above for alignment checks
                    {},
                    {},
                    {
                        id   : 1,
                        name : 'Foo'
                    }
                ]
            }),
            eventStore : new EventStore(),
            features   : {
                eventEdit       : false,
                eventDragCreate : true
            }
        });

        //        t.firesAtLeastNTimes(viewEl, 'scroll', 1);
        t.is(scheduler.scrollLeft, 0, 'Scroll 0 initially');

        t.chain(
            {
                drag       : '.b-sch-timeaxis-cell',
                fromOffset : [300, 2],
                to         : '.b-scheduler',
                toOffset   : ['100%-25', '50%'],
                dragOnly   : true
            },

            {
                waitFor : () => scheduler.scrollLeft >= 200,
                desc    : 'Scrolling'
            },

            next => {
                t.isGreater(document.querySelector('.b-sch-dragcreator-proxy').offsetWidth, 100, 'Proxy gained width');
                t.ok(scheduler.features.eventDragCreate.dragging, 'Still in dragging mode after scroll happened');
                next();
            },

            { moveMouseBy : [[-30, 0]] },

            { action : 'mouseUp' },

            () => {
                const newEvent = scheduler.eventStore.first;

                t.isGreaterOrEqual(scheduler.scrollLeft, 100, 'Scrolled right');

                t.is(newEvent.startDate, new Date(2011, 0, 23));
            }
        );
    });

    t.it('Proxy should not move after scroll (horizontal)', t => {
        scheduler = t.getScheduler({
            resourceStore : t.getResourceStore2({}, 30),
            features      : {
                eventEdit       : false,
                eventDragCreate : true
            }
        });

        let rect, el;

        t.chain(
            { drag : '.b-sch-timeaxis-cell', fromOffset : [2, 2], by : [30, 0], dragOnly : true },
            next => {
                el = document.querySelector('.b-sch-dragcreator-proxy');
                rect = el.getBoundingClientRect();
                t.isLess(scheduler.bodyContainer.scrollTop, rect.top, 'DragCreator proxy is visible');
                scheduler.bodyContainer.scrollTop = 40;
                next();
            },
            next => {
                const newRect = el.getBoundingClientRect();
                t.is(Math.round(newRect.top + 40), Math.round(rect.top), 'DragCreator proxy is not visible');
                next();
            },
            { action : 'mouseUp' }
        );
    });

    t.it('Hovertip should be disabled during dragcreate', t => {
        scheduler = t.getScheduler();

        t.chain(
            {
                drag     : '.b-sch-timeaxis-cell',
                offset   : [5, 19],
                by       : [40, 0],
                dragOnly : true
            },

            { waitForSelectorNotFound : '.b-sch-scheduletip', desc : 'Hover tip is hidden' },

            { mouseUp : null },

            {
                drag     : '.b-sch-timeaxis-cell',
                offset   : [80, 19],
                by       : [100, 0],
                dragOnly : true,

                desc : 'Drag creator proxy should be above any event in the z-index stack'
            },

            next => {
                t.elementIsTopElement('.b-sch-dragcreator-proxy', 'Drag creator proxy should be above any event in the z-index stack');
                next();
            },

            { mouseUp : null }
        );
    });

    t.it('Should create new event if overlaps are disabled', t => {
        scheduler = t.getScheduler({
            allowOverlap : false,
            resources    : [
                { id : 1, name : 'Albert' },
                { id : 2, name : 'Ben' }
            ],
            events : [
                { resourceId : 2, startDate : '2011-01-04', endDate : '2011-01-05' }
            ]
        });

        t.chain(
            { waitForSelector : '.b-sch-event' },
            { drag : '.b-sch-timeaxis-cell', offset : [12, 12], by : [100, 0] },
            () => {
                t.is(scheduler.eventStore.count, 2, '');
            }
        );
    });

    t.it('should add events when time axis is smaller than one day', t => {
        scheduler = t.getScheduler({
            features : {
                eventTooltip : true
            },

            events : []
        });

        const oldCount = scheduler.eventStore.count;

        t.chain(
            {
                drag   : '.b-timeline-subgrid .b-grid-row[data-index="2"] > .b-sch-timeaxis-cell',
                offset : [202, 12],
                by     : [46, 0]
            },

            { type : 'Test' },

            { click : 'button:contains(Save)' },

            () => {
                t.is(scheduler.eventStore.count, oldCount + 1, 'Event has been added');
            }
        );
    });

    t.it('Should not allow dragcreate if readOnly', t => {
        scheduler = t.getScheduler({
            events   : [],
            readOnly : true,
            features : {
                eventEdit       : false,
                eventDragCreate : true
            }
        });

        t.wontFire(scheduler, 'beforedragcreate');
        t.wontFire(scheduler, 'dragcreatestart');

        t.chain(
            { drag : '.b-sch-timeaxis-cell', offset : ['10%', 10], by : [50, 0] },
            () => {
                t.selectorNotExists('.b-sch-event', 'Event not created on drag');
            }
        );
    });

    t.it('Should work with AssignmentStore', t => {
        scheduler = new Scheduler({
            appendTo  : document.body,
            resources : [
                { id : 'r1', name : 'Mike' },
                { id : 'r2', name : 'Linda' }
            ],
            events : [
                { id : 1, startDate : new Date(2017, 0, 1, 10), endDate : new Date(2017, 0, 1, 12) }
            ],
            assignments : [
                { resourceId : 'r1', eventId : 1 },
                { resourceId : 'r2', eventId : 1 }
            ],
            startDate             : new Date(2017, 0, 1, 6),
            endDate               : new Date(2017, 0, 1, 20),
            viewPreset            : 'hourAndDay',
            enableEventAnimations : false,
            features              : {
                eventEdit       : false,
                eventTooltip    : false,
                scheduleTooltip : false,
                eventDragCreate : {
                    showTooltip : false
                }
            }
        });

        t.chain(
            { drag : '.b-sch-timeaxis-cell', offset : ['10%', 10], by : [50, 0] },

            () => {
                t.selectorCountIs('.b-sch-event:not(.b-sch-released)', 3, 'Correct number of event elements');
                t.is(scheduler.assignmentStore.count, 3, 'Correct assignment count');
            }
        );
    });

    // https://app.assembla.com/spaces/bryntum/tickets/6786
    t.it('Should be able to drag create across a milestone', async t => {
        scheduler = t.getScheduler({
            viewPreset : 'hourAndDay',
            rowHeight  : 60,
            barMargin  : 15,
            resources  : [{ id : 1, name : 'Albert' }],
            events     : [{ resourceId : 1, startDate : new Date(2017, 11, 1, 10), duration : 0 }],
            startDate  : new Date(2017, 11, 1, 9),
            endDate    : new Date(2017, 11, 3, 9),
            features   : {
                eventTooltip    : false,
                scheduleTooltip : false,
                eventDragCreate : {
                    showTooltip : false
                }
            }
        });

        await t.waitForProjectReady();

        t.ok(scheduler.eventStore.first.isMilestone, 'Event is milestone');

        t.chain([
            { waitForSelector : '.b-sch-event' },
            { moveMouseTo : '.b-milestone', offset : [-15, 15] },
            { mousedown : null },
            { moveMouseBy : [10, -10] },
            { mouseup : null }
        ]);
    });

    // Test tooltip alignment when the document is scrolled.
    if (document.scrollingElement) {
        t.it('Tooltip should align correctly', t => {
            scheduler = t.getScheduler({
                viewPreset : 'hourAndDay',
                startDate  : new Date(2018, 3, 27),
                endDate    : new Date(2018, 3, 28)
            });
            // Visually the look should be the same, but the document is scrolled.
            document.scrollingElement.style.paddingTop = '1000px';
            document.scrollingElement.scrollTop = 1000;

            t.chain(
                { drag : '.b-sch-timeaxis-cell', offset : ['10%', 10], by : [50, 0], dragOnly : true },
                { waitForSelector : '.b-sch-tip-valid' },
                next => {
                    const
                        proxy = document.querySelector('.b-sch-dragcreator-proxy'),
                        tip = scheduler.features.eventDragCreate.tip;

                    t.isApprox(tip.element.getBoundingClientRect().top, proxy.getBoundingClientRect().bottom + tip.anchorSize[1], 'Resize tip is aligned just below the dragcreate proxy');
                    next();
                },
                { mouseUp : null }
            );
        });
    }

    t.it('Should show message and block creation if validator returns object with `valid` false', t => {
        scheduler = t.getScheduler({
            features : {
                eventDragCreate : {
                    validatorFn({ resourceRecord }, event) {
                        return {
                            valid   : false,
                            message : 'msg'
                        };
                    }
                }
            },
            events : []
        });

        t.wontFire(scheduler.eventStore, 'add');

        t.chain(
            // IE11 and Edge cannot drag 0 offset in automation mode
            { drag : '.b-sch-timeaxis-cell', offset : [100, BrowserHelper.isIE11 || BrowserHelper.isEdge || BrowserHelper.isFirefox ? 5 : 0], by : [50, 0], dragOnly : true },

            { waitForSelector : '.b-tooltip .b-sch-tip-message:textEquals(msg)' },

            { mouseUp : null }
        );
    });

    t.it('Should not show message if validator returns object with `valid` true', t => {
        scheduler = t.getScheduler({
            features : {
                eventEdit : false,
                eventDrag : {
                    validatorFn({ resourceRecord, eventRecord, start, end }, event) {
                        return {
                            valid : true
                        };
                    }
                }
            },
            events : []
        });

        t.firesOnce(scheduler.eventStore, 'add');

        t.chain(
            // IE11 and Edge cannot drag 0 offset in automation mode
            { drag : '.b-sch-timeaxis-cell', offset : [100, BrowserHelper.isIE11 || BrowserHelper.isEdge || BrowserHelper.isFirefox ? 5 : 0], by : [50, 0], dragOnly : true },

            { waitForSelector : '.b-tooltip .b-sch-tip-message:empty' },

            { mouseUp : null }
        );
    });

    t.it('Should consider undefined return value as valid action', t => {
        scheduler = t.getScheduler({
            features : {
                eventEdit : false,
                eventDrag : {
                    validatorFn({ resourceRecord, eventRecord, start, end }, event) {
                    }
                }
            },
            events : []
        });

        t.firesOnce(scheduler.eventStore, 'add');

        t.chain(
            // IE11 and Edge cannot drag 0 offset in automation mode
            { drag : '.b-sch-timeaxis-cell', offset : [100, BrowserHelper.isIE11 || BrowserHelper.isEdge || BrowserHelper.isFirefox ? 5 : 0], by : [50, 0] }
        );
    });

    t.it('should not reset scroll position when finishing edit of newly created event', async t => {
        scheduler = await t.getSchedulerAsync({
            height        : 200,
            resourceStore : t.getResourceStore2({}, 30),
            features      : {
                eventEdit : true
            }
        });

        const oldCount = scheduler.eventStore.count;

        scheduler.scrollable.y = scheduler.scrollable.maxY;

        t.chain(
            {
                drag     : '.b-timeline-subgrid .b-grid-row[data-index="29"] > .b-sch-timeaxis-cell',
                offset   : [202, 12],
                by       : [46, 0],
                dragOnly : true
            },

            next => {
                t.wontFire(scheduler, 'scroll');
                next();
            },

            { mouseUp : null },

            { type : 'Test' },

            { click : 'button:contains(Save)' },

            () => {
                t.is(scheduler.eventStore.count, oldCount + 1, 'Event has been added');
                t.is(scheduler.eventStore.last.name, 'Test');
            }
        );
    });

    // https://app.assembla.com/spaces/bryntum/tickets/7224/details
    t.it('Event should be visible if not reapplying filters', t => {
        // Covers the edge case where eventStore is filtered and a drag created event gets filtered out directly

        scheduler = t.getScheduler({
            resourceStore : t.getResourceStore2({}, 3),
            features      : {
                eventEdit : true
            }
        });

        scheduler.eventStore.reapplyFilterOnAdd = false;
        scheduler.eventStore.filter('name', 'Assignment 1');

        t.chain(
            {
                drag   : '.b-sch-timeaxis-cell',
                offset : [50, 10],
                by     : [100, 0]
            },

            { waitFor : () => scheduler.features.eventEdit.editor.containsFocus },
            { type : 'New test event' },

            { click : ':textEquals(Save)' },

            () => {
                t.selectorCountIs(scheduler.eventSelector + ':not(.b-sch-released) .b-sch-event', 2, 'Correct event element count');
            }
        );
    });

    // https://app.assembla.com/spaces/bryntum/tickets/7224/details
    t.it('Drag proxy should be removed if event is filtered out', t => {
        // Covers the edge case where eventStore is filtered and a drag created event gets filtered out directly

        scheduler = t.getScheduler({
            resourceStore : t.getResourceStore2({}, 3),
            features      : {
                eventEdit : true
            }
        });

        scheduler.eventStore.reapplyFilterOnAdd = true;
        scheduler.eventStore.filter('name', 'Assignment 1');

        t.chain(
            {
                drag   : '.b-sch-timeaxis-cell',
                offset : [50, 10],
                by     : [100, 0]
            },

            { waitFor : () => scheduler.features.eventEdit.editor.containsFocus },
            { type : 'New test event' },

            { click : ':textEquals(Save)' },

            () => {
                t.selectorNotExists('.b-sch-dragcreator-proxy', 'Proxy not found');
            }
        );
    });

    t.it('Should fire scheduleclick, beforeeventadd and call onEventCreated after drag create operation', t => {
        scheduler = t.getScheduler({
            startDate     : new Date(2011, 0, 1),
            endDate       : new Date(2011, 0, 2),
            resourceStore : new ResourceStore({
                data : [
                    {
                        id   : 1,
                        name : 'Foo'
                    },
                    {}
                ]
            }),
            eventStore : new EventStore()
        });

        t.firesOnce(scheduler, 'scheduleclick');
        t.isCalledOnce('onEventCreated', scheduler, 'onEventCreated hook is called once');
        t.firesOnce(scheduler, 'beforeeventadd', 'beforeeventadd is fired once');

        t.chain(
            { drag : '.b-sch-timeaxis-cell', fromOffset : [2, 2], by : [50, 0] },
            { click : '.b-sch-timeaxis-cell' }
        );
    });

    t.it('Should respect Scheduler#getDateConstraints', t => {
        let called = false;

        scheduler = t.getScheduler({
            resources : [
                { id : 'r1', name : 'Resource 1' }
            ],

            events : [],

            features : {
                eventEdit : false
            },

            getDateConstraints(resourceRecord, date) {
                t.ok(resourceRecord instanceof scheduler.resourceStore.modelClass, 'resourceRecord arg has correct type');
                t.ok(date instanceof Date, 'date arg has correct type');
                called = true;
                return {
                    start : new Date(2011, 0, 4),
                    end   : new Date(2011, 0, 5)
                };
            }
        });

        t.chain(
            { drag : '.b-sch-timeaxis-cell', offset : [100, '50%'], by : [200, 0] },

            () => {
                t.ok(called, 'getDateConstraints() was called');
                t.is(scheduler.eventStore.first.startDate, new Date(2011, 0, 4), 'Correct startDate');
                t.is(scheduler.eventStore.first.endDate, new Date(2011, 0, 5), 'Correctly constrained endDate');
            }
        );
    });

    t.it('Should abort on ESC key', t => {
        scheduler = t.getScheduler({
            resourceStore : new ResourceStore({
                data : [
                    {
                        id : 1
                    }
                ]
            }),
            eventStore : new EventStore()
        });

        t.chain(
            { drag : '.b-sch-timeaxis-cell', fromOffset : [2, 2], by : [50, 0], dragOnly : true },

            { type : '[ESCAPE]' },

            () => {
                t.selectorNotExists('.b-sch-dragcreator-proxy', 'Proxy removed');
                t.notOk(scheduler.features.eventDragCreate.dragging, 'not dragging');
            }
        );
    });

    t.it('Should support disabling', t => {
        scheduler = t.getScheduler();

        scheduler.features.eventDragCreate.disabled = true;

        t.chain(
            { drag : '.b-sch-timeaxis-cell', fromOffset : [2, 2], by : [50, 0], dragOnly : true },

            next => {
                t.selectorNotExists('.b-sch-dragcreator-proxy', 'No proxy');
                next();
            },

            { mouseUp : null },

            next => {
                scheduler.features.eventDragCreate.disabled = false;

                next();
            },

            { drag : '.b-sch-timeaxis-cell', fromOffset : [2, 2], by : [50, 0], dragOnly : true },

            next => {
                t.selectorExists('.b-sch-dragcreator-proxy', 'Proxy found');
                next();
            },

            { mouseUp : null }
        );
    });
});
