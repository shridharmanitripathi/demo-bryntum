<template>
    <grid
        ref="grid"
        id="unplanned"
        :stripe-feature="true"
        sort-feature="name"
        :columns="columns"
        :store="store"
    ></grid>
</template>

<script lang="ts">
    import { Component, Prop, Vue, Watch } from "vue-property-decorator";
    import Grid from "./wrappers/Grid.vue";
    import { EventStore, Grid as GridInstance } from "bryntum-scheduler";
    import Task from "@/lib/Task";

    @Component({
        components : {
            Grid
        }
    })
    export default class EquipmentGrid extends Vue {
        public engine!: GridInstance;

        public $refs!: {
            grid: Grid
        };

        @Prop()
        public eventStore!: EventStore;

        private columns = [
            {
                text       : "Unassigned tasks",
                flex       : 1,
                field      : "name",
                htmlEncode : false,
                renderer   : ({ record }: { record: any }) =>
                    `<i class="${record.iconCls}"></i>${record.name}`
            },
            {
                text     : "Duration",
                width    : 100,
                align    : "right",
                editor   : false,
                field    : "duration",
                renderer : ({ record }: { record: any }) =>
                    `${record.duration} ${record.durationUnit}`
            }
        ];

        private store = {
            modelClass : Task,
            readUrl    : "data/unplanned.json",
            autoLoad   : true
        };

        public mounted() {
            // TODO: replace <any> when wrapper is in TS
            this.engine = this.$refs.grid.gridInstance as GridInstance;
        }

        @Watch("eventStore")
        public onEventStoreChanged() {
            this.eventStore &&
            this.eventStore.on({
                // When a task is updated, check if it was unassigned and if so
                // move it back to the unplanned tasks grid
                update({ record, changes }: { record: any; changes: any }) {
                    if ("resourceId" in changes && !record.resourceId) {
                        this.eventStore.remove(record);
                        this.engine.store.add(record);
                    }
                },
                thisObj : this
            });
        }
    }
</script>

<style>
    #unplanned .b-grid-cell {
        cursor : pointer;
    }

    #unplanned i {
        margin-right : 10px;
        color        : #4887e5;
    }
</style>
