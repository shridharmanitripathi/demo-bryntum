/**
 * Scheduler config
 */
import colors from './colors';

// Bryntum umd lite bundle comes without polyfills to support Angular's zone.js
import { ResourceModel } from 'bryntum-scheduler/scheduler.lite.umd.js';
import { AppResourceModel } from './AppResourceModel';

ResourceModel.childrenField = 'clients';

const schedulerConfig = {
    minHeight : '20em',

    startDate  : new Date(2018, 4, 7),
    endDate    : new Date(2018, 4, 26),
    barMargin  : 7,
    rowHeight  : 45,
    eventColor : null,
    eventStyle : null,

    resourceImagePath : 'assets/users/',

    resourceStore : {
        modelClass : AppResourceModel
    },

    viewPreset : {
        base              : 'weekAndDay',
        displayDateFormat : 'll'
    },

    // Disable cell editing, this demo has its own custom row editor
    cellEditFeature  : false,
    // Drag only within clients/employees, snap to days
    eventDragFeature : {
        constrainDragToResource : true,
        showExactDropPosition   : true
    },
    // Event editor with two custom fields, location for clients and color for employees
    eventEditFeature : {
        typeField : 'type',

        // Add extra widgets to the event editor
        items : {
            location : {
                type    : 'text',
                name    : 'location',
                label   : 'Location',
                dataset : { eventType : 'client' }
            },
            color : {
                type        : 'combo',
                name        : 'color',
                label       : 'Color',
                items       : colors.map(color => [color.toLowerCase(), color]),
                listItemTpl : data => `<div class="color-item ${data.value}"></div>${data.text}`,
                dataset     : { eventType : 'employee' }
            }
        }
    },
    // Resize snapping to days
    eventResizeFeature : {
        showExactResizePosition : true
    },
    // Shade weekends
    nonWorkingTimeFeature : true,
    // Uses a tree where parent nodes are employees and child nodes are clients
    treeFeature           : true,

    columns : [
        {
            type                   : 'tree',
            text                   : 'Employees',
            field                  : 'name',
            width                  : '15em',
            // Hide default tree icons
            expandedFolderIconCls  : null,
            collapsedFolderIconCls : null,
            leafIconCls            : null,
            htmlEncode             : false,
            // Custom renderer display employee info or client color + name
            renderer({ record, value, size }) {
                // Parent rows are employees
                if (record.isParent) {
                    // Make employee row higher
                    size.height = 60;
                    // Employee template
                    return `
                        <div class="info">
                            <div class="name">${value}</div>
                            <div class="title">${record.title}</div>
                        </div>
                        <div class="add"><i class="b-fa b-fa-plus"></i></div>
                        <img class="profile-img" src="assets/images/${record.name.toLowerCase()}.jpg" />
                    `;
                }
                // Other rows are clients
                else {
                    // Client template
                    return `<div class="client-color ${record.color}"></div>${value}`;
                }
            }
        }
    ],

    // CrudManager loads all data from a single source
    crudManager : {
        autoLoad : true,

        transport : {
            load : {
                url : 'assets/data/data.json'
            }
        },

        resourceStore : {
            fields : ['color', 'title'],
            tree   : true
        },

        eventStore : {
            fields : ['color', 'location']
        }
    },

    // Custom event renderer that applies colors and display events location
    eventRenderer({ renderData, resourceRecord, eventRecord }) {
        if (resourceRecord.isParent) {
            renderData.wrapperCls.add('employee');
        }

        if (eventRecord.color) {
            renderData.wrapperCls.add(eventRecord.color);
        }
        else if (resourceRecord.color) {
            renderData.wrapperCls.add(resourceRecord.color);
        }

        return eventRecord.name + (eventRecord.location ? `<span>, ${eventRecord.location}</span>` : '');
    }
};

export default schedulerConfig;
