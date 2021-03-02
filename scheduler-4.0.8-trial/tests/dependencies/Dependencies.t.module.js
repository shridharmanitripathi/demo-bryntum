import { ArrayHelper, BrowserHelper, Scheduler, ProjectModel, CSSHelper } from '../../build/scheduler.module.js?447702';

StartTest(t => {
    let scheduler;

    t.beforeEach(t => {
        scheduler && !scheduler.isDestroyed && scheduler.destroy();
    });

    t.it('Should add `cls` from data to rendered dependency element', async t => {
        scheduler = new Scheduler({
            appendTo : document.body,

            startDate : new Date(2018, 9, 19),
            endDate   : new Date(2018, 9, 31),

            columns : [
                { field : 'name', text : 'Name' }
            ],

            features : {
                dependencies : true
            },

            resources : ArrayHelper.fill(50, {}, (resource, i) =>
                Object.assign(resource, { id : i + 1, name : 'Resource ' + (i + 1) })),

            events : [
                { id : 1, resourceId : 1, startDate : new Date(2018, 9, 20), duration : 2 },
                { id : 2, resourceId : 1, startDate : new Date(2018, 9, 24), duration : 2 }
            ],

            dependencies : [
                { id : 1, from : 1, to : 2, cls : 'foo' }
            ]
        });

        t.chain(
            { waitForDependencies : null },

            () => {
                const dependencyEls = document.querySelectorAll('polyline');

                t.is(dependencyEls.length, 1, 'One dependency drawn');

                t.ok(dependencyEls[0].classList.contains('foo'), 'cls field added');
            }
        );
    });

    // https://app.assembla.com/spaces/bryntum/tickets/6723/details
    t.it('Should not draw dependencies for removed event when scrolling', async t => {
        scheduler = new Scheduler({
            appendTo : document.body,

            startDate : new Date(2018, 9, 19),
            endDate   : new Date(2018, 9, 31),

            columns : [
                { field : 'name', text : 'Name' }
            ],

            features : {
                dependencies : true
            },

            resources : ArrayHelper.fill(50, {}, (resource, i) =>
                Object.assign(resource, { id : i + 1, name : 'Resource ' + (i + 1) })),

            events : [
                { id : 1, resourceId : 1, startDate : new Date(2018, 9, 20), duration : 2 },
                { id : 2, resourceId : 1, startDate : new Date(2018, 9, 24), duration : 2 }
            ],

            dependencies : [
                { id : 1, from : 1, to : 2 }
            ]
        });

        t.chain(
            { waitForAnimationFrame : null, desc : 'Initial rendering is done' },
            { waitForSelector : '.b-sch-dependency', desc : 'Dependency is drawn' },

            async() => {
                t.selectorCountIs('.b-sch-dependency', 1, 'One dependency drawn');

                scheduler.eventStore.first.remove();

                t.selectorCountIs('.b-sch-dependency', 0, 'No dependencies drawn');

                await scheduler.scrollable.scrollBy(0, 5);
            },

            { waitForSelectorNotFound : '.b-sch-dependency', desc : 'No dependencies drawn' }
        );
    });

    t.it('Enable / disable', t => {
        scheduler = new Scheduler({
            appendTo : document.body,

            startDate : new Date(2018, 9, 19),
            endDate   : new Date(2018, 9, 31),

            columns : [
                { field : 'name', text : 'Name' }
            ],

            features : {
                dependencies : true
            },

            resources : ArrayHelper.fill(50, {}, (resource, i) =>
                Object.assign(resource, { id : i + 1, name : 'Resource ' + (i + 1) })),

            events : [
                { id : 1, resourceId : 1, startDate : new Date(2018, 9, 20), duration : 2 },
                { id : 2, resourceId : 1, startDate : new Date(2018, 9, 24), duration : 2 }
            ],

            dependencies : [
                { id : 1, from : 1, to : 2 }
            ]
        });

        t.chain(
            { waitForAnimationFrame : null, desc : 'Initial rendering is done' },
            { waitForSelector : '.b-sch-dependency', desc : 'Dependency is drawn' },

            async() => {
                scheduler.features.dependencies.disabled = true;
            },

            { waitForSelectorNotFound : '.b-sch-dependency', desc : 'No dependencies drawn' },

            async() => {
                scheduler.features.dependencies.disabled = false;
            },

            { waitForSelector : '.b-sch-dependency', desc : 'Dependency is drawn' }
        );
    });

    t.it('Should not throw for invalid assignments', async t => {
        scheduler = new Scheduler({
            appendTo : document.body,
            features : {
                dependencies : true
            },
            resources : [
                { id : 1, name : 'Albert' }
            ],
            events : [
                { id : 1, startDate : '2017-01-16', endDate : '2017-01-18' }
            ],
            assignments : [
                { id : 1, resourceId : 1, eventId : 1 }
            ],

            startDate : new Date(2017, 0, 16),
            endDate   : new Date(2017, 0, 20),

            columns : [
                { field : 'name', text : 'Name' }
            ]
        });

        await t.waitForProjectReady();

        t.livesOk(() => {
            scheduler.assignmentStore.add([
                { id : 2, resourceId : 1, eventId : 2 },
                { id : 3, resourceId : 2, eventId : 1 },
                { id : 4, resourceId : 2, eventId : 2 }
            ]);
        }, 'Lives ok when adding assignment to non existent dependency');
    });

    t.it('Should not throw an exception when mouse is moved out from event which is fading out due to its removing when dependencies enabled', async t => {
        if (BrowserHelper.isIE11) {
            return;
        }
        // Make a long transition so we can determine that it removes slowly
        CSSHelper.insertRule('#animation-state-test-scheduler .b-sch-event-wrap { transition-duration: 0.5s !important; }');

        scheduler = new Scheduler({
            appendTo : document.body,

            id : 'animation-state-test-scheduler',

            transitionDuration    : 500,
            enableEventAnimations : true,
            useInitialAnimation   : false,

            startDate : new Date(2018, 9, 19),
            endDate   : new Date(2018, 9, 31),

            columns : [
                { field : 'name', text : 'Name' }
            ],

            features : {
                dependencies : true
            },

            resources : ArrayHelper.fill(50, {}, (resource, i) =>
                Object.assign(resource, { id : i + 1, name : 'Resource ' + (i + 1) })),

            events : [
                { id : 1, resourceId : 1, startDate : new Date(2018, 9, 20), duration : 2 },
                { id : 2, resourceId : 1, startDate : new Date(2018, 9, 24), duration : 2, cls : 'event2' }
            ],

            dependencies : [
                { id : 1, from : 1, to : 2, cls : 'foo' }
            ]
        });

        await t.waitForProjectReady(scheduler);

        // Store element for simulator here because event would be removed during test
        const
            r1 = scheduler.eventStore.getAt(1),
            e1 = scheduler.getElementFromEventRecord(r1);

        t.chain(
            // Required in EDGE, otherwise click happens before initial scheduler drawing is fully finished
            // and document.activeElement is .b-grid-body-container.b-widget-scroller
            { waitForAnimationFrame : null, desc : 'Initial rendering is done' },

            { waitForDependencies : null },

            { click : '.event2' },

            { click : '.event2', desc : 'Click event to select it' },

            { type : '[DELETE]', desc : 'Remove event' },

            // Events removing happens with a delay (see EventNavigation.onDeleteKeyBuffer),
            // so need to wait when animation starts.
            { waitFor : () => scheduler.isAnimating, desc : 'Event element starts disappearing' },

            // This step is required to reproduce the bug, no extra mouse movement needed
            async() => {
                // The bug happens when the element becomes pointer-events:none due to being
                // put into an animated removing state. Mouseout is triggered in a real UI,
                // so we have to explicitly fire one here.
                t.simulator.simulateEvent(e1, 'mouseout');
            },

            { waitForSelectorNotFound : scheduler.unreleasedEventSelector + '.event2', desc : 'Event is removed' }
        );
    });

    // https://app.assembla.com/spaces/bryntum/tickets/9009-dependency-terminals-visible-after-event-resize-with---39-allowcreate--39--set/details#
    t.it('Should not show terminals after resizing if creation is not allowed', t => {
        scheduler = new Scheduler({
            appendTo : document.body,

            startDate : new Date(2018, 9, 19),
            endDate   : new Date(2018, 9, 31),

            columns : [
                { field : 'name', text : 'Name' }
            ],

            features : {
                dependencies : {
                    allowCreate : false
                }
            },

            resources : ArrayHelper.fill(2, {}, (resource, i) =>
                Object.assign(resource, { id : i + 1, name : 'Resource ' + (i + 1) })),

            events : [
                { id : 1, resourceId : 1, startDate : new Date(2018, 9, 20), duration : 2 }
            ]
        });

        t.chain(
            // resizing start
            { moveCursorTo : '.b-sch-event' },

            { drag : '.b-sch-event', offset : ['100%-5', 5], by : [100, 0] },

            () => {
                t.selectorNotExists('.b-sch-terminal', 'Terminals not visible');
            }
        );
    });

    // https://github.com/bryntum/support/issues/384
    t.it('Should not paint dependencies in collapsed rows on scroll or zoom', t => {
        scheduler = new Scheduler({
            appendTo : document.body,

            startDate : new Date(2020, 2, 1),
            endDate   : new Date(2020, 6, 1),

            columns : [
                { field : 'name', text : 'Name' }
            ],

            features : {
                dependencies : true,
                group        : 'name'
            },

            resources : [
                { id : 1, name : 'Resource 1' }
            ],

            events : [
                { id : 1, resourceId : 1, startDate : new Date(2020, 2, 4), duration : 2 },
                { id : 2, resourceId : 1, startDate : new Date(2020, 2, 10), duration : 2 }
            ],

            dependencies : [
                { id : 1, from : 1, to : 2 }
            ]
        });

        t.chain(
            { waitForDependencies : null },

            next => {
                t.selectorCountIs('.b-sch-dependency', 1, 'One dependency line is visible');
                t.waitForEvent(scheduler, 'dependenciesdrawn', next);
                scheduler.features.group.toggleCollapse(scheduler.resourceStore.groupRecords[0]);
            },
            next => {
                t.selectorNotExists('.b-sch-dependency', 'No lines found when collapsed');
                t.waitForEvent(scheduler, 'dependenciesdrawn', next);
                scheduler.subGrids.normal.scrollable.x += 10;
            },
            next => {
                t.selectorNotExists('.b-sch-dependency', 'No lines found when scrolled');
                t.waitForEvent(scheduler, 'dependenciesdrawn', next);
                scheduler.zoomIn();
            },
            () => {
                t.selectorNotExists('.b-sch-dependency', 'No lines found when zoomed');
            }
        );
    });

    // https://github.com/bryntum/support/issues/464
    t.it('Should refresh dependencies after filtering with schedule region collapsed', t => {
        scheduler = new Scheduler({
            appendTo : document.body,

            startDate : new Date(2020, 2, 1),
            endDate   : new Date(2020, 6, 1),

            columns : [
                { field : 'name', text : 'Name' }
            ],

            features : {
                dependencies : true
            },

            resources : [
                { id : 1, name : 'Resource 1' },
                { id : 2, name : 'Resource 2' }
            ],

            events : [
                { id : 1, resourceId : 1, startDate : new Date(2020, 2, 4), duration : 2 },
                { id : 2, resourceId : 1, startDate : new Date(2020, 2, 10), duration : 2 },
                { id : 3, resourceId : 2, startDate : new Date(2020, 2, 4), duration : 2 },
                { id : 4, resourceId : 2, startDate : new Date(2020, 2, 10), duration : 2 }
            ],

            dependencies : [
                { id : 1, from : 1, to : 2 },
                { id : 2, from : 3, to : 4 }
            ]
        });

        t.chain(
            () => scheduler.subGrids.normal.collapse(),
            next => {
                scheduler.resourceStore.filter('name', 'Resource 1');
                next();
            },
            () => scheduler.subGrids.normal.expand(),
            { waitFor : () => document.querySelectorAll('.b-sch-dependency').length === 1, desc : 'One dependency line is visible' }
        );
    });

    t.it('Should refresh dependencies after project change', async t => {
        scheduler = new Scheduler({
            appendTo              : document.body,
            enableEventAnimations : false,
            features              : {
                dependencies : true
            },
            resources : [
                { id : 1, name : 'Albert' }
            ],
            events : [
                { id : 1, startDate : '2017-01-16', endDate : '2017-01-18' },
                { id : 2, startDate : '2017-01-20', endDate : '2017-01-22' }
            ],
            assignments : [
                { id : 1, resourceId : 1, eventId : 1 },
                { id : 2, resourceId : 1, eventId : 2 }
            ],
            dependencies : [
                { id : 1, fromEvent : 1, toEvent : 2 }
            ],

            startDate : new Date(2017, 0, 16),
            endDate   : new Date(2017, 0, 20),

            columns : [
                { field : 'name', text : 'Name' }
            ]
        });

        await t.waitForProjectReady();

        await t.waitForSelector('.b-sch-dependency');

        scheduler.project = {
            resourcesData : [
                { id : 1, name : 'Ben' }
            ],
            eventsData : [
                { id : 1, name : 'Source', startDate : '2017-01-16', endDate : '2017-01-17' },
                { id : 2, name : 'Target', startDate : '2017-01-18', endDate : '2017-01-19' }
            ],
            assignmentsData : [
                { id : 1, resourceId : 1, eventId : 1 },
                { id : 2, resourceId : 1, eventId : 2 }
            ],
            dependenciesData : [
                { id : 1, fromEvent : 1, toEvent : 2 }
            ]
        };

        await t.waitForProjectReady(scheduler);

        await t.waitForAnimationFrame();

        t.assertDependency(scheduler, scheduler.dependencyStore.first);
    });

    t.it('Should ignore store events when assigning project with feature disabled', async t => {
        scheduler = new Scheduler({
            appendTo              : document.body,
            enableEventAnimations : false,
            useInitialAnimation   : false,
            features              : {
                dependencies : {
                    disabled : true
                }
            },

            startDate : new Date(2017, 0, 16),
            endDate   : new Date(2017, 0, 20),

            columns : [
                { field : 'name', text : 'Name' }
            ]
        });

        await t.waitForProjectReady(scheduler);

        t.isntCalled('onEventChange', scheduler.features.dependencies);

        scheduler.project = new ProjectModel({
            resourcesData : [
                { id : 1, name : 'Albert' }
            ],
            eventsData : [
                { id : 1, startDate : '2017-01-16', endDate : '2017-01-18' },
                { id : 2, startDate : '2017-01-20', endDate : '2017-01-22' }
            ],
            assignmentsData : [
                { id : 1, resourceId : 1, eventId : 1 },
                { id : 2, resourceId : 1, eventId : 2 }
            ],
            dependenciesData : [
                { id : 1, fromEvent : 1, toEvent : 2 }
            ]
        });

        scheduler.eventStore.first.name = 'Prince';
    });
});
