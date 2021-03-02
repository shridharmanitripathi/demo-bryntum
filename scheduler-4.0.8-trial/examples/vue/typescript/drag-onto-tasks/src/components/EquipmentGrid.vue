<template>
    <grid
        ref="equipmentgrid"
        :store="store"
        :filter-bar-feature="true"
        :cell-edit-feature="false"
        :row-height="rowHeight"
        :columns="columns"
    ></grid>
</template>

<script lang="ts">
    import { Grid as GridInstance } from "bryntum-scheduler";
    import { Component, Vue } from "vue-property-decorator";
    import Grid from "./wrappers/Grid.vue";

    @Component({
        props      : {
            store : Object
        },
        components : {
            Grid
        }
    })
    export default class EquipmentGrid extends Vue {
        public name = "equipmentgrid";

        public grid!: GridInstance;

        public $refs!: {
            equipmentgrid: Grid
        };

        public data() {
            return {
                rowHeight : 100,

                columns : [
                    {
                        text       : "",
                        field      : "name",
                        htmlEncode : false,
                        cellCls    : "b-equipment",
                        renderer   : (data: any) =>
                            `<i class="${data.record.iconCls}"></i>${data.record.name}`
                    }
                ]
            };
        }

        public mounted() {
            this.grid = this.$refs.equipmentgrid.gridInstance;
        }
    }
</script>

<style lang="scss">
    .b-equipment {
        flex-direction  : column;
        justify-content : center;

        i {
            margin-right  : 10px;
            color         : #4887e5;
            font-size     : 2em;
            margin-bottom : 0.3em;
        }

        &.b-dragging {
            justify-content : center;
            background      : green;
            color           : #fff;

            i {
                color : #fff;
            }
        }

        &.b-drag-invalid {
            background : red;
        }
    }

    .b-drag-proxy.b-aborting.b-grid-cell {
        transition     : transform 0.3s !important;
        background     : red;
        position       : absolute !important;
        z-index        : 10000;
        pointer-events : none;
        opacity        : 0.8;
        box-sizing     : border-box;
    }

    .grid-container {
        .b-grid-header-text {
            display : none;
        }
    }
</style>
