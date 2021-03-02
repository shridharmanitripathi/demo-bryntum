/**
 * App component script
 */
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { SchedulerComponent } from 'bryntum-angular-shared';
import { GridComponent } from './grid/grid.component.js';
import schedulerConfig from './schedulerConfig';

// Bryntum umd lite bundle comes without polyfills to support Angular's zone.js
import { AjaxStore, EventModel, DragHelper, WidgetHelper, Toast, AjaxStoreConfig, Model } from 'bryntum-scheduler/scheduler.lite.umd.js';

@Component({
    selector    : 'app-root',
    templateUrl : './app.component.html',
    styleUrls   : ['./app.component.scss']
})

export class AppComponent implements AfterViewInit {

    @ViewChild(SchedulerComponent, { static: true }) scheduler: SchedulerComponent;
    @ViewChild('grid', { static: true }) gridComponent: GridComponent;

    schedulerConfig = schedulerConfig;

    ngAfterViewInit() {

        const
            scheduler = this.scheduler.schedulerInstance,
            grid = this.gridComponent.grid,
            equipmentStore = new EquipmentStore({
                modelClass   : EventModel,
                readUrl      : 'assets/data/equipment.json',
                sorters      : [
                    { field : 'name', ascending : true }
                ],
                durationUnit : 'h',
                equipment    : []
            });

        grid.store = equipmentStore.makeChained(() => true, [], {});

        // event renderer expects equipmentStore to be class property of scheduler
        scheduler['equipmentStore'] = equipmentStore;

        equipmentStore.load({}).then(event => {
            this.onEquipmentStoreLoad(event);
        });

        this.initDrag(scheduler, grid);

        setTimeout(() => {
            Toast.show({
                timeout : 3500,
                html    : 'Please note that this example uses the Bryntum Grid, which is licensed separately.'
            });
        }, 500);

    }

    onEquipmentStoreLoad({ source : store }) {
        const
            scheduler = this.scheduler.schedulerInstance,
            combo = scheduler.features.eventEdit.getEditor().query((item) => item.name === 'equipment');

        combo.items = store.getRange();

        // Since the event bars contain icons for equipment, we need to refresh rows once equipment store is loaded
        scheduler.refreshRows();

    }

    initDrag(scheduler, grid) {
        const drag = new DragHelper({
            cloneTarget        : true,
            mode               : 'translateXY',
            dropTargetSelector : '.b-sch-event',
            targetSelector     : '.b-grid-cell',
            outerElement       : grid.element
        });

        drag.on({
            dragstart : ({ event, context }) => {
                // save a reference to the equipment so we can access it later
                context.equipment = grid.getRecordFromElement(context.grabbed);

                // Prevent tooltips from showing while dragging
                scheduler.element.classList.add('b-dragging-event');
            },

            drop : ({ context, event }) => {
                if (context.valid) {
                    const
                        equipment = context.equipment,
                        eventRecord = scheduler.resolveEventRecord(context.target);

                    eventRecord.equipment = eventRecord.equipment.concat(equipment);
                    context.finalize();

                    // Dropped on a scheduled event, display toast
                    WidgetHelper.toast(`Added ${equipment.name} to ${eventRecord.name}`);
                }

                scheduler.element.classList.remove('b-dragging-event');
            }
        });
    }

}

type EquipmentStoreConfig = AjaxStoreConfig & {
    durationUnit: string;
    equipment: Model[];
};

class EquipmentStore extends AjaxStore {
    durationUnit: string;
    equipment: Model[];
    constructor(config: Partial<EquipmentStoreConfig>) {
        super(config);
    }
}
