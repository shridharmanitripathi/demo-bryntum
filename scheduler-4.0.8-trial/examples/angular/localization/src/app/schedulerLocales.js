/**
 *- Setup locales
 */
// basic scheduler locales
import EnLocale from 'bryntum-scheduler/locales/scheduler.locale.En.js';
import SvSELocale from 'bryntum-scheduler/locales/scheduler.locale.SvSE.js';
import RuLocale from 'bryntum-scheduler/locales/scheduler.locale.Ru.js';

// example locales (grid column names, etc)
import SvSELocaleExamples from 'bryntum-resources/locales/examples.locale.SvSE.umd.js';
import RuLocaleExamples from 'bryntum-resources/locales/examples.locale.Ru.umd.js';

// LocaleManager
// We import scheduler.lite.umd for IE11 compatibility.
import { LocaleManager } from 'bryntum-scheduler/scheduler.lite.umd.js';

// register locales
LocaleManager.registerLocale('En', { locale : EnLocale });
LocaleManager.registerLocale('SvSE', { locale : SvSELocale });
LocaleManager.registerLocale('Ru', { locale : RuLocale });

// extend locales
LocaleManager.extendLocale('SvSE', SvSELocaleExamples);
LocaleManager.extendLocale('Ru', RuLocaleExamples);

// eof
