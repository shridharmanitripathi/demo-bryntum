import { DateHelper, DomHelper, Override, DataGenerator, RandomGenerator, PresetManager, PaperFormat, Rectangle, BrowserHelper } from '../../../build/scheduler.module.js?447702';

StartTest(t => {

    let scheduler, paperHeight;

    Object.assign(window, {
        DateHelper,
        DomHelper,
        Override,
        DataGenerator,
        RandomGenerator,
        PresetManager,
        PaperFormat,
        Rectangle
    });

    t.overrideAjaxHelper();

    t.beforeEach(() => {
        scheduler && scheduler.destroy();
    });

    function fixIE11Height(doc) {
        if (BrowserHelper.isIE11) {
            // IE11 doesn't calculate container height properly, this override is required to make
            // header assertions to pass
            doc.styleSheets[doc.styleSheets.length - 1].addRule('.b-export .b-export-content', 'height: 100% !important;');
        }
    }

    t.it('Should export scheduler to multiple pages', async t => {
        const
            verticalPages = 2,
            horizontalPages = 2;

        ({ scheduler, paperHeight } = await t.createSchedulerForExport({
            startDate : new Date(2019, 10, 4),
            endDate   : new Date(2019, 11, 9),
            verticalPages,
            horizontalPages
        }));

        t.chain(
            async() => {
                scheduler.resourceStore.group('firstName');

                const html = await t.getExportHtml(scheduler, {
                    columns      : scheduler.columns.visibleColumns.map(c => c.id),
                    exporterType : 'singlepage'
                });

                const { document : doc, iframe } = await t.setIframeAsync({
                    height : paperHeight,
                    html   : html[0].html
                });

                fixIE11Height(doc);

                t.ok(t.assertRowsExportedWithoutGaps(doc, false, true), 'Rows exported without gaps');
                t.ok(t.assertTicksExportedWithoutGaps(doc), 'Ticks exported without gaps');

                const events = scheduler.eventStore.query(r => scheduler.timeAxis.isTimeSpanInAxis(r));

                t.ok(t.assertExportedEventsList(doc, events), 'Events are exported correctly');

                t.is(doc.querySelectorAll('.b-grid-row').length, scheduler.resourceStore.count * 2, 'All resources exported');
                t.isExportedTickCount(doc, scheduler.timeAxis.count);
                t.is(doc.querySelectorAll(scheduler.unreleasedEventSelector).length, scheduler.eventStore.count / 2, 'Event count is correct');

                iframe.remove();
            }
        );
    });

    t.it('Should export dependencies not visible on a first page', async t => {
        const
            startDate = new Date(2020, 6, 19),
            resources = DataGenerator.generateData(100);

        scheduler = t.getScheduler({
            resources,
            startDate,
            height   : 400,
            width    : 600,
            endDate  : new Date(2020, 6, 26),
            features : {
                dependencies : true,
                pdfExport    : {
                    exportServer : '/export'
                }
            },
            events : [
                { id : 1, resourceId : resources[resources.length - 1].id, startDate : new Date(2020, 6, 20), duration : 2 },
                { id : 2, resourceId : resources[resources.length - 1].id, startDate : new Date(2020, 6, 20), duration : 2 }
            ],
            dependencies : [
                { from : 1, to : 2 }
            ]
        });

        const pages = await t.getExportHtml(scheduler, {
            exporterType : 'multipagevertical'
        });

        const { document, iframe } = await t.setIframeAsync({
            height : 1123,
            html   : pages[pages.length - 1].html
        });

        t.ok(t.assertExportedEventDependenciesList(document, scheduler.dependencies), 'Dependency is exported');

        iframe.remove();
    });

    t.it('Should export column lines', async t => {
        ({ scheduler, paperHeight } = await t.createSchedulerForExport({
            horizontalPages : 2
        }));

        const pages = await t.getExportHtml(scheduler, {
            exporterType : 'multipagevertical'
        });

        const { document, iframe } = await t.setIframeAsync({
            height : paperHeight,
            html   : pages[0].html
        });

        const
            ticks = Array.from(document.querySelectorAll('.b-lowest .b-sch-header-timeaxis-cell')).sort((a, b) => a.offsetLeft - b.offsetLeft),
            lines = Array.from(document.querySelectorAll('.b-column-line, .b-column-line-major')).sort((a, b) => a.offsetLeft - b.offsetLeft);

        ticks.pop();

        t.is(ticks.length, lines.length, 'Correct amount of lines exported');

        ticks.forEach((tickEl, index) => {
            const lineEl = lines[index];

            t.isApprox(lineEl.getBoundingClientRect().right, tickEl.getBoundingClientRect().right, 1, `Column line ${index} is aligned to tick el`);
        });

        t.is(document.querySelectorAll('.b-column-line-major').length, 1, 'One major line exported');

        iframe.remove();
    });
});
