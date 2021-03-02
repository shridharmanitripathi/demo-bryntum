
StartTest(t => {
    let scheduler;
    const createScheduler = async config => {

        scheduler = t.getScheduler(Object.assign({
            viewPreset : 'hourAndDay',
            height     : 300,
            features   : {
                group        : 'job',
                groupSummary : {
                    summaries : [
                        {
                            label    : 'Count',
                            renderer : ({ events }) => events.length
                        },
                        {
                            label    : 'Carpenters',
                            renderer : ({ events }) => events.filter(event => event.resource.job === 'Carpenter').length
                        }
                    ]
                },
                eventTooltip    : false,
                scheduleTooltip : false,
                eventEdit       : false
            },

            startDate : new Date(2017, 0, 1),
            endDate   : new Date(2017, 0, 1, 8),

            columns : [
                {
                    text      : 'Name',
                    field     : 'name',
                    width     : 200,
                    summaries : [{ sum : 'count', label : 'Persons' }]
                }
            ],

            resources : [
                { id : 1, name : 'Steve', job : 'Carpenter' },
                { id : 2, name : 'Linda', job : 'Carpenter' },
                { id : 3, name : 'John', job : 'Painter' }
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
                },
                {
                    id         : 4,
                    name       : 'Plan',
                    resourceId : 3,
                    startDate  : new Date(2017, 0, 1, 3),
                    endDate    : new Date(2017, 0, 1, 4)
                }
            ]
        }, config));

        await t.waitForProjectReady(scheduler);

        return scheduler;
    };

    t.beforeEach(() => {
        scheduler && scheduler.destroy();
    });

    t.it('Rendering sanity checks', async t => {
        scheduler = await createScheduler();

        t.contentLike('.b-grid-cell.b-group-title', 'Carpenter (2)');

        t.selectorExists('.b-grid-subgrid-locked .b-grid-summary-label:textEquals(Persons)');
        t.selectorExists('.b-grid-subgrid-locked .b-grid-summary-value:textEquals(2)');

        t.selectorExists('.b-timeaxis-group-summary :nth-child(1):textEquals(00)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(2):textEquals(22)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(3):textEquals(00)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(4):textEquals(11)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(5):textEquals(00)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(6):textEquals(00)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(7):textEquals(00)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(8):textEquals(00)');

        t.hasSameWidth('.b-timeaxis-group-summary :nth-child(1)', '.b-sch-header-row-main .b-sch-header-timeaxis-cell:nth-child(1)');
        t.hasSameWidth('.b-timeaxis-group-summary :nth-child(2)', '.b-sch-header-row-main .b-sch-header-timeaxis-cell:nth-child(2)');
        t.hasSameWidth('.b-timeaxis-group-summary :nth-child(3)', '.b-sch-header-row-main .b-sch-header-timeaxis-cell:nth-child(3)');
        t.hasSameWidth('.b-timeaxis-group-summary :nth-child(4)', '.b-sch-header-row-main .b-sch-header-timeaxis-cell:nth-child(4)');
        t.hasSameWidth('.b-timeaxis-group-summary :nth-child(5)', '.b-sch-header-row-main .b-sch-header-timeaxis-cell:nth-child(5)');
        t.hasSameWidth('.b-timeaxis-group-summary :nth-child(6)', '.b-sch-header-row-main .b-sch-header-timeaxis-cell:nth-child(6)');
        t.hasSameWidth('.b-timeaxis-group-summary :nth-child(7)', '.b-sch-header-row-main .b-sch-header-timeaxis-cell:nth-child(7)');
        t.hasSameWidth('.b-timeaxis-group-summary :nth-child(8)', '.b-sch-header-row-main .b-sch-header-timeaxis-cell:nth-child(8)');
    });

    t.it('Should refresh after event move', async t => {
        scheduler = await createScheduler();
        scheduler.eventStore.first.setStartDate(new Date(2017, 0, 1, 2), true);

        await scheduler.project.commitAsync();

        t.selectorExists('.b-timeaxis-group-summary :nth-child(1):textEquals(00)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(2):textEquals(11)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(3):textEquals(11)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(4):textEquals(11)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(5):textEquals(00)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(6):textEquals(00)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(7):textEquals(00)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(8):textEquals(00)');
    });

    t.it('Should refresh after event remove', async t => {
        scheduler = await createScheduler();

        scheduler.eventStore.first.remove();

        await scheduler.project.commitAsync();

        t.selectorExists('.b-timeaxis-group-summary :nth-child(1):textEquals(00)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(2):textEquals(11)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(3):textEquals(00)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(4):textEquals(11)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(5):textEquals(00)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(6):textEquals(00)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(7):textEquals(00)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(8):textEquals(00)');
    });

    t.it('Should not count event that has no resource in view', async t => {
        scheduler = await createScheduler();
        scheduler.eventStore.first.resourceId = null;

        await t.waitForProjectReady();

        t.selectorExists('.b-timeaxis-group-summary :nth-child(1):textEquals(00)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(2):textEquals(11)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(3):textEquals(00)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(4):textEquals(11)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(5):textEquals(00)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(6):textEquals(00)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(7):textEquals(00)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(8):textEquals(00)');
    });

    t.it('Should not count filtered out event ', async t => {
        scheduler = await createScheduler();
        scheduler.eventStore.filter(ev => ev.name !== 'Plan');

        t.selectorExists('.b-timeaxis-group-summary :nth-child(1):textEquals(00)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(2):textEquals(22)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(3):textEquals(00)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(4):textEquals(00)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(5):textEquals(00)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(6):textEquals(00)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(7):textEquals(00)');
        t.selectorExists('.b-timeaxis-group-summary :nth-child(8):textEquals(00)');
    });

    t.it('Should redraw ticks when time axis view model is changed', async t => {
        scheduler = await createScheduler();
        t.selectorCountIs('.b-group-footer[data-index="3"] .b-timeaxis-tick', 8);
        t.is(document.querySelector('.b-group-footer .b-timeaxis-tick').offsetWidth,
            document.querySelector('.b-sch-header-row:last-child .b-sch-header-timeaxis-cell').offsetWidth);

        scheduler.setTimeSpan(new Date(2017, 0, 1, 8), new Date(2017, 0, 1, 18));

        t.selectorCountIs('.b-group-footer[data-index="3"] .b-timeaxis-tick', 10);

        scheduler.setTimeSpan(new Date(2017, 0, 1, 8), new Date(2017, 0, 1, 18));

        scheduler.timeAxisViewModel.setTickSize(200);

        t.is(document.querySelector('.b-group-footer .b-timeaxis-tick').offsetWidth,
            document.querySelector('.b-sch-header-row:last-child .b-sch-header-timeaxis-cell').offsetWidth);
    });

    t.it('Should display tooltip', async t => {
        scheduler = await createScheduler();
        t.chain(
            { moveMouseTo : '.b-timeaxis-group-summary .b-timeaxis-tick:nth-child(2) .b-timeaxis-summary-value' },

            { waitForSelector : '.b-timeaxis-summary-tip' },

            () => {
                t.selectorExists('.b-timeaxis-summary-tip label:textEquals(Count)', 'Count label found');
                t.selectorExists('.b-timeaxis-summary-tip .b-timeaxis-summary-value:first-of-type:textEquals(2)', 'Correct sum');
                t.selectorExists('.b-timeaxis-summary-tip label:textEquals(Carpenters)', 'Carpenters label found');
                t.selectorExists('.b-timeaxis-summary-tip .b-timeaxis-summary-value:textEquals(2)', 'Correct sum');
            }
        );
    });

    // https://app.assembla.com/spaces/bryntum/tickets/7619
    t.it('Should not create a new event when dblclicking footer', async t => {
        scheduler = await createScheduler();
        t.chain(
            { dblclick : '.b-timeaxis-group-summary' },

            () => {
                t.selectorCountIs('.b-sch-event', 4, 'No new event rendered');
                t.is(scheduler.eventStore.count, 4, 'No new event in store');
            }
        );
    });

    t.it('Should support disabling', async t => {
        scheduler = await createScheduler();
        scheduler.features.groupSummary.disabled = true;

        t.selectorNotExists('.b-timeaxis-group-summary', 'No summary');

        scheduler.features.groupSummary.disabled = false;

        t.selectorExists('.b-timeaxis-group-summary', 'Summary shown');
    });

    t.it('Should not show empty meta rows after remove all from the group', async t => {
        scheduler = await createScheduler();
        t.chain(
            { waitForRowsVisible : scheduler },
            { contextmenu : '.b-grid-cell:textEquals(Steve)' },
            { click : '.b-menu-text:textEquals(Delete record)' },
            { contextmenu : '.b-grid-cell:textEquals(Linda)' },
            { click : '.b-menu-text:textEquals(Delete record)' },
            { waitForSelectorNotFound : '.b-group-title:textEquals(Carpenter (0))' },
            () => {
                t.pass('Empty group not shown');
            }
        );
    });

    t.it('collapseToHeader', async t => {
        scheduler = await createScheduler();
        scheduler.features.groupSummary.collapseToHeader = true;

        const
            { rowManager }   = scheduler,
            expandedRowCount = rowManager.rowCount;

        await scheduler.scrollable.scrollTo(null, scheduler.scrollable.maxY);

        await t.click('[data-id="group-header-Painter"] .b-group-title');

        t.is(rowManager.rowCount, expandedRowCount - 2);

        const schedulerSummaryRow = rowManager.lastVisibleRow.elements.normal;

        t.selectorCountIs('.b-timeaxis-tick:nth-child(1) .b-timeaxis-summary-value:nth-child(1):textEquals(0)', schedulerSummaryRow, 1);
        t.selectorCountIs('.b-timeaxis-tick:nth-child(1) .b-timeaxis-summary-value:nth-child(2):textEquals(0)', schedulerSummaryRow, 1);
        t.selectorCountIs('.b-timeaxis-tick:nth-child(2) .b-timeaxis-summary-value:nth-child(1):textEquals(0)', schedulerSummaryRow, 1);
        t.selectorCountIs('.b-timeaxis-tick:nth-child(2) .b-timeaxis-summary-value:nth-child(2):textEquals(0)', schedulerSummaryRow, 1);
        t.selectorCountIs('.b-timeaxis-tick:nth-child(3) .b-timeaxis-summary-value:nth-child(1):textEquals(0)', schedulerSummaryRow, 1);
        t.selectorCountIs('.b-timeaxis-tick:nth-child(3) .b-timeaxis-summary-value:nth-child(2):textEquals(0)', schedulerSummaryRow, 1);
        t.selectorCountIs('.b-timeaxis-tick:nth-child(4) .b-timeaxis-summary-value:nth-child(1):textEquals(1)', schedulerSummaryRow, 1);
        t.selectorCountIs('.b-timeaxis-tick:nth-child(4) .b-timeaxis-summary-value:nth-child(2):textEquals(0)', schedulerSummaryRow, 1);
        t.selectorCountIs('.b-timeaxis-tick:nth-child(5) .b-timeaxis-summary-value:nth-child(1):textEquals(0)', schedulerSummaryRow, 1);
        t.selectorCountIs('.b-timeaxis-tick:nth-child(5) .b-timeaxis-summary-value:nth-child(2):textEquals(0)', schedulerSummaryRow, 1);
        t.selectorCountIs('.b-timeaxis-tick:nth-child(6) .b-timeaxis-summary-value:nth-child(1):textEquals(0)', schedulerSummaryRow, 1);
        t.selectorCountIs('.b-timeaxis-tick:nth-child(6) .b-timeaxis-summary-value:nth-child(2):textEquals(0)', schedulerSummaryRow, 1);
        t.selectorCountIs('.b-timeaxis-tick:nth-child(7) .b-timeaxis-summary-value:nth-child(1):textEquals(0)', schedulerSummaryRow, 1);
        t.selectorCountIs('.b-timeaxis-tick:nth-child(7) .b-timeaxis-summary-value:nth-child(2):textEquals(0)', schedulerSummaryRow, 1);
        t.selectorCountIs('.b-timeaxis-tick:nth-child(8) .b-timeaxis-summary-value:nth-child(1):textEquals(0)', schedulerSummaryRow, 1);
        t.selectorCountIs('.b-timeaxis-tick:nth-child(8) .b-timeaxis-summary-value:nth-child(2):textEquals(0)', schedulerSummaryRow, 1);

        // Collapse Capenter grouo
        await t.click('[data-id="group-header-Carpenter"] .b-group-title');

        t.is(rowManager.rowCount, 2);

        // Expand Capenter grouo
        await t.click('[data-id="group-header-Carpenter"] .b-group-title');

        t.is(rowManager.rowCount, expandedRowCount - 2);

        // Data cell in the scheduler part must be empty
        t.selectorCountIs('.b-timeline-subgrid .b-grid-row[data-index="1"] .b-sch-timeaxis-cell:textEquals()', 1);
    });

    // https://github.com/bryntum/support/issues/1897
    t.it('Should pass group parameters to renderer', async t => {
        scheduler = await createScheduler({
            features : {
                group        : 'job',
                groupSummary : {
                    summaries : [
                        {
                            label    : 'Count',
                            renderer : ({ events, groupRecord, groupField, groupValue }) => {
                                t.ok(groupRecord);
                                t.is(groupField, 'job');
                                t.ok(['Painter', 'Carpenter'].includes(groupValue));
                                return events.length;
                            }
                        }
                    ]
                },
                eventTooltip    : false,
                scheduleTooltip : false,
                eventEdit       : false
            }
        });
    });

    // https://github.com/bryntum/support/issues/70
    t.it('Should align with columns when autoAdjustTimeAxis is set to false', async t => {
        scheduler = await createScheduler({
            viewPreset         : 'weekAndMonth',
            autoAdjustTimeAxis : false,
            startDate          : new Date(2017, 0, 4),
            endDate            : new Date(2017, 0, 9),
            events : [
                {
                    id         : 1,
                    name       : 'Work',
                    resourceId : 1,
                    startDate  : new Date(2017, 0, 4),
                    endDate    : new Date(2017, 0, 5)
                },
                {
                    id         : 2,
                    name       : 'Play',
                    resourceId : 2,
                    startDate  : new Date(2017, 0, 5),
                    endDate    : new Date(2017, 0, 6)
                },
                {
                    id         : 3,
                    name       : 'Plan',
                    resourceId : 2,
                    startDate  : new Date(2017, 0, 6),
                    endDate    : new Date(2017, 0, 7)
                },
                {
                    id         : 4,
                    name       : 'Plan',
                    resourceId : 3,
                    startDate  : new Date(2017, 0, 7),
                    endDate    : new Date(2017, 0, 8)
                },
                {
                    id         : 5,
                    name       : 'Work',
                    resourceId : 3,
                    startDate  : new Date(2017, 0, 8),
                    endDate    : new Date(2017, 0, 10)
                }
            ],
            features           : {
                group        : 'job',
                groupSummary : {
                    summaries : [
                        {
                            label    : 'Count',
                            renderer : ({ events }) => events.length
                        }
                    ]
                },
                eventTooltip    : false,
                scheduleTooltip : false,
                eventEdit       : false
            }
        });

        const
            middleHeaderCells  = t.query('.b-sch-header-row-1 .b-sch-header-timeaxis-cell'),
            groupSummaryCells1 = t.query('.b-group-footer[data-id="group-footer-Carpenter"] .b-timeaxis-group-summary .b-timeaxis-tick'),
            groupSummaryCells2 = t.query('.b-group-footer[data-id="group-footer-Painter"] .b-timeaxis-group-summary .b-timeaxis-tick');

        groupSummaryCells1.forEach((element, idx) => {
            t.is(element.offsetWidth, middleHeaderCells[idx].offsetWidth, `"Carpenter" group summary column for ${middleHeaderCells[idx].innerText} aligned`);
        });

        groupSummaryCells2.forEach((element, idx) => {
            t.is(element.offsetWidth, middleHeaderCells[idx].offsetWidth, `"Painter" group summary column for ${middleHeaderCells[idx].innerText} aligned`);
        });
    });

    t.it('Should not crash when zooming in', async t => {
        scheduler = await createScheduler({
            features : {
                group        : 'job',
                groupSummary : {
                    summaries : [
                        {
                            label    : 'Count',
                            renderer : ({ events, groupRecord, groupField, groupValue }) => {
                                return events.length;
                            }
                        }
                    ]
                }
            }
        });

        scheduler.zoomIn();
        t.pass('Rendered ok');
    });
});
