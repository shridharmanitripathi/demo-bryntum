/**
 * App component script
 */
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { SchedulerComponent } from 'bryntum-angular-shared'
import colors from './scheduler/colors';
import schedulerConfig from './scheduler/schedulerConfig';
import { AppResourceModel } from './scheduler/AppResourceModel';

// Bryntum umd lite bundle comes without polyfills to support Angular's zone.js
import { EventHelper, Popup, Tooltip } from 'bryntum-scheduler/scheduler.lite.umd.js';

@Component({
    selector    : 'app-root',
    templateUrl : './app.component.html',
    styleUrls   : ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

    @ViewChild(SchedulerComponent, { static: true }) scheduler: SchedulerComponent;

    schedulerConfig = schedulerConfig;

    ngAfterViewInit() {
        const scheduler = this.scheduler.schedulerInstance;

        // Tooltip for add client buttons (plain divs)
        const tooltip = new Tooltip({
            forSelector : '.add',
            html        : 'Add client',
            hideDelay   : 100
        });

        // Handle click on those add divs
        EventHelper.addListener(scheduler.element, {
            element  : scheduler.element,
            delegate : '.add',
            click(event: any) {
                const
                    employee = scheduler.getRecordFromElement(event.target),
                    data = new AppResourceModel({
                        name  : 'New client',
                        color : colors[Math.floor(Math.random() * colors.length)].toLowerCase()
                    })
                ;
                if (employee) {
                    // Add a new client with random color
                    employee.appendChild(data);
                }
            }
        });

    }

    dispatchEvent(event: any) {
        switch (event.type) {
            case 'celldblclick':
                this.onCellDblClick(event);
                break;

            case 'dragcreateend':
                this.onDragCreateEnd(event);
                break;
            default:
                return;
        }
    }

    onCellDblClick({ record, cellElement, column }) {
        // Show a custom editor when dbl clicking a client cell
        if (column.field === 'name' && record.isLeaf) {
            const popup = new Popup({
                autoShow     : true,
                autoClose    : true,
                closeAction  : 'destroy',
                scrollAction : 'realign',
                forElement   : cellElement,
                anchor       : true,
                width        : '20em',
                cls          : 'client-editor',
                items        : [{
                    type       : 'text',
                    name       : 'name',
                    label      : 'Client',
                    labelWidth : '4em',
                    value      : record.name,
                    onChange   : ({ value }) => {
                        record.name = value;
                    }
                }, {
                    type        : 'combo',
                    cls         : 'b-last-row',
                    name        : 'color',
                    label       : 'Color',
                    labelWidth  : '4em',
                    items       : colors.map(color => [color.toLowerCase(), color]),
                    listItemTpl : (data: any) => `<div class="color-item ${data.value}"></div>${data.text}`,
                    value       : record.color,
                    onChange    : ({ value }) => {
                        record.color = value;
                    }
                }]
            });
        }
    }

    onDragCreateEnd({ newEventRecord, resourceRecord }) {
        // Make new event have correct type, to show correct fields in event editor
        newEventRecord.type = resourceRecord.isLeaf ? 'client' : 'employee';
    }

}


