/**
 * Scheduler component (functional)
 */
// libraries
import React, { useRef, useEffect } from 'react';
import { BryntumScheduler } from 'bryntum-react-shared';
// we import scheduler.umd for IE11 compatibility only. If you don't use IE import:
// import { DateHelper } from 'bryntum-scheduler';
import { DateHelper } from 'bryntum-scheduler/scheduler.umd';

// our stuff
import Drag from '../lib/Drag.js';

const Scheduler = props => {

    const
        schedulerRef = useRef(),
        config = {
            ...props,
            id        : 'scheduler',
            // appendTo  : 'scheduler',
            ref       : schedulerRef,
            startDate : new Date(2017, 11, 1, 8),
            endDate   : new Date(2017, 11, 1, 18),

            rowHeight  : 100,
            barMargin  : 4,
            eventColor : 'indigo',
            viewPreset : {
                base           : 'hourAndDay',
                tickWidth      : 10,
                columnLinesFor : 0,
                headers        : [
                    {
                        unit       : 'd',
                        align      : 'center',
                        dateFormat : 'ddd DD MMM'
                    },
                    {
                        unit       : 'h',
                        align      : 'center',
                        dateFormat : 'HH'
                    }
                ]
            },

            timeRangesFeature : true,
            eventMenuFeature : {
                items : [
                    // custom item with inline handler
                    {
                        text   : 'Remove all equipment',
                        icon   : 'b-fa b-fa-times',
                        weight : 200,
                        onItem : ({ eventRecord, resourceRecord }) => eventRecord.equipment = []
                    }
                ]
            },
            eventEditFeature : {
                // Add an extra combo box to the editor to select equipment
                items : {
                    equipment : {
                        type         : 'combo',
                        weight       : 900, // At end
                        editable     : false,
                        multiSelect  : true,
                        valueField   : 'id',
                        displayField : 'name',
                        name         : 'equipment',
                        label        : 'Equipment',
                        items        : []
                    }
                }
            },
            resourceImagePath : 'users/',

            columns  : [
                {
                    type           : 'resourceInfo',
                    text           : 'Name',
                    width          : 200,
                    showEventCount : false,
                    showRole       : true
                }
            ],

            crudManager : {
                autoLoad   : true,
                eventStore : props.eventStore,
                transport  : {
                    load : {
                        url : 'data/data.json'
                    }
                }
            },

            // Render some extra elements for the assignment equipment items
            eventBodyTemplate : data => `
                <div class = "b-sch-event-header">${data.date} - ${data.name}</div>
                <ul  class = "b-sch-event-footer">
                    ${data.equipment.map((item) => `<li title="${item.name}" class="${item.iconCls}"></li>`).join('')}
                </ul>
            `,

            // taken from the original example
            eventRenderer({ eventRecord, resourceRecord, renderData }) {
                return {
                    date      : DateHelper.format(eventRecord.startDate, 'LT'),
                    name      : eventRecord.name || '',
                    equipment : this.equipmentStore ? eventRecord.equipment.map((itemId) => this.equipmentStore.getById(itemId) || {}) : []
                };
            },

            // taken from the original example
            onEquipmentStoreLoad({ source : store }) {
                // Setup the data for the equipment combo inside the event editor
                const equipmentCombo = this.features.eventEdit.getEditor().query((item) => item.name === 'equipment');
                equipmentCombo.items = store.getRange();
                this._equipmentStore = store;

                // Since the event bars contain icons for equipment, we need to refresh rows once equipment store is available
                this.refreshRows();
            }

        };

    // runs once when the component is mounted
    useEffect(() => {
        const
            scheduler = schedulerRef.current.schedulerInstance,
            equipmentStore = scheduler.equipmentStore;

        equipmentStore.on('load', scheduler.onEquipmentStoreLoad.bind(scheduler));

        new Drag({
            grid         : props.equipmentGrid,
            schedule     : scheduler,
            outerElement : props.equipmentGrid.element
        });

        equipmentStore.load();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <BryntumScheduler {...config} />;
};

export default Scheduler;
