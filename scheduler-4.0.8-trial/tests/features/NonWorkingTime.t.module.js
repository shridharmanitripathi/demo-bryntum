
StartTest(t => {
    let scheduler;

    t.beforeEach(t => {
        scheduler?.destroy();

        scheduler = t.getScheduler({
            startDate  : new Date(2018, 1, 1),
            endDate    : new Date(2018, 1, 15),
            viewPreset : 'weekAndDayLetter',
            height     : 300,
            features   : {
                nonWorkingTime : true
            }
        });
    });

    t.it('Rendering sanity checks', t => {
        t.chain(
            { waitForSelector : '.b-grid-headers .b-sch-nonworkingtime', desc : 'Should find range element in header' },
            () => {
                t.isApprox(document.querySelector('.b-grid-headers .b-sch-nonworkingtime').offsetHeight, document.querySelector('.b-grid-headers').offsetHeight / 2, 'non working time elements has half height of 2-level header');
            }
        );
    });

    t.it('Should support disabling', t => {
        scheduler.features.nonWorkingTime.disabled = true;

        t.selectorNotExists('.b-sch-timerange', 'No timeranges');

        scheduler.features.nonWorkingTime.disabled = false;

        t.selectorExists('.b-sch-timerange', 'Timeranges found');

    });
});
