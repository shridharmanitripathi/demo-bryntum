import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { AppErrorHandler } from './error.handler';
import {HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { SchedulerComponent } from './scheduler/scheduler.component';


@NgModule({
  declarations: [
    AppComponent,
    SchedulerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [{ provide : ErrorHandler, useClass : AppErrorHandler }],
  bootstrap: [AppComponent]
})
export class AppModule { }
