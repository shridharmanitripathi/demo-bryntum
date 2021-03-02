import { Scheduler, EventStore, ResourceStore } from '../../build/scheduler.module.js?447702';

StartTest(t => {
    Object.assign(window, {
        Scheduler,
        EventStore,
        ResourceStore
    });

    let scheduler;

    t.beforeEach(t => {
        scheduler && scheduler.destroy();
    });

    // Events disappear after vertical scroll
    // https://github.com/bryntum/support/issues/1087
    t.it('Should keep events visible after filter and vertical scroll', t => {
        const
            events = [],
            resources = [];

        for (let i = 1; i <= 50; i++) {
            resources.push({
                id   : i,
                name : `Resource ${i}`
            });

            events.push({
                resourceId   : i,
                name         : `Event ${i}`,
                startDate    : `2020-06-29 ${i % 2 ? '01:00:00' : '02:00'}`,
                duration     : 4,
                durationUnit : 'h'
            });
        }

        scheduler = t.getScheduler({
            viewPreset : 'hourAndDay',
            height     : 300,
            features   : {
                filterBar : true,
                stripe    : true
            },

            startDate : new Date(2020, 5, 29),
            endDate   : new Date(2020, 5, 29, 8),

            columns : [
                {
                    text  : 'Name',
                    field : 'name',
                    width : 200
                }
            ],

            resources,
            events
        });

        t.chain(
            { waitForSelector : scheduler.unreleasedEventSelector },
            async() => {
                await Promise.all([
                    t.type('.b-filter-bar-field input', 'resource'),
                    scheduler.resourceStore.await('filter', { checkLog : false })
                ]);

                scheduler.scrollTop = 50;

                await scheduler.scrollable.await('scrollEnd', { checkLog : false });

                t.selectorCountIs(scheduler.unreleasedEventSelector, scheduler.timeAxisSubGrid.element.querySelectorAll('.b-grid-row').length, 'One event per resource is rendered');
            }
        );
    });

    // https://github.com/bryntum/support/issues/2120
    t.it('Should have field name property available on filterable function parameter', t => {
        let propName;

        scheduler = t.getScheduler({
            features : {
                filterBar : true
            },
            columns  : [
                {
                    text       : 'Name',
                    field      : 'name',
                    filterable : ({ property }) => {
                        propName = property;
                        return true;
                    }
                }
            ]
        });

        scheduler.store.filter({
            property : 'name',
            value    : 'Mike'
        });

        t.is(propName, 'name', 'Field name property is available with correct value');
    });
});
