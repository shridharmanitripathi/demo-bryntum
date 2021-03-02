import { EventModel } from '../../build/scheduler.module.js?447702';

StartTest(t => {
    let scheduler;

    t.beforeEach(() => scheduler?.destroy());

    t.it('Should resume refresh when resource store is reduced', async t => {
        scheduler = await t.getSchedulerAsync({
            resourceStore : t.getResourceStore2({}, 100),
            eventStore    : t.getEventStore({}, 100)
        });

        t.chain(
            { waitForSelector : '.b-grid-row' },
            async() => {
                scheduler.suspendRefresh();

                scheduler.endDate = new Date(2011, 0, 9);

                scheduler.project = {
                    eventStore : {
                        useRawData : true,
                        data       : [{
                            id        : 1,
                            startDate : new Date(2011, 0, 5),
                            duration  : 5
                        }]
                    },
                    resourceStore : {
                        useRawData : true,
                        data       : [{ id : 1, name : 'Foo' }]
                    },
                    assignmentStore : {
                        useRawData : true,
                        data       : [{ id : 1, resource : 1, event : 1 }]
                    }
                };

                scheduler.resumeRefresh(true);

                // Test should not throw before dataReady is fired
                await scheduler.project.await('dataReady', false);
            },

            { waitFor : () => document.querySelectorAll('.b-grid-row').length === 2 }
        );
    });

    t.it('Should render event name when name field is defined with dataSource', async t => {
        class CustomEventModel extends EventModel {
            static get fields() {
                return [
                    { name : 'name', dataSource : 'desc' }
                ];
            }
        }

        scheduler = await t.getScheduler({
            startDate  : new Date(2017, 0, 1, 10),
            endDate    : new Date(2017, 0, 1, 12),
            resources  : [{ id : 'r1', name : 'Mike' }],
            eventStore : {
                modelClass : CustomEventModel,
                data       : [
                    {
                        id         : 1,
                        resourceId : 'r1',
                        startDate  : new Date(2017, 0, 1, 10),
                        endDate    : new Date(2017, 0, 1, 12),
                        desc       : 'Other field'
                    }
                ]
            }
        });

        await t.waitForSelector('.b-sch-event:contains(Other field)');
    });

    t.it('Should not flood assignmentStore changes when events are added', async t => {
        scheduler = await t.getScheduler({
            events        : [],
            resourceStore : t.getResourceStore2(null, 100)
        });

        t.firesOnce(scheduler.assignmentStore, 'change');

        const eventStore = t.getEventStore(null, 1000);

        scheduler.eventStore.add(eventStore.toJSON());

        await t.waitForSelector('.b-sch-event:contains(Assignment 1)');
    });
});
