/**
 *- Setup locales
 */
// basic scheduler locales
import EnLocale from 'bryntum-scheduler/locales/scheduler.locale.En';
import SvSELocale from 'bryntum-scheduler/locales/scheduler.locale.SvSE';
import RuLocale from 'bryntum-scheduler/locales/scheduler.locale.Ru';

// example locales (grid column names, etc)
import SvSELocaleExamples from 'bryntum-resources/locales/examples.locale.SvSE.umd.js';
import RuLocaleExamples from 'bryntum-resources/locales/examples.locale.Ru.umd.js';

// LocaleManager
// we import scheduler.umd for IE11 compatibility only. If you don't use IE import:
// import { LocaleManager } from 'bryntum-scheduler';
import { LocaleManager } from 'bryntum-scheduler/scheduler.umd';

// register locales
LocaleManager.registerLocale('En', { locale : EnLocale });
LocaleManager.registerLocale('SvSE', { locale : SvSELocale });
LocaleManager.registerLocale('Ru', { locale : RuLocale });

// extend locales
LocaleManager.extendLocale('SvSE', SvSELocaleExamples);
LocaleManager.extendLocale('Ru', RuLocaleExamples);

// eof
