import { DependencyStore, ResourceStore, EventStore, Scheduler, LocaleManager, LocaleHelper, BrowserHelper } from '../../build/scheduler.module.js?447702';

StartTest(t => {

    function applyLocale(t, name) {
        t.diag(`Applying locale ${name}`);
        return LocaleManager.locale = window.bryntum.locales[name];
    }

    Object.assign(window, {
        Scheduler,
        EventStore,
        ResourceStore,
        DependencyStore
    });

    let scheduler;

    t.beforeEach(t => {
        scheduler && scheduler.destroy();
        scheduler = null;
    });

    t.it('Should update event editor date pickers weekStartDay on switching locales', t => {
        scheduler = t.getScheduler({
            features : {
                eventTooltip : false,
                eventEdit    : true // is enabled by default already, but in case we change our minds...
            }
        });

        t.chain(
            { waitForRowsVisible : scheduler },
            async() => {
                const locale = applyLocale(t, 'En');
                t.is(locale.DateHelper.weekStartDay, 0, 'English week starts from Sunday');
            },
            { doubleClick : '.b-sch-event' },
            { click : '.b-pickerfield[data-ref="startDateField"] .b-icon-calendar' },
            {
                waitForSelector : '.b-calendar-day-header[data-column-index="0"][data-cell-day="0"]',
                desc            : 'Start date: Week starts with correct day'
            },
            { type : '[ESC]' },
            { click : '.b-pickerfield[data-ref="endDateField"] .b-icon-calendar' },
            {
                waitForSelector : '.b-calendar-day-header[data-column-index="0"][data-cell-day="0"]',
                desc            : 'End date: Week starts with correct day'
            },
            { type : '[ESC]' },
            async() => {
                const locale = applyLocale(t, 'Ru');
                t.is(locale.DateHelper.weekStartDay, 1, 'Russian week starts from Monday');
            },
            { click : '.b-pickerfield[data-ref="startDateField"] .b-icon-calendar' },
            {
                waitForSelector : '.b-calendar-day-header[data-column-index="0"][data-cell-day="1"]',
                desc            : 'Start date: Week starts with correct day'
            },
            { type : '[ESC]' },
            { click : '.b-pickerfield[data-ref="endDateField"] .b-icon-calendar' },
            {
                waitForSelector : '.b-calendar-day-header[data-column-index="0"][data-cell-day="1"]',
                desc            : 'End date: Week starts with correct day'
            }
        );
    });

    t.it('Should update topDateFormat for dayAndWeek preset on switching locales', t => {
        scheduler = t.getScheduler({
            viewPreset : 'dayAndWeek'
        });

        // new Intl.DateTimeFormat('ru', { month : 'short' }).format(new Date(2011, 0, 1))
        // Chrome => "янв."
        // IE11   => "янв"
        const ruDateText = BrowserHelper.isIE11 ? 'нед.01 янв 2011' : 'нед.01 янв. 2011';

        t.chain(
            { waitForRowsVisible : scheduler },
            async() => {
                applyLocale(t, 'En');
            },
            {
                waitForSelector : '.b-sch-header-timeaxis-cell[data-tick-index="0"]:contains(w.01 Jan 2011)',
                desc            : 'English topDateFormat is correct for dayAndWeek preset'
            },
            async() => {
                applyLocale(t, 'Ru');
            },
            {
                waitForSelector : `.b-sch-header-timeaxis-cell[data-tick-index="0"]:contains(${ruDateText})`,
                desc            : 'Russian topDateFormat is correct for dayAndWeek preset'
            }
        );
    });

    t.it('Should update topDateFormat for dayAndWeek and weekAndDay presets on switching locales', t => {
        const customEnLocale = LocaleHelper.mergeLocales(window.bryntum.locales.En, {
            PresetManager : {
                dayAndWeek : {
                    topDateFormat : 'MMMM YYYY'
                },
                weekAndDay : {
                    topDateFormat : 'YYYY MMM DD'
                }
            }
        });

        LocaleHelper.publishLocale('En-Custom', customEnLocale);

        scheduler = t.getScheduler({
            viewPreset : 'dayAndWeek'
        });

        t.chain(
            { waitForRowsVisible : scheduler },
            () => {
                applyLocale(t, 'En');
                t.selectorExists('.b-sch-header-timeaxis-cell[data-tick-index="0"]:contains(w.01 Jan 2011)', 'English topDateFormat is correct for dayAndWeek preset');

                applyLocale(t, 'En-Custom');
                t.selectorExists('.b-sch-header-timeaxis-cell[data-tick-index="0"]:contains(January 2011)', 'English Custom topDateFormat is correct for dayAndWeek preset');

                scheduler.viewPreset = 'weekAndDay';

                applyLocale(t, 'En');
                t.selectorExists('.b-sch-header-timeaxis-cell[data-tick-index="0"]:contains(2011 January 02)', 'English topDateFormat is correct for weekAndDay preset');

                applyLocale(t, 'En-Custom');
                t.selectorExists('.b-sch-header-timeaxis-cell[data-tick-index="0"]:contains(2011 Jan 02)', 'English Custom topDateFormat is correct for weekAndDay preset');
            }
        );
    });
});
