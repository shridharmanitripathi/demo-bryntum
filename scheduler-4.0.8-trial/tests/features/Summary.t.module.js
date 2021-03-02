
StartTest(t => {
    let scheduler;

    async function createSingleSummary() {
        scheduler = t.getScheduler({
            viewPreset : 'hourAndDay',
            height     : 300,
            features   : {
                summary : {
                    renderer : ({ events }) => events.length || ''
                }
            },

            startDate : new Date(2017, 0, 1),
            endDate   : new Date(2017, 0, 1, 8),

            columns : [
                {
                    text            : 'Name',
                    field           : 'name',
                    width           : 200,
                    locked          : true,
                    sum             : 'count',
                    summaryRenderer : ({ sum }) => 'Total: ' + sum
                }
            ],

            resources : [
                { id : 1, name : 'Steve', job : 'Carpenter' },
                { id : 2, name : 'John', job : 'Contractor' }
            ],
            events : [
                {
                    id         : 1,
                    name       : 'Work',
                    resourceId : 1,
                    startDate  : new Date(2017, 0, 1, 1),
                    endDate    : new Date(2017, 0, 1, 2)
                },
                {
                    id         : 2,
                    name       : 'Play',
                    resourceId : 2,
                    startDate  : new Date(2017, 0, 1, 1),
                    endDate    : new Date(2017, 0, 1, 2)
                },
                {
                    id         : 3,
                    name       : 'Plan',
                    resourceId : 2,
                    startDate  : new Date(2017, 0, 1, 3),
                    endDate    : new Date(2017, 0, 1, 4)
                }
            ]
        });

        await t.waitForProjectReady();
    }

    async function createMultiSummary() {
        scheduler = t.getScheduler({
            viewPreset : 'hourAndDay',
            height     : 300,
            features   : {
                summary : {
                    summaries : [
                        { label : 'Count', renderer : ({ events }) => events.length || '' },
                        { label : 'Steve', renderer : ({ events }) => events.filter(event => event.resource.name === 'Steve').length || '' }
                    ]

                }
            },

            startDate : new Date(2017, 0, 1),
            endDate   : new Date(2017, 0, 1, 8),

            columns : [
                {
                    text            : 'Name',
                    field           : 'name',
                    width           : 200,
                    locked          : true,
                    sum             : 'count',
                    summaryRenderer : ({ sum }) => 'Total: ' + sum
                }
            ],

            resources : [
                { id : 1, name : 'Steve', job : 'Carpenter' },
                { id : 2, name : 'John', job : 'Contractor' }
            ],
            events : [
                {
                    id         : 1,
                    name       : 'Work',
                    resourceId : 1,
                    startDate  : new Date(2017, 0, 1, 1),
                    endDate    : new Date(2017, 0, 1, 2)
                },
                {
                    id         : 2,
                    name       : 'Play',
                    resourceId : 2,
                    startDate  : new Date(2017, 0, 1, 1),
                    endDate    : new Date(2017, 0, 1, 2)
                },
                {
                    id         : 3,
                    name       : 'Plan',
                    resourceId : 2,
                    startDate  : new Date(2017, 0, 1, 3),
                    endDate    : new Date(2017, 0, 1, 4)
                }
            ]
        });

        await t.waitForProjectReady();
    }

    t.beforeEach(t => scheduler?.destroy());

    t.it('Rendering sanity checks', async t => {
        await createSingleSummary();

        t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(1)', '');
        t.contentLike('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(2) .b-timeaxis-summary-value', /^2$/);
        t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(3)', '');
        t.contentLike('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(4) .b-timeaxis-summary-value', /^1$/);
        t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(5)', '');
        t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(6)', '');
        t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(7)', '');
        t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(8)', '');

        t.hasSameWidth('.b-grid-footer.b-sch-timeaxiscolumn', '.b-grid-header.b-sch-timeaxiscolumn', 'footer el sized as header el');
        t.hasSameWidth('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(1)', '.b-sch-header-row-main .b-sch-header-timeaxis-cell:nth-child(1)');
        t.hasSameWidth('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(2)', '.b-sch-header-row-main .b-sch-header-timeaxis-cell:nth-child(2)');
        t.hasSameWidth('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(3)', '.b-sch-header-row-main .b-sch-header-timeaxis-cell:nth-child(3)');
        t.hasSameWidth('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(4)', '.b-sch-header-row-main .b-sch-header-timeaxis-cell:nth-child(4)');
        t.hasSameWidth('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(5)', '.b-sch-header-row-main .b-sch-header-timeaxis-cell:nth-child(5)');
        t.hasSameWidth('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(6)', '.b-sch-header-row-main .b-sch-header-timeaxis-cell:nth-child(6)');
        t.hasSameWidth('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(7)', '.b-sch-header-row-main .b-sch-header-timeaxis-cell:nth-child(7)');
    });

    t.it('Should refresh once after data set', async t => {
        await createSingleSummary();

        const spy = t.spyOn(scheduler.features.summary, 'updateScheduleSummaries');
        scheduler.events = [];

        await t.waitForProjectReady();

        t.expect(spy).toHaveBeenCalled(1);
    });

    t.it('Should refresh once after event remove', async t => {
        await createSingleSummary();

        const spy = t.spyOn(scheduler.features.summary, 'updateScheduleSummaries');
        scheduler.eventStore.remove(scheduler.eventStore.last);

        await t.waitForProjectReady();

        t.expect(spy).toHaveBeenCalled(1);

        t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(1)', '');
        t.contentLike('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(2) .b-timeaxis-summary-value', /^2$/);
        t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(3)', '');
        t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(4)', '');
        t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(5)', '');
        t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(6)', '');
        t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(7)', '');
        t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(8)', '');
    });

    t.it('Should not count event that has no resource in view', async t => {
        await createSingleSummary();

        scheduler.eventStore.last.resourceId = null;

        await t.waitForProjectReady();

        t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(1)', '');
        t.contentLike('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(2) .b-timeaxis-summary-value', /^2$/);
        t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(3)', '');
        t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(4)', '');
        t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(5)', '');
        t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(6)', '');
        t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(7)', '');
        t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(8)', '');
    });

    t.it('Should not count filtered out event ', async t => {
        await createSingleSummary();
        scheduler.eventStore.filter(ev => ev.name !== 'Plan');

        t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(1)', '');
        t.contentLike('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(2) .b-timeaxis-summary-value', /^2$/);
        t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(3)', '');
        t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(4)', '');
        t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(5)', '');
        t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(6)', '');
        t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(7)', '');
        t.elementIsEmpty('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(8)', '');
    });

    t.it('Should redraw ticks when time axis view model is changed', async t => {
        await createSingleSummary();
        t.selectorCountIs('.b-grid-footer.b-sch-timeaxiscolumn .b-timeaxis-tick', 8);
        t.is(document.querySelector('.b-grid-footer.b-sch-timeaxiscolumn .b-timeaxis-tick').offsetWidth,
            document.querySelector('.b-sch-header-row:last-child .b-sch-header-timeaxis-cell').offsetWidth);

        scheduler.setTimeSpan(new Date(2017, 0, 1, 8), new Date(2017, 0, 1, 18));

        t.selectorCountIs('.b-grid-footer.b-sch-timeaxiscolumn .b-timeaxis-tick', 10);

        scheduler.setTimeSpan(new Date(2017, 0, 1, 8), new Date(2017, 0, 1, 18));

        scheduler.timeAxisViewModel.setTickSize(200);

        t.is(document.querySelector('.b-grid-footer.b-sch-timeaxiscolumn .b-timeaxis-tick').offsetWidth,
            document.querySelector('.b-sch-header-row:last-child .b-sch-header-timeaxis-cell').offsetWidth);
    });

    t.it('Multiple summaries should be supported', async t => {
        await createMultiSummary();

        t.selectorExists('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(2) :nth-child(1):textEquals(2)', 'First sum correct');
        t.selectorExists('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(2) :nth-child(2):textEquals(1)', 'Second sum correct');
        t.selectorExists('.b-grid-footer.b-sch-timeaxiscolumn :nth-child(4) :nth-child(1):textEquals(1)', 'Third sum correct');

        t.chain(
            { moveMouseTo : '.b-grid-footer.b-sch-timeaxiscolumn :nth-child(2) :nth-child(1)' },

            { waitForSelector : '.b-timeaxis-summary-tip' },

            () => {
                t.selectorExists('.b-timeaxis-summary-tip label:textEquals(Count)', 'Count label found');
                t.selectorExists('.b-timeaxis-summary-tip .b-timeaxis-summary-value:first-of-type:textEquals(2)', 'Correct sum');
                t.selectorExists('.b-timeaxis-summary-tip label:textEquals(Steve)', 'Steve label found');
                t.selectorExists('.b-timeaxis-summary-tip .b-timeaxis-summary-value:textEquals(1)', 'Correct sum');
            }
        );
    });

    t.it('Should support disabling', async t => {
        await createSingleSummary();

        scheduler.features.summary.disabled = true;

        t.elementIsNotVisible(scheduler.footerContainer, 'Summaries hidden');

        scheduler.features.summary.disabled = false;

        t.elementIsVisible(scheduler.footerContainer, 'Summaries shown');

    });

    // https://github.com/bryntum/support/issues/70
    t.it('Should align with columns when autoAdjustTimeAxis is set to false', async t => {
        await t.getSchedulerAsync({
            viewPreset         : 'weekAndMonth',
            autoAdjustTimeAxis : false,
            features           : {
                summary : {
                    renderer : ({ events }) => events.length || ''
                }
            }
        });
        
        const
            middleHeaderCells = t.query('.b-sch-header-row-1 .b-sch-header-timeaxis-cell'),
            summaryCells      = t.query('.b-grid-footer.b-sch-timeaxiscolumn .b-timeaxis-tick');

        summaryCells.forEach((element, idx) => {
            t.is(element.offsetWidth, middleHeaderCells[idx].offsetWidth, `Summary column for ${middleHeaderCells[idx].innerText} aligned`);
        });
    });
});
