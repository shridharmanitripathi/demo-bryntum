import { AssignmentStore, DependencyStore, EventStore, ResourceStore, PresetManager, Scheduler } from '../../build/scheduler.module.js?447702';

StartTest(t => {
    Object.assign(window, {
        AssignmentStore,
        Scheduler,
        EventStore,
        ResourceStore,
        DependencyStore,
        PresetManager
    });

    let scheduler;

    t.beforeEach(() => {
        scheduler && scheduler.destroy();

        scheduler = t.getScheduler({
            id              : 'sched',
            appendTo        : document.body,
            dependencyStore : new DependencyStore(),
            features        : {
                eventTooltip : false
            },
            resourceStore : t.getResourceStore2({
            }, 10)
        }, 10);
    });

    function assertDepenencyType(t, from, to, type) {
        t.chain(
            { waitForSelector : '.event1' },

            { moveMouseTo : '.event1' },

            { drag : `.event1 .b-sch-terminal-${from}`, to : '.event2', dragOnly : true },

            { moveMouseTo : `.event2 .b-sch-terminal-${to}` },

            { mouseUp : `.event2 .b-sch-terminal-${to}` },

            () => {
                const dep = scheduler.dependencyStore.first;

                t.is(dep.fromEvent.name, 'Assignment 1');
                t.is(dep.toEvent.name, 'Assignment 2');
                t.is(dep.type, type);
                t.is(dep.fromSide, from);
                t.is(dep.toSide, to);
            }
        );
    }

    t.it('Left-to-left', t => {
        assertDepenencyType(t, 'left', 'left', 0);
    });

    t.it('Left-to-right', t => {
        assertDepenencyType(t, 'left', 'right', 1);
    });

    t.it('Left-to-top', t => {
        assertDepenencyType(t, 'left', 'top', 0);
    });

    t.it('Right-to-left', t => {
        assertDepenencyType(t, 'right', 'left', 2);
    });

    t.it('Right-to-right', t => {
        assertDepenencyType(t, 'right', 'right', 3);
    });

    t.it('Top-to-left', t => {
        assertDepenencyType(t, 'top', 'left', 2);
    });

    t.it('Top-to-right', t => {
        assertDepenencyType(t, 'top', 'right', 3);
    });

    t.it('Top-to-top', t => {
        assertDepenencyType(t, 'top', 'top', 2);
    });

    t.it('Top-to-bottom', t => {
        assertDepenencyType(t, 'top', 'bottom', 2);
    });

    t.it('Bottom-to-left', t => {
        assertDepenencyType(t, 'bottom', 'left', 2);
    });

    t.it('Bottom-to-right', t => {
        assertDepenencyType(t, 'bottom', 'right', 3);
    });

    t.it('Bottom-to-top', t => {
        assertDepenencyType(t, 'bottom', 'top', 2);
    });

    t.it('Bottom-to-bottom', t => {
        assertDepenencyType(t, 'bottom', 'bottom', 2);
    });
});
