import { Model, Store, AbstractCrudManager } from '../../build/scheduler.module.js?447702';

StartTest(t => {
    // Checks that crud manager 'haschanges' event catches removals and doesn't react on tree store collapse/expand #2413

    class TestModel extends Model {
        static get fields() {
            return ['id', 'text'];
        }
    }

    let someStore, crud;

    t.beforeEach(() => {
        someStore = new Store({
            modelClass : TestModel,
            tree       : true,
            data       : [{
                id       : 1,
                text     : '11',
                expanded : true,
                children : [
                    {
                        id   : 11,
                        text : '11',
                        leaf : true
                    },
                    {
                        id   : 12,
                        text : '11',
                        leaf : true
                    }
                ]
            }
            ]
        });

        crud = new AbstractCrudManager({
            stores : [
                { store : someStore, storeId : 'foo' }
            ]
        });
    });

    t.it('haschanges event fired when removing child node', t => {
        t.notOk(crud.getChangeSetPackage(), 'No changes initially');

        t.willFireNTimes(crud, 'haschanges', 1);

        someStore.getById(12).remove();

        t.ok(crud.hasChanges(), 'hasChanges() is true');
    });

    // expand/collapse is done by tree feature, this test does not apply currently...
    t.xit('haschanges event is not fired during nodes collapse/expand', t => {
        t.notOk(crud.getChangeSetPackage(), 'No changes initially');

        t.wontFire(crud, 'haschanges');

        const node = someStore.getNodeById(1);

        node.collapse();

        t.notOk(crud.hasChanges(), 'hasChanges() is false');

        node.expand();

        t.notOk(crud.hasChanges(), 'hasChanges() is still false');
    });
});
