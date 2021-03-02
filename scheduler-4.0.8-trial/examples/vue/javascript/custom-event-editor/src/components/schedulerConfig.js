/**
 *- Configuration for the scheduler
 */
const resources = [
    { id : 'r1', name : 'Mike' },
    { id : 'r2', name : 'Linda' },
    { id : 'r3', name : 'Don' },
    { id : 'r4', name : 'Karen' },
    { id : 'r5', name : 'Doug' },
    { id : 'r6', name : 'Peter' },
    { id : 'r7', name : 'Sam' },
    { id : 'r8', name : 'Melissa' },
    { id : 'r9', name : 'John' },
    { id : 'r10', name : 'Ellen' }
],
events = [
    {
        resourceId : 'r1',
        startDate  : new Date(2017, 0, 1, 10),
        endDate    : new Date(2017, 0, 1, 12),
        name       : 'Meeting #1',
        iconCls    : 'b-fa b-fa-mouse-pointer'
    },
    {
        resourceId : 'r2',
        startDate  : new Date(2017, 0, 1, 12),
        endDate    : new Date(2017, 0, 1, 14, 30),
        name       : 'Appointment #1',
        iconCls    : 'b-fa b-fa-arrows-alt'
    },
    {
        resourceId : 'r3',
        startDate  : new Date(2017, 0, 1, 14),
        endDate    : new Date(2017, 0, 1, 16),
        name       : 'Meeting #2',
        eventColor : 'purple',
        iconCls    : 'b-fa b-fa-mouse-pointer'
    },
    {
        resourceId : 'r4',
        startDate  : new Date(2017, 0, 1, 8),
        endDate    : new Date(2017, 0, 1, 11),
        name       : 'Breakfast with customer',
        iconCls    : 'b-fa b-fa-mouse-pointer'
    },
    {
        resourceId : 'r5',
        startDate  : new Date(2017, 0, 1, 14),
        endDate    : new Date(2017, 0, 1, 17),
        name       : 'Very important meeting #11',
        iconCls    : 'b-fa b-fa-arrows-alt-h'
    },
    {
        resourceId : 'r6',
        startDate  : new Date(2017, 0, 1, 16),
        endDate    : new Date(2017, 0, 1, 19),
        name       : 'Important meeting',
        iconCls    : 'b-fa b-fa-exclamation-triangle',
        eventColor : 'red'
    },
    {
        resourceId : 'r6',
        startDate  : new Date(2017, 0, 1, 6),
        endDate    : new Date(2017, 0, 1, 8),
        name       : 'Sports event',
        iconCls    : 'b-fa b-fa-basketball-ball'
    },
    {
        resourceId : 'r7',
        startDate  : new Date(2017, 0, 1, 9),
        endDate    : new Date(2017, 0, 1, 11, 30),
        name       : 'Dad\'s birthday!',
        iconCls    : 'b-fa b-fa-birthday-cake',
        style      : 'background-color : teal; font-size: 18px'
    }
];

export default {
    minHeight        : '20em',
    resources        : resources,
    events           : events,
    startDate        : new Date(2017, 0, 1, 6),
    endDate          : new Date(2017, 0, 1, 20),
    viewPreset       : 'hourAndDay',
    rowHeight        : 50,
    barMargin        : 5,
    multiEventSelect : true,
    resourceImagePath : 'users/',

    columns : [
        { text : 'Name', field : 'name', width : 130 }
    ]

} // eo schedulerConfig

// eof
