import { DateHelper, AsyncHelper, WidgetHelper, DataGenerator, Scheduler } from '../../build/scheduler.module.js?447702';
import shared from '../_shared/shared.module.js?447702';



let scheduler, resourceCountField, eventCountField;

async function generateResources(
    resourceCount = resourceCountField.value,
    eventCount = eventCountField.value
) {
    const
        today           = DateHelper.clearTime(new Date()),
        mask            = WidgetHelper.mask(scheduler.element, 'Generating records'),
        colors          = ['cyan', 'green', 'indigo'],
        resources       = [],
        events          = [],
        assignments     = [],
        dependencies    = [],
        useDependencies = !scheduler.features.dependencies.disabled;

    let schedulerEndDate = today,
        j, step;

    console.time('generate');

    const generator = DataGenerator.generate(resourceCount);

    while ((step = generator.next()) && !step.done) {
        const res = step.value;

        resources.push(res);

        for (j = 0; j < eventCount; j++) {
            const
                startDate = DateHelper.add(today, Math.round(Math.random() * (j + 1) * 20), 'days'),
                duration  = Math.round(Math.random() * 9) + 2,
                endDate   = DateHelper.add(startDate, duration, 'days'),
                eventId   = events.length + 1;

            events.push({
                id         : eventId,
                name       : 'Task #' + (events.length + 1),
                startDate,
                duration,
                endDate,
                eventColor : colors[resources.length % 3]
            });

            assignments.push({
                id       : 'a' + eventId,
                event    : eventId,
                resource : res.id
            });

            if (useDependencies && j > 0) {
                dependencies.push({
                    id   : dependencies.length + 1,
                    from : eventId - 1,
                    to   : eventId
                });
            }

            if (endDate > schedulerEndDate) {
                schedulerEndDate = endDate;
            }
        }

        if (resources.length % 2000 === 0) {
            mask.text = `Generated ${resources.length * eventCount} of ${resourceCount * eventCount} records`;

            await AsyncHelper.animationFrame();
        }
    }

    mask.text = 'Loading data';

    await AsyncHelper.sleep(100);

    console.timeEnd('generate');

    console.time('data');

    scheduler.suspendRefresh();
    scheduler.endDate = schedulerEndDate;
    scheduler.project = {
        assignmentStore : {
            useRawData : true,
            data       : assignments
        },
        resourceStore : {
            useRawData : true,
            data       : resources
        },
        eventStore : {
            useRawData : true,
            data       : events
        },
        dependencyStore : {
            useRawData : true,
            data       : dependencies
        }
    };
    scheduler.resumeRefresh(true);

    await scheduler.project.await('refresh');

    console.timeEnd('data');

    mask.close();
}

function toggleCustom(show) {
    scheduler.widgetMap.dependenciesButton.hidden = resourceCountField.hidden  = eventCountField.hidden = !show;
}

function applyPreset(resources, events) {
    toggleCustom(false);

    resourceCountField.value = resources;
    eventCountField.value = events;

    generateResources();
}

async function initialize() {
    scheduler = new Scheduler({
        appendTo   : 'container',
        minHeight  : '20em',
        eventStyle : 'border',
        rowHeight  : 50,

        columns : [
            { type : 'rownumber' },
            { text : 'Id', field : 'id', width : 50, hidden : true },
            { text : 'First name', field : 'firstName', flex : 1 },
            { text : 'Surname', field : 'surName', flex : 1 },
            { text : 'Score', field : 'score', type : 'number', flex : 1 }
        ],

        features : {
            dependencies : {
                disabled : true
            }
        },

        generateResources,

        tbar : [
            'Presets',
            {
                type     : 'buttongroup',
                defaults : {
                    width : '8em'
                },
                toggleGroup : true,
                items       : [
                    {
                        text    : '1K events',
                        pressed : true,
                        onClick() {
                            applyPreset(200, 5);
                        }
                    },
                    {
                        text : '5K events',
                        onClick() {
                            applyPreset(1000, 5);

                        }
                    },
                    {
                        text : '10K events',
                        onClick() {
                            applyPreset(1000, 10);

                        }
                    },
                    {
                        text : 'Custom',
                        ref  : 'customButton',
                        onClick() {
                            toggleCustom(true);
                        }
                    }
                ]
            },
            '->',
            {
                ref                  : 'resourceCountField',
                type                 : 'number',
                placeholder          : 'Number of resources',
                label                : 'Resources',
                tooltip              : 'Enter number of resource rows to generate and press [ENTER]',
                min                  : 1,
                max                  : 10000,
                value                : 1000,
                width                : 200,
                keyStrokeChangeDelay : 500,
                changeOnSpin         : 500,
                hidden               : true,
                onChange             : () => generateResources()
            }, {
                ref                  : 'eventCountField',
                type                 : 'number',
                placeholder          : 'Number of events',
                label                : 'Events',
                tooltip              : 'Enter number of events per resource to generate and press [ENTER]',
                min                  : 1,
                max                  : 100,
                value                : 5,
                width                : 180,
                keyStrokeChangeDelay : 500,
                changeOnSpin         : 500,
                hidden               : true,
                onChange             : () => generateResources()
            }, {
                type        : 'button',
                ref         : 'dependenciesButton',
                toggleable  : true,
                icon        : 'b-fa-square',
                pressedIcon : 'b-fa-check-square',
                text        : 'Dependencies',
                hidden      : true,
                onToggle({ pressed }) {
                    scheduler.features.dependencies.disabled = !pressed;

                    if (pressed && !scheduler.dependencyStore.count) {
                        generateResources();
                    }
                }
            }
        ]
    });

    resourceCountField = scheduler.widgetMap.resourceCountField;
    eventCountField = scheduler.widgetMap.eventCountField;

    await scheduler.project.commitAsync();

    generateResources();
}

initialize();
