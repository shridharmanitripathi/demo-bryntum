import { PresetManager, EventStore, ResourceStore, Scheduler, ResourceFilter } from '../../build/scheduler.module.js?447702';

StartTest(t => {
    Object.assign(window, {
        Scheduler,
        EventStore,
        ResourceStore,
        PresetManager
    });

    let scheduler, filter;

    t.beforeEach(() => {
        scheduler && scheduler.destroy();
        filter && filter.destroy();

        scheduler = t.getScheduler({
            height : 200
        });
    });

    t.it('Should filter eventStore when toggling list items', async t => {
        filter = new ResourceFilter({
            eventStore : scheduler.eventStore,
            appendTo   : document.body
        });

        await t.click('.b-resourcefilter .b-list-item:contains(Mike)');
        await t.waitForSelectorNotFound(`${scheduler.unreleasedEventSelector}:contains(Assignment 1)`);
        t.ok(scheduler.eventStore.isFiltered);

        await t.click('.b-resourcefilter .b-list-item:contains(Mike)');
        await t.waitForSelector(`${scheduler.unreleasedEventSelector}:contains(Assignment 1)`);
        t.notOk(scheduler.eventStore.isFiltered);
    });

    t.it('Should toggle all items if CTRL is pressed', async t => {
        filter = new ResourceFilter({
            eventStore : scheduler.eventStore,
            appendTo   : document.body
        });

        await t.click('.b-resourcefilter .b-list-item:contains(Mike)', null, null, { ctrlKey : true });
        await t.waitForSelectorNotFound(`.b-resourcefilter .b-list-item.b-selected`);
        await t.waitForSelectorNotFound(scheduler.unreleasedEventSelector);
        t.ok(scheduler.eventStore.isFiltered);

        await t.click('.b-resourcefilter .b-list-item:contains(Mike)', null, null, { ctrlKey : true });
        await t.waitForSelectorNotFound(`.b-resourcefilter .b-list-item:not(.b-selected)`);
        await t.waitForSelector(`${scheduler.unreleasedEventSelector}`);
        t.selectorCountIs(scheduler.unreleasedEventSelector, 5);
        t.notOk(scheduler.eventStore.isFiltered);
    });
});
