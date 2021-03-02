/**
 * Application component
 */
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { SchedulerComponent } from 'bryntum-angular-shared';
import schedulerConfig from './schedulerConfig';
import { EventEditorComponent } from './event-editor/event-editor.component';

// Bryntum umd lite bundle comes without polyfills to support Angular's zone.js

@Component({
    selector    : 'app-root',
    templateUrl : './app.component.html',
    styleUrls   : ['./app.component.scss']
})

export class AppComponent implements AfterViewInit {
    schedulerConfig: any = schedulerConfig;

    @ViewChild(SchedulerComponent, { static : true }) scheduler: SchedulerComponent;

    constructor(public editor: MatDialog) { }

    beforeEventEdit(event): boolean {
        const
            { eventRecord, resourceRecord, eventEdit } = event,
            editorConfig = new MatDialogConfig();

        Object.assign(editorConfig, {
            disableClose : false,
            autoFocus    : true,
            width        : '500px',
            data         : {
                eventRecord,
                resourceRecord,
                eventStore : eventEdit.eventStore
            }
        });

        // console.log('data=', editorConfig.data);
        this.editor.open(EventEditorComponent, editorConfig);

        // suppress default event editor
        return false;
    }

    ngAfterViewInit() {
        // install beforeEventEdit listener
        this.scheduler.schedulerInstance.on('beforeEventEdit', this.beforeEventEdit.bind(this));
    }

    /**
     * Custom event renderer for the scheduler
     */
    eventRenderer = ({ eventRecord }: { eventRecord: any }) => {
        return `
            <div class="info">
                <div class="name">${eventRecord.name}</div>
                <div class="desc">${eventRecord.desc}</div>
            </div>
        `;
    }

}


