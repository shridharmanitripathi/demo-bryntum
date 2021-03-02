import { Rectangle, ArrayHelper, DateHelper } from '../../build/scheduler.module.js?447702';

StartTest({ defaultTimeout : 90000 }, t => {
    let scheduler;

    t.beforeEach(() => {
        scheduler && scheduler.destroy();
    });

    async function getScheduler(config) {
        const scheduler = t.getScheduler(Object.assign({
            features : {
                eventDrag : true
            }
        }, config));

        await t.waitForProjectReady();

        return scheduler;
    }

    t.it('dragging outside the rendered block', async t => {
        t.waitForScrolling = false;

        const
            resources = ArrayHelper.populate(200, i => ({
                id   : `r${i + 1}`,
                name : `Resource ${i + 1}`
            })),
            events    = ArrayHelper.populate(116, i => ({
                id         : i + 2,
                resourceId : `r${i + 2}`,
                name       : `Event ${i + 2}`,
                startDate  : new Date(2011, 0, 4),
                endDate    : new Date(2011, 0, 6)
            }));

        events.unshift({
            id         : 1,
            resourceId : 'r1',
            name       : 'Drag Event',
            startDate  : new Date(2011, 0, 4),
            endDate    : new Date(2011, 0, 6)
        });

        scheduler = t.getScheduler({
            features : {
                eventDrag : {
                    showTooltip : false
                },
                eventTooltip    : false,
                scheduleTooltip : false
            },
            resources,
            events
        });

        await t.waitForProjectReady();

        const
            event              = scheduler.eventStore.first,
            layout             = scheduler.currentOrientation,
            dragEl             = scheduler.getElementFromEventRecord(event).parentNode,
            schedulerRectangle = Rectangle.from(scheduler.element),
            startPoint         = Rectangle.from(dragEl).center;

        let newLocation, droppedOnResource, dragElMutationObserver;

        t.chain(
            { mouseDown : dragEl },

            next => {
                // Ensure that during the drag, the dragEl does not get mutated
                dragElMutationObserver = new MutationObserver(() => {
                    dragElMutationObserver.disconnect();
                    t.fail('Dragged element got mutated during drag');
                });
                dragElMutationObserver.observe(dragEl, {
                    characterData : true,
                    childList     : true
                });

                next();
            },

            // This will kick off scrolling
            { moveMouseTo : document.body, offset : [startPoint.x, schedulerRectangle.bottom - 20] },

            { waitFor : () => scheduler.rowManager.topIndex >= 100, timeout : 40000, desc : 'Scrolling' },

            { moveMouseTo : document.body, offset : [startPoint.x, schedulerRectangle.bottom - 100] },

            next => {
                droppedOnResource = scheduler.resolveResourceRecord(t.elementFromPoint.apply(t, t.currentPosition));

                const
                    row          = scheduler.rowManager.getRowFor(droppedOnResource),
                    rowRectangle = Rectangle.from(row._elements.normal),
                    newLayout    = layout.getTimeSpanRenderData(event, droppedOnResource);

                newLocation = new Rectangle(rowRectangle.x + newLayout.left, rowRectangle.y + newLayout.top, newLayout.width, newLayout.height);

                t.ok(dragEl.retainElement, 'Dragged element is retained');

                // Disconnect observer. We expect content to change now
                dragElMutationObserver.disconnect();

                // Edge and IE11 require some help to drop event to correct position. Moving mouse to the vertical center
                // of the target resource
                t.moveMouseTo([t.currentPosition[0], rowRectangle.y + rowRectangle.height / 2], next);
            },

            { mouseUp : null },

            // Wait for the drag element to settle into the calculated new position
            { waitFor : () => t.sameRect(Rectangle.from(dragEl), newLocation) },

            () => {
                // The drag/dropped element is reused as the event's render el
                t.is(scheduler.getElementFromEventRecord(event).parentNode, dragEl);

                t.notOk(dragEl.retainElement, 'Dragged element is no longer retained');

            }
        );
    });

    t.it('dragging outside the rendered block with ESC to abort', async t => {
        t.waitForScrolling = false;

        const
            resources = ArrayHelper.populate(200, i => ({ id : `r${i + 1}`, name : `Resource ${i + 1}` })),
            events    = [
                {
                    id         : 1,
                    resourceId : 'r1',
                    name       : 'Drag Event',
                    startDate  : new Date(2011, 0, 4),
                    endDate    : new Date(2011, 0, 6)
                },
                ...ArrayHelper.populate(116, i => ({
                    id         : i + 2,
                    resourceId : `r${i + 2}`,
                    name       : `Event ${i + 2}`,
                    startDate  : new Date(2011, 0, 4),
                    endDate    : new Date(2011, 0, 6)
                }))
            ];

        scheduler = await t.getSchedulerAsync({
            features : {
                eventDrag : {
                    showTooltip : false
                },
                eventTooltip    : false,
                scheduleTooltip : false
            },
            resources,
            events
        });

        const
            event              = scheduler.eventStore.first,
            dragEl             = scheduler.getElementFromEventRecord(event).parentNode,
            schedulerRectangle = Rectangle.from(scheduler.element),
            startPoint         = Rectangle.from(dragEl).center;

        let eventEls, eventElRects, endingEventEls, endingEventElRects, dragElMutationObserver;

        t.chain(
            { mouseDown : dragEl },

            next => {
                // Ensure that during the drag, the dragEl does not get mutated
                dragElMutationObserver = new MutationObserver(() => {
                    dragElMutationObserver.disconnect();
                    t.fail('Dragged element got mutated during drag');
                });
                dragElMutationObserver.observe(dragEl, {
                    characterData : true,
                    childList     : true
                });

                next();
            },

            // This will kick off scrolling
            { moveMouseTo : document.body, offset : [startPoint.x, schedulerRectangle.bottom - 20] },

            { waitFor : () => scheduler.rowManager.topIndex >= 100, timeout : 60000 },

            { moveCursorBy : [0, -80] },

            next => {
                // The scheduler's rendered block should not change
                eventEls     = scheduler.eventStore.reduce((result, event) => {
                    const el = scheduler.getElementFromEventRecord(event);
                    if (el) {
                        result.push(el);
                    }
                    return result;
                }, []);
                eventElRects = eventEls.map(e => Rectangle.from(e));

                t.ok(dragEl.retainElement, 'Dragged element retained');

                // Disconnect observer. We expect content to change now
                dragElMutationObserver.disconnect();

                next();
            },

            { type : '[ESC]' },

            {
                waitFor : () => {
                    endingEventEls = scheduler.eventStore.reduce((result, event) => {
                        const el = scheduler.getElementFromEventRecord(event);
                        if (el) {
                            result.push(el);
                        }
                        return result;
                    }, []);
                    return endingEventEls.length === eventEls.length;
                }
            },

            () => {
                endingEventElRects = endingEventEls.map(e => Rectangle.from(e));

                // Same number of elements, and all in the same place.
                // TODO: Ask nige about this
                //                t.is(scheduler.timeAxisSubGridElement.querySelectorAll(scheduler.unreleasedEventSelector).length, eventEls.length);
                t.is(endingEventEls.length, eventEls.length);

                // Not the first one; that's the dragEl which will be in a different place by now
                for (let i = 1; i < eventEls.length; i++) {
                    t.ok(endingEventElRects[i].equals(eventElRects[i]), `Event ${i} correct`);
                }
            }
        );
    });

    // https://app.assembla.com/spaces/bryntum/tickets/7120/details
    t.it('Should work with resources and events that has - in their id', async t => {
        scheduler = await getScheduler({
            resources : [
                { id : 'r-1', name : 'Resource-1' }
            ],
            events : [
                {
                    id         : 'e-1',
                    resourceId : 'r-1',
                    startDate  : new Date(2011, 0, 6),
                    endDate    : new Date(2011, 0, 7)
                }
            ]
        });

        t.chain(
            { drag : '[data-event-id="e-1"]', by : [-100, 0] },

            () => {
                t.is(scheduler.eventStore.first.startDate, new Date(2011, 0, 5), 'Drag worked');
            }
        );
    });

    t.it('Event should not disappear when dragging right', async t => {
        scheduler = await getScheduler({
            resources : [
                { id : 1, name : '1' }
            ],
            events : [
                {
                    id         : 1,
                    resourceId : 1,
                    startDate  : new Date(2018, 11, 6),
                    endDate    : new Date(2018, 11, 7)
                }
            ],
            startDate : new Date(2018, 11, 6),
            endDate   : new Date(2018, 11, 30)
        });

        t.chain(
            { drag : scheduler.eventSelector, to : '.b-scheduler', toOffset : ['100%-25', 70], dragOnly : true },

            { waitFor : () => scheduler.scrollLeft > 500 },

            next => {
                t.elementIsVisible(scheduler.eventSelector, 'Still visible');
                next();
            },

            { mouseUp : null }
        );
    });

    // https://app.assembla.com/spaces/bryntum/tickets/7307
    t.it('Event should not disappear when dragging right with assignment', async t => {
        scheduler = await getScheduler({
            resources : [
                { id : 1, name : '1' }
            ],
            events : [
                {
                    id        : 1,
                    startDate : new Date(2018, 11, 6),
                    endDate   : new Date(2018, 11, 7)
                }
            ],
            assignments : [
                { eventId : 1, resourceId : 1 }
            ],
            startDate : new Date(2018, 11, 6),
            endDate   : new Date(2018, 11, 30)
        });

        t.chain(
            { drag : scheduler.eventSelector, by : [850, 0], dragOnly : true },

            { waitFor : () => scheduler.scrollLeft > 500 },

            next => {
                t.elementIsVisible(scheduler.eventSelector, 'Still visible');
                next();
            },

            { mouseUp : null }
        );
    });

    t.it('should not crash when clicking escape after mousedown which aborts drag', async t => {
        scheduler = await getScheduler({
            resources : [
                { id : 1, name : '1' }
            ],
            events : [
                {
                    id        : 1,
                    startDate : new Date(2018, 11, 6),
                    endDate   : new Date(2018, 11, 7)
                }
            ],
            assignments : [
                { eventId : 1, resourceId : 1 }
            ],
            startDate : new Date(2018, 11, 6),
            endDate   : new Date(2018, 11, 30)
        });

        t.chain(
            { mousedown : scheduler.eventSelector },
            { type : '[ESCAPE]' },
            { waitFor : 1000, desc : 'Make sure the async restore of drag proxy does not crash if drag did not start' }
        );
    });

    t.it('Should fire eventDragAbort if user aborts with Escape key', t => {
        scheduler = t.getScheduler();

        t.firesOnce(scheduler, 'eventDragAbort', 1);

        scheduler.on('eventDragAbort', ({ eventRecords, context }) => {
            t.is(eventRecords.length, 1);
            t.isInstanceOf(eventRecords[0], scheduler.eventStore.modelClass);
            t.ok(context);
        });

        t.chain(
            { drag : '.b-sch-event', by : [20, 0], dragOnly : true },

            { type : '[ESCAPE]' }
        );
    });

    t.it('Should be able to configure DragHelper using dragHelperConfig', async t => {
        scheduler = await getScheduler({
            features : {
                eventDrag : {
                    dragHelperConfig : {
                        lockX : true
                    }
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

        const eventX = document.querySelector('.b-sch-event').getBoundingClientRect().left;

        t.chain(
            { drag : '.b-sch-event', by : [200, 200], dragOnly : true },

            () => {
                const proxyX = document.querySelector('.b-sch-event').getBoundingClientRect().left;

                t.is(proxyX, eventX, 'Constrain worked');
            }
        );
    });

    t.it('Drag and drop with constrainDragToTimeSlot', async t => {
        scheduler = await getScheduler({
            startDate : new Date(2011, 0, 3),
            events    : [
                {
                    id         : 1,
                    resourceId : 'r1',
                    startDate  : new Date(2011, 0, 6),
                    endDate    : new Date(2011, 0, 7)
                }
            ],
            features : {
                eventDrag : {
                    constrainDragToTimeSlot : true
                }
            }
        });

        const
            { tickSize } = scheduler,
            draggedEvent = scheduler.eventStore.first,
            { startDate, endDate } = draggedEvent;

        t.willFireNTimes(scheduler.eventStore, 'change', 1);

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

                next();
            },

            // This drag should move the event down
            { drag : scheduler.eventSelector, by : [0, scheduler.rowHeight] },

            () => {
                t.is(draggedEvent.startDate, startDate);
                t.is(draggedEvent.endDate, endDate);
                t.is(draggedEvent.resourceId, 'r2');
            }
        );
    });

    // https://github.com/bryntum/support/issues/630
    t.xit('Drag and drop with fillTicks', async t => {
        scheduler = await getScheduler({
            startDate : new Date(2011, 0, 3),
            events    : [
                {
                    id         : 1,
                    resourceId : 'r1',
                    startDate  : new Date(2011, 0, 6, 10),
                    endDate    : new Date(2011, 0, 6, 14)
                }
            ],
            minHeight  : '20em',
            viewPreset : 'dayAndWeek',
            rowHeight  : 60,
            barMargin  : 5,
            fillTicks  : true,
            eventStyle : 'colored',

            eventRenderer({ eventRecord }) {
                return `           
                    <div>
                    <span>${DateHelper.format(eventRecord.startDate, 'LT')}</span>
                    ${eventRecord.name}
                    </div>
                `;
            }
        });

        let origLeft;

        t.chain(
            { waitForSelector : '.b-sch-event' },

            async() => origLeft = t.rect('.b-sch-event').left,

            { drag : '.b-sch-event', by : [5, 0] },
            { waitForSelectorNotFound : '.b-dragging-event' },

            async() => t.is(t.rect('.b-sch-event').left, origLeft, 'Event rendered in correct position')
        );
    });

    t.it('Should dragdrop outside of the view on filtered time axis', async t => {
        scheduler = await getScheduler({
            timeAxis : {
                filters : tick => tick.startDate.getDay() !== 1
            },
            subGridConfigs : {
                locked : {
                    width : 200
                }
            }
        });

        t.chain(
            { drag : scheduler.unreleasedEventSelector, by : [-250, 0] },
            () => {
                t.is(scheduler.eventStore.first.startDate, scheduler.startDate, 'Event drag is cancelled');
            }
        );
    });

    // https://github.com/bryntum/support/issues/1286
    t.it('Should be possible to drag narrow event', async t => {
        scheduler = await getScheduler({
            startDate  : new Date(2017, 0, 1, 6),
            endDate    : new Date(2017, 0, 1, 20),
            viewPreset : 'hourAndDay',
            events     : [
                {
                    id         : 1,
                    resourceId : 'r1',
                    resizable  : false,
                    startDate  : new Date(2017, 0, 1, 10),
                    duration   : 0.006
                }
            ]
        });

        t.firesOnce(scheduler, 'aftereventdrop');

        t.chain(
            { drag : scheduler.unreleasedEventSelector, by : [scheduler.tickSize, 0], offset : [1, '50%'] },

            () => {
                t.is(scheduler.eventStore.first.startDate, new Date(2017, 0, 1, 11), 'Event moved');
            }
        );
    });
});
