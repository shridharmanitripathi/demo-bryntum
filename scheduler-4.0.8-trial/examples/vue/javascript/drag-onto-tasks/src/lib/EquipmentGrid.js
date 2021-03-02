/**
 *- Equipment grid component
 *
 * Taken from the vanilla example
 */
import { Grid } from 'bryntum-scheduler';

export default class EquipmentGrid extends Grid {
    static get defaultConfig() {
        return {
            features : {
                filterBar : true,
                cellEdit  : false
            },

            rowHeight : 100,

            columns : [{
                text       : '',
                field      : 'name',
                htmlEncode : false,
                cellCls    : 'b-equipment',
                renderer   : (data) => `<i class="${data.record.iconCls}"></i>${data.record.name}`
            }]
        };
    } // eo function get defaultConfig

    // Required to store class name for idHelper and bryntum.query in IE11
    static get $name() {
        return 'EquipmentGrid';
    }

    // Factoryable type name
    static get type() {
        return 'equipmentgrid';
    }
}

// Register this widget type with its Factory
EquipmentGrid.initClass();
