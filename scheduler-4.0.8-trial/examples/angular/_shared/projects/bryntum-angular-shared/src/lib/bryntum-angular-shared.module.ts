/**
 * Bryntum Angular shared module
 */
import { NgModule } from '@angular/core';
import { ButtonComponent } from './button.component';
import { FullscreenComponent } from './fullscreen.component';
import { SchedulerComponent } from './scheduler.component';
import { SliderComponent } from './slider.component';
import { WidgetComponent } from './widget.component';

@NgModule({
    declarations : [
        ButtonComponent,
        FullscreenComponent,
        SchedulerComponent,
        SliderComponent,
        WidgetComponent
    ],
    imports      : [],
    exports      : [
        ButtonComponent,
        FullscreenComponent,
        SchedulerComponent,
        SliderComponent,
        WidgetComponent
    ]
})

export class BryntumAngularSharedModule {}


