import { DateHelper, EventModel, ResourceStore, EventStore, Rectangle } from '../../build/scheduler.module.js?447702';

StartTest(t => {
    let scheduler, firstRec, lastRec;

    t.beforeEach(t => {
        scheduler && scheduler.destroy();
        scheduler = null;
    });

    async function setup(config = {}, editRecords = true) {
        scheduler && scheduler.destroy();

        scheduler = await t.getSchedulerAsync(Object.assign({
            features : {
                eventTooltip : false,
                eventEdit    : true // is enabled by default already, but in case we change our minds...
            },
            allowOverlap          : false,
            forceFit              : true,
            enableEventAnimations : false
        }, config));

        firstRec = scheduler.eventStore.first;
        lastRec = scheduler.eventStore.last;

        if (editRecords && firstRec && lastRec) {
            firstRec.cls = 'FOO';
            lastRec.cls = 'BAR';
            lastRec.assign(firstRec.resource);
            lastRec.startDate = firstRec.endDate;

            await scheduler.project.commitAsync();
        }
    }

    t.it('Delete should move focus immediately', async t => {
        await setup();

        t.chain(
            { click : '.b-sch-event' },

            // The LEFT should not attempt to navigate from a deleted event.
            // No error should be thrown.
            { type : '[DELETE][LEFT]' },

            () => {
                t.pass('No exception thrown');
            }
        );
    });

    t.it('Show add and remove the b-editing class', async t => {
        await setup();

        const eventEl = scheduler.getElementFromEventRecord(scheduler.eventStore.first);

        t.chain(
            { dblclick : () => eventEl },

            next => {
                t.hasCls(eventEl, 'b-editing', 'b-editing added correctly');
                next();
            },

            { click : 'button:contains(Cancel)' },

            // https://github.com/bryntum/support/issues/1630
            // The transitionend handler must have removed the editor from the DOM
            {  waitForSelectorNotFound : '.b-eventeditor' },

            () => {
                t.hasNotCls(eventEl, 'b-editing', 'b-editing removed correctly');
            }
        );
    });

    t.it('Should not have any invalid fields upon first show of the editor', async t => {
        await setup();

        t.chain(scheduler.eventStore.map(event =>
            [
                next => {
                    scheduler.editEvent(event);
                    next();
                },

                { waitForElementVisible : '.b-eventeditor' },

                // The min/max checking must not invalidate
                // valid field values.
                next => {

                    // Check that the title has been translated.
                    t.notOk(scheduler.features.eventEdit.editor.title.includes('{'), 'Localized property has been translated');

                    t.selectorNotExists('.b-invalid');
                    next();
                },

                { type : '[ESC]' },

                // https://github.com/bryntum/support/issues/1630
                // The transitionend handler must have removed the editor from the DOM
                {  waitForSelectorNotFound : '.b-eventeditor' }
            ]
        ));
    });

    t.it('Should show editor on double click', async t => {
        await setup();

        t.firesOnce(scheduler, 'eventEditBeforeSetRecord');

        scheduler.on('eventEditBeforeSetRecord', ({ record }) => {
            t.is(record.name, 'Assignment 1', 'record param passed correctly');
        });

        t.is(scheduler.features.eventEdit.isEditing, false, 'Not editing');

        t.chain(
            { doubleClick : '.FOO' },

            { waitForElementVisible : '.b-eventeditor' },

            () => {
                t.is(scheduler.features.eventEdit.isEditing, true, 'Editing');

                // check editor contents
                t.is(document.querySelector('input[name=name]').value, firstRec.name, 'Name correct');
                t.is(document.querySelector('input[name=resource]').value, firstRec.resource.name, 'Resource correct');
                t.is(document.querySelector('.b-datefield input[name=startDate]').value, '01/04/2011', 'Start date correct');
                t.is(document.querySelector('.b-datefield input[name=endDate]').value, '01/06/2011', 'End date correct');
                t.is(document.querySelector('.b-timefield input[name=startDate]').value, '12:00 AM', 'Start time correct');
                t.is(document.querySelector('.b-timefield input[name=endDate]').value, '12:00 AM', 'End time correct');

                // exposes fields?
                const editor = scheduler.features.eventEdit;
                t.ok(editor.nameField, 'name field exposed');
                t.ok(editor.resourceField, 'resource field exposed');
                t.ok(editor.startDateField, 'startDate field exposed');
                t.ok(editor.endDateField, 'endDate field exposed');
                t.ok(editor.startTimeField, 'startTime field exposed');
                t.ok(editor.endTimeField, 'endTime field exposed');
            }
        );
    });

    t.it('Should show editor for other task on double click, even if it is already visible', async t => {
        await setup();

        t.chain(
            { doubleClick : '.FOO' },

            { waitForElementVisible : '.b-eventeditor' },

            { doubleClick : '.BAR' },

            { waitForElementVisible : '.b-eventeditor' },

            next => {
                t.is(document.querySelectorAll('.b-eventeditor').length, 1, 'Only one event editor open');
                next();
            }
        );
    });

    t.it('Should update record (+ DOM) after save', async t => {
        await setup();

        t.chain(
            { doubleClick : '.FOO' },

            { waitForSelector : '.b-eventeditor:not(.b-hidden)' },

            next => {
                scheduler.features.eventEdit.nameField.value = '';
                next();
            },

            { click : 'input[name=name]' },

            { type : 'test1234' },

            { click : 'button:contains(Save)' },

            {  waitForSelectorNotFound : '.b-eventeditor' },

            next => {
                t.is(scheduler.eventStore.first.name, 'test1234', 'Record was updated ok');
                t.like(document.querySelector('.FOO').innerHTML, 'test1234', 'Element was refreshed ok');
                next();
            },

            { waitForSelectorNotFound : '.b-eventeditor:not(.b-hidden)' }
        );
    });

    t.it('Should save and close on enter', async t => {
        await setup();

        t.chain(
            { doubleClick : '.FOO' },

            { waitForSelector : '.b-eventeditor:not(.b-hidden)' },

            next => {
                scheduler.features.eventEdit.nameField.value = '';
                next();
            },

            { click : 'input[name=name]' },

            { type : 'test1234[ENTER]' },

            next => {
                t.is(scheduler.eventStore.first.name, 'test1234', 'Record was updated ok');
                t.like(document.querySelector('.FOO').innerHTML, 'test1234', 'Element was refreshed ok');
                next();
            },

            { waitForSelectorNotFound : '.b-eventeditor:not(.b-hidden)' }
        );
    });

    t.it('Should delete (triggers clear DOM) after delete', async t => {
        await setup();

        t.chain(
            { doubleClick : '.FOO' },

            { waitForSelector : '.b-eventeditor:not(.b-hidden)' },

            // Testing deleting of existing event
            { click : 'button:contains(Delete)' },

            next => {
                t.is(scheduler.eventStore.indexOf(firstRec), -1, 'Record no longer in the store');

                next();
            },

            { waitForSelectorNotFound : ':not(.b-released) > .FOO' }
        );
    });

    t.it('Should show editor after dragging in the schedule', async t => {
        await setup();

        t.chain(
            next => {
                scheduler.eventStore.removeAll();
                next();
            },

            // Testing creating a new event
            { drag : '.b-sch-timeaxis-cell', offset : [12, 12], by : [100, 0] },

            { waitForSelector : '.b-eventeditor:not(.b-hidden)' },

            { click : 'input[name=name]' },

            { type : 'foo[ENTER]' },

            next => {
                t.is(scheduler.eventStore.count, 1, '1 record was added to the store');
                t.is(scheduler.eventStore.last.name, 'foo', 'Correct name for new event');

                next();
            },

            { waitForSelectorNotFound : '.b-eventeditor:not(.b-hidden)' }
        );
    });

    t.it('Should validate start & end date values', async t => {
        await setup();

        let editor, record;
        const
            DH = DateHelper;

        t.chain(
            { doubleClick : '.FOO' },

            { waitForSelector : '.b-eventeditor:not(.b-hidden)' },

            next => {
                editor = scheduler.features.eventEdit;
                record = editor.eventRecord;

                let startDate = editor.startDateField.value,
                    endDate   = editor.endDateField.value;
                const
                    startTime = editor.startTimeField.value,
                    endTime   = editor.endTimeField.value;

                t.is(startDate, record.get('startDate'), 'Startdate is correct');
                t.is(endDate, editor.endDateField.value, 'Enddate is correct');
                t.is(editor.endTimeField.min, null, 'Endtime min is correctly set to null');
                t.is(editor.startTimeField.max, null, 'Starttime max is correctly set to null');

                t.is(startTime, new Date(2020, 0, 1, 0, 0), 'StartTime is correctly set');
                t.is(endTime, new Date(2020, 0, 1, 0, 0), 'EndTime is correctly set');

                let values = editor.values;
                let duration = DH.getDurationInUnit(values.startDate, values.endDate, 'minutes');
                t.is(duration, 2 * 24 * 60, 'Duration is ok');

                t.is(editor.isValid, true, 'Editor is validated');

                startDate = DH.add(startDate, 2, 'day');
                endDate = DH.add(startDate, 2, 'day');
                editor.startDateField.value = startDate;
                t.is(endDate, editor.endDateField.value, 'Enddate is correct');

                values = editor.values;
                duration = DH.getDurationInUnit(values.startDate, values.endDate, 'minutes');
                t.is(duration, 2 * 24 * 60, 'Duration is ok');

                editor.endDateField.value = startDate;
                t.is(editor.endTimeField.min, editor.startTimeField.value, 'Endtime min is correctly set when start and end date on same day');
                editor.endTimeField.value = new Date(2020, 0, 1, 0, 30);

                editor.endDateField.value = endDate;
                t.is(editor.isValid, true, 'Editor is validated');

                t.is(editor.endTimeField.min, null, 'Endtime min is correctly set to null');
                t.is(editor.startTimeField.max, null, 'Starttime max is correctly set to null');

                editor.startTimeField.value = new Date(2020, 0, 1, 0, 30);
                t.is(editor.endTimeField.value, new Date(2020, 0, 1, 0, 30), '');

                editor.endDateField.value = editor.startDateField.value;
                t.is(editor.endTimeField.min, editor.startTimeField.value, 'Endtime max is correctly set when start and end date on same day');
                editor.startTimeField.value = new Date(2020, 0, 1, 0, 30);
                t.is(editor.endTimeField.min, editor.startTimeField.value, 'Endtime max is correctly set when start and end date on same day');
                editor.endTimeField.value = new Date(2020, 0, 1, 0, 0);

                t.is(editor.isValid, false, 'Editor is falsely validated');
                next();
            },

            { click : 'button:contains(Save)' },

            () => {
                t.is(editor.editor.isVisible, true, 'Editor is still open');
            }
        );
    });

    t.it('Should show editor in readOnly mode if readOnly', async t => {
        await setup({
            enableRecurringEvents : true,
            readOnly              : true
        });

        // We are testing the recurrence editor for readOnlyness
        scheduler.eventStore.first.recurrenceRule = 'FREQ=DAILY;COUNT=6';

        t.chain(
            { dblClick : '.b-sch-event' },

            { waitForSelector : '.b-eventeditor' },

            next => {
                t.selectorExists('.b-eventeditor.b-readonly', 'Editor has b-readonly');
                t.selectorNotExists('.b-field:not(.b-readonly)', 'No non-readonly field found');
                t.selectorNotExists('.b-button:visible:not(:contains(Daily))', 'No visible update buttons found');
                next();
            },

            // Show the recurrence editor to test its readOnly state
            { click : 'button:contains(Daily)' },

            next => {
                t.selectorExists('.b-recurrenceeditor.b-readonly', 'RecurrenceEditor has b-readonly');
                t.selectorNotExists('.b-field:not(.b-buttongroup):not(.b-readonly)', 'No non-readonly field found');
                t.selectorNotExists('.b-button:visible:not(:contains(Daily))', 'No visible update buttons found');
                next();
            },

            { type : '[ESCAPE]' },

            {
                waitFor : () => scheduler.features.eventEdit.editor.containsFocus
            },

            // Go back to the event name field because we are going to test the ENTER key
            { click : '[data-ref="nameField"] input' },

            next => {
                scheduler.features.eventEdit.editor.widgetMap.nameField.value = 'Changed Programatically';
                next();
            },

            {
                type : '[ENTER]'
            },

            // ENTER should do nothing if we're readOnly
            next => {
                t.selectorExists('.b-eventeditor', 'Editor still present');
                next();
            },

            {
                type : '[ESCAPE]', target : null
            },

            // ESCAPE should hide it
            { waitForSelectorNotFound : '.b-eventeditor' }
        );
    });

    // https://app.assembla.com/spaces/bryntum/tickets/6848
    t.it('Should create new record even if resource field is not shown in Editor', async t => {
        await setup({
            features : {
                eventTooltip : false,
                eventEdit    : {
                    showResourceField : false
                }
            }
        }, false);

        t.chain(
            { dblclick : '.b-grid-subgrid-normal .b-grid-cell' },
            { type : 'test', target : '.b-eventeditor .b-textfield input' },
            { click : '.b-button.b-green' },
            { waitFor : () => scheduler.eventStore.count === 6 },
            () => {
                const rec = scheduler.eventStore.last;

                t.is(rec.name, 'test');
                t.is(rec.resource.name, 'Mike');
            }
        );
    });

    // https://app.assembla.com/spaces/bryntum/tickets/6803
    t.it('Should adjust the duration model field on setting end date/time', async t => {
        await setup({
            features : {
                eventTooltip : false,
                eventEdit    : true
            }
        }, false);

        t.is(firstRec.durationUnit, 'day');
        t.is(firstRec.duration, 2);

        t.chain(
            { dblclick : '[data-event-id=1]' },
            { click : '.b-datefield input[name=endDate]' },
            // HACK for IE11: it somehow hangs when we just try to type to field after dblclick
            // In order to fix that action we only type last digit in the test (for field listeners to activate)
            // and complete editing right after. This problem is reproducible in eventeditor also if you remove the value
            // from this field, switch to another and then try to type. Very difficult to debug because browser hangs.
            // At the same time normal usage seems to work.
            next => {
                document.querySelector('.b-datefield input[name=endDate]').value = '01/07/201';
                next();
            },
            { type : '1[ENTER]' },
            () => {
                t.is(firstRec.durationUnit, 'day');
                t.is(firstRec.duration, 3);
            }
        );
    });

    // region https://app.assembla.com/spaces/bryntum/tickets/6912
    t.it('Should move event if change start time by typing and pressing Enter', async t => {
        await setup({
            features : {
                eventTooltip : false,
                eventEdit    : true
            }
        }, false);

        t.chain(
            { dblclick : '[data-event-id=1]' },
            { dblclick : '.b-timefield input[name=startDate]' },
            { type : '10:00 AM[ENTER]', target : '.b-timefield input[name=startDate]' },
            () => {
                t.isDateEqual(firstRec.endDate, new Date(2011, 0, 6, 10));
            }
        );
    });

    t.it('Should move event if change start time by typing and click Save', async t => {
        await setup({
            features : {
                eventTooltip : false,
                eventEdit    : true
            }
        }, false);

        t.chain(
            { dblclick : '[data-event-id=1]' },
            { dblclick : '.b-timefield input[name=startDate]' },
            { type : '10:00 AM', target : '.b-timefield input[name=startDate]' },
            { click : '.b-button.b-green' },
            () => {
                t.isDateEqual(firstRec.endDate, new Date(2011, 0, 6, 10));
            }
        );
    });

    t.it('Should move event if change start time by typing, then click a field and click Save', async t => {
        await setup({
            features : {
                eventTooltip : false,
                eventEdit    : true
            }
        }, false);

        t.chain(
            { dblclick : '[data-event-id=1]' },
            { dblclick : '.b-timefield input[name=startDate]' },
            { type : '10:00 AM', target : '.b-timefield input[name=startDate]' },
            { click : '.b-textfield input[name=name]' },
            { click : '.b-button.b-green' },
            () => {
                t.isDateEqual(firstRec.endDate, new Date(2011, 0, 6, 10));
            }
        );
    });
    // endregion https://app.assembla.com/spaces/bryntum/tickets/6912

    t.it('Should support creating a new Event on the fly (that is not in the EventStore yet) and editing it', async t => {
        await setup({
            events   : [],
            features : {
                eventTooltip : false,
                eventEdit    : true
            }
        }, false);

        // NOTE: Had to add endDate here, since normalization happens in engine now
        const event = new EventModel({
            resourceId   : scheduler.resourceStore.first.id,
            startDate    : scheduler.startDate,
            duration     : 1,
            durationUnit : 'd',
            endDate      : DateHelper.add(scheduler.startDate, 1, 'd'),
            name         : 'New task'
        });

        scheduler.editEvent(event);

        t.chain(
            { click : '.b-button:textEquals(Save)' },
            () => {
                t.selectorCountIs('.b-sch-event', 1, '1 event created');
            }
        );
    });

    t.it('Should calculate end date if editing a new Event with start date + duration defined', async t => {
        await setup({
            events   : [],
            features : {
                eventTooltip : false,
                eventEdit    : true
            }
        }, false);

        const event = new EventModel({
            resourceId   : scheduler.resourceStore.first.id,
            startDate    : scheduler.startDate,
            duration     : 1,
            durationUnit : 'd',
            name         : 'New task'
        });

        await scheduler.editEvent(event);

        t.is(scheduler.features.eventEdit.getEditor().widgetMap.endDateField.value, new Date(2011, 0, 4), 'End date calculated');
    });

    // https://app.assembla.com/spaces/bryntum/tickets/7511-group-summary-rows-visible-in-resource-combo-of-event-editor/details#
    t.it('Should not include special rows (grouping, summary) in resource combo', async t => {
        await setup({
            events   : [],
            features : {
                group        : 'name',
                groupSummary : {
                    summaries : [
                        {
                            label    : 'Summary',
                            renderer : () => ''
                        }
                    ]
                }
            }
        }, false);

        const event = new EventModel({
            resourceId : scheduler.resourceStore.first.id,
            startDate  : new Date(),
            endDate    : new Date()
        });

        scheduler.editEvent(event);

        t.is(scheduler.features.eventEdit.resourceField.store.count, 6, 'No group header records or summary row records in the Store');
    });

    // https://app.assembla.com/spaces/bryntum/tickets/7560
    t.it('Resource combo should show all resources', async t => {
        await setup({
            features : {
                group        : 'name',
                eventEdit    : true,
                eventTooltip : false
            }
        });

        scheduler.collapseAll();

        t.chain(
            { click : '.b-group-row' },

            { dblclick : '[data-index="1"] .b-sch-timeaxis-cell', offset : [10, 10] },

            { waitFor : () => scheduler.features.eventEdit.editor.containsFocus },
            { type : 'New test event' },

            { click : 'button:contains(Save)' },

            { click : '.b-group-row[data-index="2"]' },

            { dblclick : '[data-index="3"] .b-sch-timeaxis-cell', offset : [10, 10] },

            () => {
                t.is(scheduler.eventEdit.resourceField.store.count, 6, 'All resources in store');
            }
        );
    });

    // https://github.com/bryntum/support/issues/123
    t.it('Should show full list of resources in Event Editor when resource store is filtered', async t => {
        await setup();

        const count = scheduler.resourceStore.count;

        scheduler.resourceStore.filter('name', 'Linda');

        t.chain(
            { dblclick : '[data-event-id="2"]' },
            { click : '[data-ref="resourceField"] .b-fieldtrigger' },
            { waitForSelector : '.b-list-item' },
            () => {
                t.selectorCountIs('.b-list-item', count, 'Full list of resources shown');
            }
        );
    });

    t.it('Should show full list of resources in Event Editor when resource store is a tree store and it is filtered', async t => {
        function getChildren(char = 'r') {
            const resources = [];
            for (var i = 1; i < 10; i++) {
                const id = char + i;
                resources.push({ id : id, name : id });
            }
            return resources;
        }

        await setup({
            features : {
                tree : true
            },
            resourceStore : new ResourceStore({
                tree : true,
                data : [
                    { id : 1000, name : 'Foo', expanded : true, children : getChildren() },
                    { id : 2000, name : 'Bar', expanded : true, children : getChildren('b') }
                ]
            }),
            columns : [{ type : 'tree', field : 'name' }]
        });

        const count = scheduler.resourceStore.count;

        scheduler.resourceStore.filter('name', 'r2');

        t.chain(
            { dblclick : '[data-event-id="2"]' },
            { click : '[data-ref="resourceField"] .b-fieldtrigger' },
            { waitForSelector : '.b-list-item' },
            () => {
                t.selectorCountIs('.b-list-item', count, 'Full list of resources shown');
            }
        );
    });

    t.it('Should show full list of resources in Event Editor when resource store is a tree store and some of resources are collapsed', async t => {
        function getChildren(char = 'r') {
            const resources = [];
            for (var i = 1; i < 10; i++) {
                const id = char + i;
                resources.push({ id : id, name : id });
            }
            return resources;
        }

        await setup({
            features : {
                tree : true
            },
            resourceStore : new ResourceStore({
                tree : true,
                data : [
                    { id : 1000, name : 'Foo', expanded : true, children : getChildren() },
                    { id : 2000, name : 'Bar', expanded : true, children : getChildren('b') }
                ]
            }),
            columns : [{ type : 'tree', field : 'name' }]
        });

        const count = scheduler.resourceStore.count;

        t.chain(
            () => scheduler.collapse(scheduler.resourceStore.getById(2000)),
            { dblclick : '[data-event-id="2"]' },
            { click : '[data-ref="resourceField"] .b-fieldtrigger' },
            { waitForSelector : '.b-list-item' },
            () => {
                t.selectorCountIs('.b-list-item', count, 'Full list of resources shown');
            }
        );
    });

    t.it('Time field step value should match current timeaxis time resolution', async t => {
        await setup({
            events : [
                { name : 'Test event', resourceId : 'r1', id : 1, startDate : new Date(2011, 0, 4), endDate : new Date(2011, 0, 5) }
            ],
            features : {
                eventEdit    : true,
                eventTooltip : false
            }
        }, false);

        t.chain(
            { dblclick : '.b-sch-event' },
            { click : '.b-timefield .b-align-end.b-icon-angle-right' },
            { click : 'button:textEquals(Save)' },

            () => {
                t.is(scheduler.eventStore.first.startDate, new Date(2011, 0, 4, 1), 'Bumped +1h');
            }
        );
    });

    t.it('Should support readOnly mode', async t => {
        await setup({
            features : {
                eventEdit : {
                    readOnly : true
                }
            }
        }, false);

        t.chain(
            { dblclick : '.b-sch-event' },
            { waitForSelector : '.b-eventeditor' },
            () => {
                t.selectorExists('.b-eventeditor.b-readonly', 'Editor has b-readonly');
                t.selectorNotExists('.b-field:not(.b-readonly)', 'No none-readonly field found');
                t.selectorNotExists('.b-button:not(.b-hidden)', 'No visible button found');
            }
        );
    });

    t.it('Should support disabling', async t => {
        await setup({
            features : {
                columnLines : false // Weird NaN fail otherwise in background image
            }
        });

        scheduler.features.eventEdit.disabled = true;

        t.chain(
            { dblclick : '.b-sch-event' },

            next => {
                t.selectorNotExists('.b-eventeditor', 'No editor');

                scheduler.features.eventEdit.disabled = false;

                next();
            },

            { dblclick : '.b-sch-event' },

            () => {
                t.selectorExists('.b-eventeditor', 'Editor shown');
            }
        );
    });

    // https://github.com/bryntum/support/issues/65
    t.it('Should position event correctly after changing resource and time', async t => {
        scheduler = t.getScheduler({
            enableEventAnimations : false,

            features : {
                eventEdit : true
            }
        });

        t.chain(
            { dblClick : '[data-event-id="1"]' },

            { type : '[DOWN]', target : '[name=resource]' },

            { waitForElementVisible : '.b-list' },

            { type : '[DOWN][ENTER]', target : '[name=resource]' },

            { type : '01/05/2011[ENTER]', target : '[name=startDate]', clearExisting : true },

            () => {
                const box = Rectangle.from(
                    document.querySelector('[data-event-id="1"]'),
                    scheduler.timeAxisSubGridElement
                );

                t.isApprox(box.left, 200, 1, 'Correct X');
                t.isApprox(box.top, 56, 1, 'Correct Y');
            }
        );
    });

    // https://app.assembla.com/spaces/bryntum/tickets/9456
    t.it('Repeat field should be hidden when RecurringEvents feature is disabled', async t => {
        await setup({
            enableRecurringEvents : false
        });

        t.chain(
            { dblclick : '.b-sch-event' },

            { waitForSelector : '.b-eventeditor' },

            () => {
                t.elementIsNotTopElement('[data-ref="recurrenceCombo"]', 'Repeat field is hidden');
                t.elementIsNotTopElement('[data-ref="editRecurrenceButton"]', 'Repeat button is hidden');
            }
        );
    });

    t.it('Should hide repeat field when disable RecurringEvents', async t => {
        await setup({
            enableRecurringEvents : true
        });

        t.chain(
            { dblclick : '.b-sch-event' },
            { waitForSelector : '.b-eventeditor' },

            next => {
                t.elementIsTopElement('[data-ref="recurrenceCombo"]', 'Repeat field is visible');
                next();
            },

            { click : ':textEquals(Cancel)' },
            { waitForSelectorNotFound : '.b-eventeditor' },

            next => {
                scheduler.enableRecurringEvents = false;
                next();
            },

            { dblclick : '.b-sch-event' },
            { waitForSelector : '.b-eventeditor' },

            () => {
                t.elementIsNotTopElement('[data-ref="recurrenceCombo"]', 'Repeat field is hidden');
                t.elementIsNotTopElement('[data-ref="editRecurrenceButton"]', 'Repeat button is hidden');
            }
        );
    });

    t.it('UI should be locked when Scheduler is readOnly', async t => {
        await setup({
            readOnly              : true,
            startDate             : new Date(2018, 5, 11),
            endDate               : new Date(2018, 5, 25),
            enableRecurringEvents : true,
            features              : {
                eventEdit : true
            },
            resources : [{ id : 'r1', name : 'test' }],
            events    : [
                {
                    id             : 1,
                    resourceId     : 'r1',
                    name           : 'Bar',
                    startDate      : '2018-06-14',
                    endDate        : '2018-06-15',
                    recurrenceRule : 'FREQ=WEEKLY;INTERVAL=1',
                    cls            : 'sch-event2'
                }
            ]
        });

        t.chain(
            { dblclick : '.b-sch-event' },

            { waitForSelector : '.b-eventeditor' },

            // Check first occurrence is in sync with state of Scheduler
            next => {
                const { editor } = scheduler.features.eventEdit;

                // UI must be locked
                const inputs = editor.queryAll(w => w.isField);
                inputs.forEach(input => t.ok(input.readOnly));

                scheduler.readOnly = false;
                next();
            },

            // Check it unlocks
            next => {
                const { editor } = scheduler.features.eventEdit;

                // UI must be locked
                const inputs = editor.queryAll(w => w.isField);
                inputs.forEach(input => t.notOk(input.readOnly));

                scheduler.readOnly = true;
                next();
            },

            // Check it locks again
            () => {
                const { editor } = scheduler.features.eventEdit;

                // UI must be locked
                const inputs = editor.queryAll(w => w.isField);
                inputs.forEach(input => t.ok(input.readOnly));

                scheduler.readOnly = false;
            }
        );
    });

    t.it('Repeat field should be hidden when editor.showRecurringUI is false', async t => {
        await setup({
            startDate             : new Date(2018, 5, 11),
            endDate               : new Date(2018, 5, 25),
            enableRecurringEvents : true,
            features              : {
                eventEdit : {
                    showRecurringUI : false
                }
            },
            resources : [{ id : 'r1', name : 'test' }],
            events    : [
                {
                    id         : 1,
                    resourceId : 'r1',
                    name       : 'Foo',
                    startDate  : '2018-06-14',
                    endDate    : '2018-06-15',
                    cls        : 'sch-event1'
                },
                {
                    id             : 2,
                    resourceId     : 'r1',
                    name           : 'Bar',
                    startDate      : '2018-06-14',
                    endDate        : '2018-06-15',
                    recurrenceRule : 'FREQ=WEEKLY;INTERVAL=1',
                    cls            : 'sch-event2'
                },
                {
                    id             : 3,
                    resourceId     : 'r1',
                    name           : 'Baz',
                    startDate      : '2018-06-14',
                    endDate        : '2018-06-15',
                    recurrenceRule : 'FREQ=DAILY;INTERVAL=2',
                    cls            : 'sch-event3'
                }
            ]
        });

        t.chain(
            { dblclick : '.b-sch-event' },

            { waitForSelector : '.b-eventeditor' },

            () => {
                t.elementIsNotTopElement('[data-ref="recurrenceCombo"]', 'Repeat field is hidden');
                t.elementIsNotTopElement('[data-ref="editRecurrenceButton"]', 'Repeat button is hidden');
            }
        );
    });

    t.it('Repeat field should be hidden no matter that editor.showRecurringUI is true', async t => {
        await setup({
            startDate             : new Date(2018, 5, 11),
            endDate               : new Date(2018, 5, 25),
            enableRecurringEvents : false,
            features              : {
                eventEdit : {
                    showRecurringUI : true
                }
            },
            resourceStore : new ResourceStore({
                data : [{ id : 'r1', name : 'test' }]
            }),
            eventStore : new EventStore({
                data : [
                    {
                        id         : 1,
                        resourceId : 'r1',
                        name       : 'Foo',
                        startDate  : '2018-06-14',
                        endDate    : '2018-06-15',
                        cls        : 'sch-event1'
                    },
                    {
                        id             : 2,
                        resourceId     : 'r1',
                        name           : 'Bar',
                        startDate      : '2018-06-14',
                        endDate        : '2018-06-15',
                        recurrenceRule : 'FREQ=WEEKLY;INTERVAL=1',
                        cls            : 'sch-event2'
                    },
                    {
                        id             : 3,
                        resourceId     : 'r1',
                        name           : 'Baz',
                        startDate      : '2018-06-14',
                        endDate        : '2018-06-15',
                        recurrenceRule : 'FREQ=DAILY;INTERVAL=2',
                        cls            : 'sch-event3'
                    }
                ]
            })
        });

        t.chain(
            { dblclick : '.b-sch-event' },

            { waitForSelector : '.b-eventeditor' },

            () => {
                t.elementIsNotTopElement('[data-ref="recurrenceCombo"]', 'Repeat field is hidden');
                t.elementIsNotTopElement('[data-ref="editRecurrenceButton"]', 'Repeat button is hidden');
            }
        );
    });

    // https://github.com/bryntum/support/issues/96
    t.it('Should remove proxy element when autoClose is set to false', async t => {
        scheduler = t.getScheduler({
            events   : [],
            features : {
                eventEdit : {
                    autoClose : false
                }
            }
        });

        t.chain(
            { drag : '.b-sch-timeaxis-cell', fromOffset : [2, 2], by : [50, 0] },
            { dblclick : '.b-sch-timeaxis-cell', offset : [100, 2] },
            { dblclick : '.b-sch-timeaxis-cell', offset : [300, 2] },

            () => t.selectorCountIs('.b-sch-dragcreator-proxy', 1)
        );
    });

    // https://github.com/bryntum/support/issues/346
    t.it('Should be possible to enable fields which are initially disabled', t => {
        scheduler = t.getScheduler({
            features : {
                eventEdit : {
                    resourceFieldConfig : {
                        disabled : true
                    }
                }
            }
        });

        t.chain(
            { dblclick : '.b-sch-event-wrap[data-event-id="1"]' },

            { waitForSelector : '.b-combo[data-ref="resourceField"]' },

            next => {
                const resourceField = scheduler.features.eventEdit.editor.widgetMap.resourceField;

                t.ok(resourceField.disabled, 'Resource is disabled');

                resourceField.disabled = false;

                t.notOk(resourceField.disabled, 'Resource is not disabled');
                t.notOk(resourceField.readOnly, 'Resource is not read only');

                next();
            },

            { click : '.b-combo[data-ref="resourceField"] .b-fieldtrigger' },

            { click : '.b-list-item[data-id="r3"]' },

            { click : '.b-button[data-ref="saveButton"]' },

            () => {
                const rec = scheduler.eventStore.getById(1);
                t.ok(rec.isModified, 'Record is updated');
                t.is(rec.resourceId, 'r3', 'Resource is Don');
            }
        );
    });

    t.it('Should not crash if clicking next/prev time arrows with empty date field', t => {
        scheduler = t.getScheduler({
            features : {
                eventEdit : true
            }
        });

        t.chain(
            { dblclick : '.b-sch-event-wrap[data-event-id="1"]' },

            next => {
                scheduler.features.eventEdit.editor.widgetMap.startDateField.value = null;
                scheduler.features.eventEdit.editor.widgetMap.endDateField.value = null;

                next();
            },

            { click : '.b-timefield .b-icon-angle-left' },
            { click : '.b-timefield .b-icon-angle-right' }
        );
    });

    // https://github.com/bryntum/support/issues/554
    t.it('Should display correct time in event editor', async t => {
        setup({
            events : [
                {
                    id         : 1,
                    name       : 'foo',
                    resourceId : 'r1',
                    startDate  : new Date(2011, 0, 5, 10),
                    endDate    : new Date(2011, 0, 5, 23)
                }
            ]
        }, false);

        t.chain(
            { doubleClick : '.b-sch-event' },
            { waitForElementVisible : '.b-eventeditor' },

            () => {
                const editor = scheduler.features.eventEdit;

                t.is(editor.startTimeField.inputValue, '10:00 AM');
                t.is(editor.endTimeField.inputValue, '11:00 PM');
            }
        );
    });

    t.it('Should be possible to hide Delete button in `beforeEventEditShow` listener', async t => {
        await setup({
            listeners : {
                beforeEventEditShow({ eventRecord, editor, eventEdit }) {
                    editor.widgetMap.deleteButton.hidden = true;
                }
            },
            events : [
                {
                    id         : 1,
                    name       : 'foo',
                    resourceId : 'r1',
                    startDate  : new Date(2011, 0, 5, 10),
                    endDate    : new Date(2011, 0, 5, 23)
                }
            ]
        }, false);

        await scheduler.editEvent(scheduler.eventStore.first);

        t.elementIsNotVisible('.b-button:textEquals(Delete)', 'Delete button hidden');
    });

    // https://github.com/bryntum/support/issues/1373
    t.it('Should not affect time of previously edited events', async t => {
        await setup({
            viewPreset : 'hourAndDay',
            events     : [
                { id : 1, name : 'E1', startDate : '2011-01-03T02:00', duration : 2, durationUnit : 'h', resourceId : 'r1' },
                { id : 2, name : 'E2', startDate : '2011-01-03T02:00', duration : 2, durationUnit : 'h', resourceId : 'r2' },
                { id : 3, name : 'E3', startDate : '2011-01-03T02:00', duration : 2, durationUnit : 'h', resourceId : 'r3' }
            ],
            startDate : '2011-01-03',
            endDate   : '2011-01-04'
        }, false);

        const [event1, event2] = scheduler.eventStore;

        await scheduler.editEvent(event1);

        t.chain(
            { type : '08:00[ENTER]', target : '[data-ref=startTimeField] input', clearExisting : true },

            async() => scheduler.editEvent(event2),

            { type : '09:00[ENTER]', target : '[data-ref=startTimeField] input', clearExisting : true },

            () => {
                t.is(event1.startDate, new Date(2011, 0, 3, 8), 'Correct time for E1');
                t.is(event2.startDate, new Date(2011, 0, 3, 9), 'Correct time for E2');
            }
        );
    });

    // https://github.com/bryntum/support/issues/1529
    t.it('Initially blank fields should not appear as invalid immediately', async t => {
        await setup({
            viewPreset : 'hourAndDay',
            events     : [
                { id : 1, name : '', startDate : '2011-01-03T02:00', duration : 2, durationUnit : 'h', resourceId : 'r1' }
            ],
            startDate : '2011-01-03',
            endDate   : '2011-01-04'
        }, false);

        t.chain(
            { dblclick : '.b-sch-event-wrap' },

            { waitFor : () => scheduler.features.eventEdit.editor?.containsFocus },

            next => {
                // Name field must not be flagged as invalid
                t.hasNotCls(scheduler.features.eventEdit.editor.widgetMap.nameField.element, 'b-invalid');
                next();
            },

            { type : '[TAB]' },

            () => {
                // Name field must now be flagged as invalid
                t.hasCls(scheduler.features.eventEdit.editor.widgetMap.nameField.element, 'b-invalid');
            }
        );
    });

    if (t.browser.firefox) {
        // https://github.com/bryntum/support/issues/1611
        t.it('FireFox: Should not be draggable when field is focused', async t => {
            await setup();

            await scheduler.editEvent(scheduler.eventStore.first);

            await t.click('input');

            t.selectorNotExists('[draggable]', 'Not draggable');

            await t.click('.b-field label');

            t.selectorExists('[draggable]', 'Draggable');
        });
    }

    t.it('Event name must not be able to be saved as blank', async t => {
        await setup();

        const
            { name } = scheduler.eventStore.first,
            keys     = [...name].map(c => '[BACKSPACE]').join('');

        t.chain(
            { dblclick : '.b-sch-event-wrap' },

            { waitFor : () => scheduler.features.eventEdit.editor?.containsFocus },

            // Use erase in case we decide to not use clearable:true
            // Note that { type : '', clearExisting : true } doesn't trigger the
            // field's change handling and validation pathway, but typing
            // multiple backspaces does.
            { type : keys },

            { click : 'button:contains(Save)' },

            // Editor must still be visible with the name field invalid
            () => {
                t.ok(scheduler.features.eventEdit.editor?.containsFocus);
                t.notOk(scheduler.features.eventEdit.editor.widgetMap.nameField.isValid);
            }
        );
    });

    // https://github.com/bryntum/support/issues/1911
    t.it('Should not throw error for disabled startTimeField and endTimeField', async t => {
        await setup({
            features : {
                eventEdit : {
                    items : {
                        startTimeField : false,
                        endTimeField   : false
                    }
                }
            }
        });

        t.doubleClick('.b-sch-event-wrap');
    });

    // https://github.com/bryntum/support/issues/2030
    t.it('Should handle returning false from beforeEventAdd', async t => {
        await setup({
            events    : [],
            listeners : {
                beforeEventAdd() {
                    return false;
                },
                once : true
            }
        });

        await t.doubleClick('.b-sch-timeaxis-cell');
        await t.type(null, 'foo[ENTER][ESC]');
        t.selectorNotExists(scheduler.unreleasedEventSelector, 'beforeEventAdd blocked the add');

        await t.doubleClick('.b-sch-timeaxis-cell');
        await t.type(null, 'bar[ENTER]');
        t.selectorExists(scheduler.unreleasedEventSelector + ':contains(bar)', 'Event added normally');
    });

});
