/* eslint-disable */
Ext.define('App.view.MainController', {
    extend   : 'Ext.app.ViewController',
    alias    : 'controller.main',
    requires : [
        'Bryntum.SchedulerPanel',
        'Bryntum.TimeField',
        'Bryntum.EventEditor',
        'Bryntum.TimeRangeEditor'
    ],

    init : function () {
        var me             = this,
            schedulerPanel = me.lookup('schedulerPanel');

        me.callParent();

        schedulerPanel.on({
            beforeeventedit : function (sender, event) {
                // If it's a newly created event, it won't have a resource stamped into it, but the
                // resource for which it is being created will be passed. This would need to check
                // "assignments" instead in multi-assignment mode.
                var eventRecord = event.eventRecord;

                me.editEvent(eventRecord, event.eventElement, eventRecord.resource ? null : event.resourceRecord);

                return false;
            },
            scheduledblclick : function (sender, cellDblclickEvent) {
                me.createEvent(cellDblclickEvent.date, cellDblclickEvent.resourceRecord);
                return false;
            }
        });

        Ext.mixin.Observable.capture(schedulerPanel, function (eventName, event) {
            // Be a little selective. Log Scheduler events, and not the "before" ones.
            if (event.source && !eventName.startsWith('before')) {
                //console.log(eventName, ' ', event);
            }
        });
    },

    eventRenderer : function (renderData) {
        renderData.renderData.style = 'background-color:' + renderData.resourceRecord.color;

        return Ext.htmlEncode(renderData.eventRecord.name);
    },

    createEvent : function (startDate, resourceRecord) {
        var schedulerPanel = this.lookup('schedulerPanel'),
            scheduler      = schedulerPanel.getScheduler(),
            dragCreator    = scheduler.features.eventDragCreate,
            editorForm     = this.lookup('editorForm'),
            startTime, endDate, endTime, recordData;

        if (startDate) {
            startTime = Ext.Date.format(startDate, 'H:i');
            endDate = Ext.Date.add(startDate, 'h', 1);
            endTime = Ext.Date.format(endDate, 'H:i');
        }
        else {
            startDate = Ext.Date.clone(schedulerPanel.getStartDate());
            startTime = '09:00';
            endDate = Ext.Date.clone(schedulerPanel.getStartDate());
            endTime = '10:00';
        }
        recordData = {
            resourceId : resourceRecord.id,
            startDate  : startDate,
            startTime  : startTime,
            endDate    : endDate,
            endTime    : endTime
        };
        const newEvent  = new scheduler.eventStore.modelClass(recordData),
              eventData = scheduler.generateRenderData(newEvent, resourceRecord),
              proxy     = dragCreator.addProxy({
                  rowRecord : resourceRecord,
                  startX    : eventData.left,
                  width     : eventData.width
              });

        scheduler.element.classList.remove('b-dragcreating');
        dragCreator.proxy = null;
        this.editEvent(newEvent, proxy, resourceRecord);
        proxy.parentNode.removeChild(proxy);
    },

    addTask : function (startDate, resourceRecord) {
        var editor         = this.getEventEditor(),
            schedulerPanel = this.lookup('schedulerPanel'),
            editorForm     = this.lookup('editorForm');

        editor.setAnchor(false);
        editor.setTitle('New Task Details');
        editorForm.reset();
        editorForm.setValues({
            startDate : Ext.Date.clone(schedulerPanel.getStartDate()),
            startTime : '09:00',
            endDate   : Ext.Date.clone(schedulerPanel.getStartDate()),
            endTime   : '10:00'
        });
        editorForm.clearErrors();
        editor.setActions({
            cancel : true,
            save   : true
        });
        editor.mode = 'create';
        editor.center();
        editor.show();
        editor.focus();
    },

    addTimeRange : function () {
        var editor         = this.getTimeRangeEditor(),
            schedulerPanel = this.lookup('schedulerPanel'),
            editorForm     = this.lookup('timerangeeditorForm');

        editorForm.setValues({
            name      : 'Fika',
            startDate : Ext.Date.clone(schedulerPanel.getStartDate()),
            startTime : '10:00',
            endDate   : Ext.Date.clone(schedulerPanel.getStartDate()),
            endTime   : '11:00'
        });

        editor.show();
        editor.focus();
    },

    saveTimeRange : function () {
        var editor         = this.getTimeRangeEditor(),
            editorForm     = this.lookup('timerangeeditorForm'),
            schedulerPanel = this.lookup('schedulerPanel'),
            values         = editorForm.getValues();

        editorForm.validate();
        if (editorForm.isValid()) {
            values.startDate = new Date(Ext.Date.clearTime(values.startDate).valueOf() + values.startTime.valueOf());
            values.endDate = new Date(Ext.Date.clearTime(values.endDate).valueOf() + values.endTime.valueOf());

            schedulerPanel.getScheduler().features.timeRanges.store.add(values);
            editor.hide();
        }
    },

    editEvent : function (event, target, resourceRecord) {
        var me     = this,
            editor = me.getEventEditor(),
            proxyParent;

        // Work round 6.5 modern bug where first show does not lay out properly
        if (!me.workedAroundShowByBug) {
            editor.show({
                animation : false,
                alignment : {
                    component : target,
                    alignment : 't-b'
                }
            });
            editor.hide(false);
            me.workedAroundShowByBug = true;
        }

        // Note: This would need to use the assignmentStore in multi-assignment mode.
        if (resourceRecord) {
            proxyParent = target.parentNode;
            target = target.cloneNode(true);
            proxyParent.appendChild(target);
            event.resourceId = resourceRecord.id;
            editor.eventProxyElement = target;
            editor.setTitle('New Event');
            editor.mode = 'create';
        }
        else {
            editor.setTitle('Edit Event');
            editor.mode = 'edit';
        }
        editor.setAnchor(true);
        editor.setEvent(event);
        editor.setActions({
            cancel : true,
            delete : true,
            save   : true
        });

        editor.showBy(target, 't-b?');
        editor.focus();
    },

    cancelEdit : function () {
        this.eventEditor.hide();
    },

    deleteTask : function () {
        var editor         = this.getEventEditor(),
            schedulerPanel = this.lookup('schedulerPanel');

        if (editor.mode === 'edit') {
            schedulerPanel.getEventStore().remove(editor.getEvent());
        }
        editor.hide();
    },

    saveTask : function () {
        var editor         = this.getEventEditor(),
            editorForm     = this.lookup('editorForm'),
            schedulerPanel = this.lookup('schedulerPanel'),
            values         = editorForm.getValues();

        editorForm.validate();
        if (editorForm.isValid()) {
            values.startDate = new Date(Ext.Date.clearTime(values.startDate).valueOf() + values.startTime.valueOf());
            values.endDate = new Date(Ext.Date.clearTime(values.endDate).valueOf() + values.endTime.valueOf());

            if (editor.mode === 'create') {
                editorForm.validate();
                if (editorForm.isValid()) {
                    schedulerPanel.getEventStore().add(values);
                    editor.hide();
                }
            }
            else if (editor.mode === 'edit') {
                editor.getEvent().set(values);
                editor.hide();
            }
        }
    },

    getEventEditor : function () {
        var editor = this.eventEditor;

        if (!editor) {
            editor = this.eventEditor = this.getView().add(new Bryntum.EventEditor({
                reference     : 'editor',
                hideOnMaskTap : true,
                resourceStore : {
                    autoLoad : true,
                    proxy    : {
                        type : 'ajax',
                        url  : 'data/resources.json'
                    }
                }
            }));
        }

        return editor;
    },

    getTimeRangeEditor : function () {
        var editor = this.timeRangeEditor;

        if (!editor) {
            editor = this.timeRangeEditor = this.getView().add(new Bryntum.TimeRangeEditor({
                reference     : 'timerangeeditor',
                hideOnMaskTap : true
            }));
        }

        return editor;
    }
});
