/**
 * Scheduler configuration file
 */
export default {

    barMargin         : 10,
    rowHeight         : 60,
    minHeight         : 100,
    eventStyle        : 'border',
    resourceImagePath : 'assets/users/',

    startDate : new Date(2018, 1, 7, 8),
    endDate   : new Date(2018, 1, 7, 22),

    columns : [
        { type : 'resourceInfo', text : 'Staff', field : 'name' },
        {
            text   : 'Type',
            field  : 'role',
            width  : 130,
            editor : {
                type        : 'combo',
                items       : ['Sales', 'Developer', 'Marketing', 'Product manager'],
                editable    : false,
                pickerWidth : 140
            }
        }
    ],

    eventEditFeature : {
        // Add extra widgets to the event editor
        items : {
            description : {
                type  : 'text',
                name  : 'desc',
                label : 'Description'
            }
        }
    },

    crudManager : {
        autoLoad  : true,
        transport : {
            load : {
                url : 'assets/data/data.json'
            }
        }
    }

};
