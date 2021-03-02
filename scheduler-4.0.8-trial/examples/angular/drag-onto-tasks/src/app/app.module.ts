/**
 * App module
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { AppErrorHandler } from './error.handler';

import { AppComponent } from './app.component';
import { GridComponent } from './grid/grid.component';
import { BryntumAngularSharedModule } from 'bryntum-angular-shared'

@NgModule({
    declarations: [
        AppComponent,
        GridComponent
    ],
    imports: [
        BrowserModule,
        BryntumAngularSharedModule
    ],
    providers: [{ provide : ErrorHandler, useClass : AppErrorHandler }],
    bootstrap: [AppComponent]
})

export class AppModule { }


