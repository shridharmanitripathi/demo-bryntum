/**
 *- Centralized import of locales
 */
import { LocaleManager } from 'bryntum-scheduler';

import En from 'bryntum-scheduler/locales/scheduler.locale.En.js';
import Ru from 'bryntum-scheduler/locales/scheduler.locale.Ru.js';
import SvSE from 'bryntum-scheduler/locales/scheduler.locale.SvSE.js';

import ExamplesEn from 'bryntum-resources/locales/examples.locale.En.umd.js';
import ExamplesRu from 'bryntum-resources/locales/examples.locale.Ru.umd.js';
import ExamplesSvSE from 'bryntum-resources/locales/examples.locale.SvSE.umd.js';

LocaleManager.registerLocale('En', { locale : En });
LocaleManager.registerLocale('Ru', { locale : Ru });
LocaleManager.registerLocale('SvSE', { locale : SvSE });

LocaleManager.extendLocale('En', ExamplesEn);
LocaleManager.extendLocale('Ru', ExamplesRu);
LocaleManager.extendLocale('SvSE', ExamplesSvSE);

window.bryntum.locales = { En, Ru, SvSE };

