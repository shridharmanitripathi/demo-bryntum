/**
 * Custom, Angular-based event editor implementation
 */
import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
    selector    : 'custom-event-editor',
    templateUrl : './event-editor.component.html',
    styleUrls   : ['./event-editor.component.scss']
})
export class EventEditorComponent {

    name        : string;
    desc        : string;
    startDate   : Date;
    endDate     : Date;
    eventRecord : any;
    eventStore  : any;
    resourceId  : any;

    constructor(
      private dialogRef: MatDialogRef<EventEditorComponent>,
      @Inject(MAT_DIALOG_DATA) data : any
    ) {

        if(data) {
            if(data.eventRecord) {
                Object.assign(this, {
                    name        : data.eventRecord.name,
                    desc        : data.eventRecord.desc,
                    startDate   : new Date(data.eventRecord.startDate),
                    endDate     : new Date(data.eventRecord.endDate),
                    eventRecord : data.eventRecord,
                    resourceId  : data.resourceRecord.id,
                    eventStore  : data.eventStore
                });
            }
        }

    }

    save() {
        const eventRecord = this.eventRecord,
              data : any = {
                name       : this.name,
                desc       : this.desc || '',
                startDate  : this.startDate,
                endDate    : this.endDate,
                resourceId : this.resourceId,
                iconCls    : this.eventRecord.iconCls || 'b-fa b-fa-calendar'
              }
        ;
        if(!eventRecord.eventStore) {
            this.eventStore.add(eventRecord);
        }
        eventRecord.set(data);

        this.dialogRef.close();
    }

    close() {
        this.dialogRef.close();
    }

}


