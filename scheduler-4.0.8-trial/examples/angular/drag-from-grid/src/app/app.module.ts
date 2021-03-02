/**
 * App module
 */
// modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { AppErrorHandler } from './error.handler';

// components
import { AppComponent } from './app.component';
import { GridComponent } from './grid/grid.component';
import { RescheduleComponent } from './button/reschedule/reschedule.component';

import { BryntumAngularSharedModule } from 'bryntum-angular-shared';

@NgModule({
    declarations: [
        AppComponent,
        GridComponent,
        RescheduleComponent
    ],
    imports: [
        BrowserModule,
        BryntumAngularSharedModule
    ],
    providers: [{ provide : ErrorHandler, useClass : AppErrorHandler }],
    bootstrap: [AppComponent]
})
export class AppModule { }


