/**
 * App component script
 */
import { Component, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ITranslationService, I18NEXT_SERVICE } from 'angular-i18next';
import schedulerConfig from './schedulerConfig';
import { SchedulerComponent } from 'bryntum-angular-shared';
import './schedulerLocales.js';

// Bryntum umd lite bundle comes without polyfills to support Angular's zone.js
import { LocaleManager } from 'bryntum-scheduler/scheduler.lite.umd.js';

@Component({
    selector    : 'app-root',
    templateUrl : './app.component.html',
    styleUrls   : ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

    schedulerConfig: any = schedulerConfig;
    currentLanguage: string = 'en';
    t: any;

    @ViewChild('scheduler', { static:true }) scheduler: SchedulerComponent;

    constructor(@Inject(I18NEXT_SERVICE) private i18NextService: ITranslationService) {
        this.t = i18NextService.t;
    }

    /**
     * Set the current language
     */
    ngOnInit(): void {
        this.i18NextService.events.initialized.subscribe((e) => {
            if (e) {
                this.currentLanguage = this.i18NextService.language;
            }
        });
    }

    /**
     * Set the scheduler language after it is initialized
     */
    ngAfterViewInit(): void {
        this.applySchedulerLocale(this.i18NextService.language);
    }

    /**
     * Changes the language of the application
     * @param lang language name
     */
    changeLanguage(lang: string): void {
        const me = this;

        me.applySchedulerLocale(lang);

        if (lang !== me.i18NextService.language) {
            me.i18NextService.changeLanguage(lang).then(x => {
                me.currentLanguage = lang;
            });
        }
    }

    /**
     * @param schedulerLocale
     * Applies scheduler locale. Called always when
     * locale changes by SettingContext setLocale
     */
    applySchedulerLocale = (schedulerLocale: string): void => {
        switch (schedulerLocale) {
            case 'se':
                LocaleManager.locale = 'SvSE';
                break;

            case 'ru':
                LocaleManager.locale = 'Ru';
                break;

            default:
                LocaleManager.locale = 'En';
                break;
        }
    }

}


