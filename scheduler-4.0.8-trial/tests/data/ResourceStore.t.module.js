import { ResourceModel, ResourceStore, EventStore, ProjectModel, Model } from '../../build/scheduler.module.js?447702';

StartTest(t => {

    t.it('Id change should update assignment', async t => {
        const project = new ProjectModel({
            assignmentsData : [
                { id : 1, eventId : 1, resourceId : 'phantomResource' }
            ],
            resourcesData : [
                { id : 'phantomResource' }
            ],
            eventsData : [
                { id : 1 }
            ]
        });

        await project.commitAsync();

        // Happens for example as the result of a commit to backend
        project.resourceStore.first.id = 1;

        await project.commitAsync();

        t.is(project.assignmentStore.first.resourceId, project.resourceStore.first.id);
    });

    t.it('Sanity checks + phantom record handling', async t => {
        const eventStore = new EventStore({
            data : [
                { id : 1, name : 'Linda', startDate : '2010-12-09', endDate : '2010-12-13' }
            ]
        });

        const resourceStore = new ResourceStore({
            createUrl : 'lib/create_resource.json'
        });

        const project = new ProjectModel({
            eventStore,
            resourceStore
        });

        await project.commitAsync();

        const res = new resourceStore.modelClass();
        resourceStore.add(res);
        t.is(eventStore.getEventsForResource(res).length, 0, 'Should not find any events for a new resource');

        const ev = eventStore.first;

        ev.resource = res;
        t.is(ev.resource, res, 'Found phantom resource');
        t.is(res.events[0], ev, 'Found event by resource');

        const phantomResId = ev.resourceId;

        const handle = t.beginAsync();
        resourceStore.on('commitadded', async() => {
            await project.commitAsync();

            t.isnt(ev.resourceId, phantomResId, 'Found phantom resource');
            t.is(ev.resource, res, 'Found real resource');

            // Make sure we tolerate sloppy input with mixed types, ResourceId as string '1' and the Id of a Resource as int 1.
            ev.resourceId = 1;
            res.set('id', 1);
            t.is(eventStore.getEventsForResource(res)[0], ev, 'Should be able to use strings and int mixed, == check instead of ===');
            t.endAsync(handle);
        }, null, { delay : 1 });

        resourceStore.commit();
    });

    t.it('ResourceTreeStore init', t => {
        new ResourceStore({
            tree       : true,
            modelClass : class Mod2 extends ResourceModel {}
        });

        t.throwsOk(() => {
            new ResourceStore({
                tree       : true,
                modelClass : class Mod extends Model {}
            });
        }, 'Model for ResourceStore must subclass ResourceModel');
    });

    t.it('Basic instantiation', t => {
        const store = new ResourceStore({
            data : [{}]
        });

        t.isInstanceOf(store.first, ResourceModel, 'Should use ResourceModel');

        t.throwsOk(() => {
            new ResourceStore({
                modelClass : class Mod4 extends Model {}
            });
        }, 'Model for ResourceStore must subclass ResourceModel');
    });

    t.it('Assignments should be cleared upon removeAll(true)', async t => {
        const eventStore = new EventStore({
            data : [
                { id : 1, resourceId : 1 }
            ]
        });

        const resourceStore = new ResourceStore({
            data : [
                { id : 1, name : 'Linda' }
            ]
        });

        const project = new ProjectModel({
            eventStore,
            resourceStore
        });

        await project.commitAsync();

        const resource = resourceStore.first;

        t.is(resource.events.length, 1, 'Event found');

        eventStore.removeAll(true);

        t.is(resource.events.length, 0, 'Event gone');
    });

    t.it('Removing all resources should unassign all events', async t => {
        const eventStore = new EventStore({
            data : [
                { id : 1, resourceId : 1 },
                { id : 2, resourceId : 1 },
                { id : 3, resourceId : 2 }
            ]
        });

        const resourceStore = new ResourceStore({
            data : [
                { id : 1 },
                { id : 2 }
            ]
        });

        const project = new ProjectModel({
            eventStore,
            resourceStore
        });

        await project.commitAsync();

        resourceStore.removeAll();

        t.ok(eventStore.records.every(eventRecord => !eventRecord.resourceId), 'All events unassigned');
    });

    t.it('Data should be ready after addAsync()', async t => {
        const project = new ProjectModel({
            assignmentsData : [
                { id : 1, eventId : 1, resourceId : 1 },
                { id : 2, eventId : 2, resourceId : 1 }
            ],
            resourcesData : [],
            eventsData    : [
                { id : 1 },
                { id : 2 }
            ]
        });

        const [resource] = await project.resourceStore.addAsync({ id : 1 });

        t.isDeeply(resource.events, project.eventStore.records, 'Calculations performed');
    });

    t.it('Data should be ready after loadDataAsync()', async t => {
        const project = new ProjectModel({
            assignmentsData : [
                { id : 1, eventId : 1, resourceId : 1 },
                { id : 2, eventId : 2, resourceId : 1 }
            ],
            resourcesData : [],
            eventsData    : [
                { id : 1 },
                { id : 2 }
            ]
        });

        await project.resourceStore.loadDataAsync([{ id : 1 }]);

        t.isDeeply(project.resourceStore.first.events, project.eventStore.records, 'Calculations performed');
    });
});
