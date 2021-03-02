StartTest(t => {
    let scheduler;

    t.beforeEach(t => scheduler?.destroy?.());

    t.it('Should be able to scroll during paint without height', async t => {
        // Ignore grid height warning
        t.spyOn(console, 'warn').and.callFake(() => {});

        scheduler = t.getScheduler({
            height : 0,

            listeners : {
                paint({ source : scheduler }) {
                    scheduler.scrollToDate(new Date(2020, 9, 7));
                }
            }
        });

        await t.waitForSelector('.b-sch-header-timeaxis-cell:textEquals(We 07)');

        t.pass('Scrolled without crashing');
    });
});
