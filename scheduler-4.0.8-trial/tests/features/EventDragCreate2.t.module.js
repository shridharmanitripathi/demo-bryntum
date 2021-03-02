
StartTest(t => {
    let scheduler;

    t.beforeEach(() => scheduler && scheduler.destroy());

    // #8943 - https://app.assembla.com/spaces/bryntum/tickets/8943
    t.it('Should not crash after drag-create', t => {

        let eventDragged = false;

        scheduler = t.getScheduler({
            appendTo : document.body,

            resources : [
                { id : 'r1', name : 'Resource 1' }
            ],

            events : [],

            features : {
                eventEdit : true
            },

            listeners : {
                eventDrag() {
                    eventDragged = true;
                }
            }
        });

        t.chain(
            { drag : '.b-sch-timeaxis-cell', offset : [100, '50%'], by : [200, 0] },

            { waitForSelector : '.b-eventeditor' },

            { type : '123[ENTER]' },

            { waitForSelectorNotFound : '.b-eventeditor' },

            { drag : scheduler.eventSelector, by : [50, 0] },

            () => {
                t.ok(eventDragged, 'Event dragged w/o issues');
            }
        );
    });

    // #8943 - https://app.assembla.com/spaces/bryntum/tickets/8943
    t.it('Should not crash after drag-create with Scheduler in multi-assignment mode', t => {

        let eventDragged = false;

        scheduler = t.getScheduler({
            appendTo : document.body,

            resources : [
                { id : 'r1', name : 'Resource 1' }
            ],

            events : [
                { id : 'e1', name : '123', startDate : new Date(2011, 0, 5), endDate : new Date(2011, 0, 6) }
            ],

            assignments : [
                { id : 'a1', eventId : 'e1', resourceId : 'r1' }
            ],

            features : {
                eventEdit    : true,
                eventTooltip : false
            },

            listeners : {
                eventDrag() {
                    eventDragged = true;
                }
            }
        });

        t.chain(
            { drag : '.b-sch-timeaxis-cell', offset : [100, '50%'], by : [200, 0] },

            { waitForSelector : '.b-eventeditor' },

            { type : '123[ENTER]' },

            { waitForSelectorNotFound : '.b-eventeditor' },

            { drag : scheduler.eventSelector + ' .b-sch-dirty-new', by : [50, 0] },

            () => {
                t.ok(eventDragged, 'Event dragged w/o issues');
            }
        );
    });

    // https://github.com/bryntum/support/issues/1376
    t.it('Should not get stuck after minimal drag create', async t => {
        await t.getSchedulerAsync({ events : []  });

        t.chain(
            { drag : '.b-sch-timeaxis-cell', offset : [100, '50%'], by : [3, 0] },

            () => {
                t.selectorNotExists('.b-sch-dragcreator-proxy', 'No proxy element found');
            }
        );
    });
});
