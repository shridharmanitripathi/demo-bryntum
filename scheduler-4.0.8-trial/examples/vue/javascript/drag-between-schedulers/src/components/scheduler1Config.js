/**
 *- Scheduler 1 config
 */
export default {
    id        : 'scheduler1',
    // appendTo  : 'container',
    minHeight : '20em',
    // flex      : '1 1 50%',

    startDate         : new Date(2018, 0, 1, 6),
    endDate           : new Date(2018, 0, 2, 20),
    viewPreset        : 'hourAndDay',
    resourceImagePath : 'users/',

    barMargin : 10,

    features : {
        stripe    : true,
        sort      : true,
        eventDrag : {
            constrainDragToTimeline : false
        }
    },

    columns   : [
        {
            type  : 'resourceInfo',
            text  : 'New York office',
            width : '15em'
        }
    ],
    resources : [
        { id : 1, name : 'Arcady', role : 'Core developer', eventColor : 'purple' },
        { id : 2, name : 'Dave', role : 'Tech Sales', eventColor : 'indigo' },
        { id : 3, name : 'Henrik', role : 'Sales', eventColor : 'blue' },
        { id : 4, name : 'Linda', role : 'Core developer', eventColor : 'cyan' },
        { id : 5, name : 'Maxim', role : 'Developer & UX', eventColor : 'green' },
        { id : 6, name : 'Mike', role : 'CEO', eventColor : 'lime' },
        { id : 7, name : 'Lee', role : 'CTO', eventColor : 'orange' }
    ],
    events    : [
        {
            id           : 1,
            resourceId   : 1,
            name         : 'First Task',
            startDate    : new Date(2018, 0, 1, 10),
            duration     : 2,
            durationUnit : 'h'
        },
        {
            id           : 2,
            resourceId   : 2,
            name         : 'Second Task',
            startDate    : new Date(2018, 0, 1, 12),
            duration     : 2,
            durationUnit : 'h'
        },
        {
            id           : 3,
            resourceId   : 3,
            name         : 'Third Task',
            startDate    : new Date(2018, 0, 1, 14),
            duration     : 2,
            durationUnit : 'h'
        },
        {
            id           : 4,
            resourceId   : 4,
            name         : 'Fourth Task',
            startDate    : new Date(2018, 0, 1, 8),
            duration     : 2,
            durationUnit : 'h'
        },
        {
            id           : 5,
            resourceId   : 5,
            name         : 'Fifth Task',
            startDate    : new Date(2018, 0, 1, 15),
            duration     : 2,
            durationUnit : 'h'
        },
        {
            id           : 6,
            resourceId   : 6,
            name         : 'Sixth Task',
            startDate    : new Date(2018, 0, 1, 16),
            duration     : 2,
            durationUnit : 'h'
        }
    ]
};

// eof
