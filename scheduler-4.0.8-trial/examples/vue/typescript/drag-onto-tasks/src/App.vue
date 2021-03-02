<template>
    <div id="app">
        <app-header/>

        <div class="horizontal">
            <scheduler
                ref="scheduler"
                :crud-manager="crudManager"
                :equipment-store="equipmentStore"
            />
            <equipment-grid ref="equipment" :store="equipmentStore"/>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import AppHeader from "./components/AppHeader.vue";
    import Scheduler from "./components/Scheduler.vue";
    import EquipmentGrid from "./components/EquipmentGrid.vue";
    import {
        EventModel,
        ResourceModel,
        DateHelper,
        AjaxStore
    } from "bryntum-scheduler";
    import Task from "@/lib/Task";
    import Drag from "@/lib/Drag";
    import "bryntum-scheduler/scheduler.stockholm.css";

    @Component({
        components : {
            AppHeader,
            Scheduler,
            EquipmentGrid
        }
    })
    export default class App extends Vue {
        public $refs!: {
            scheduler: Scheduler,
            equipment: EquipmentGrid
        };

        protected drag!: Drag;

        public data() {
            const equipmentStore = new AjaxStore({
                storeId    : "equipment",
                autoLoad   : true,
                modelClass : Task,
                readUrl    : "data/equipment.json",
                sorters    : [ { field : "name", ascending : true } ]
            });

            return {
                equipmentStore,
                crudManager : {
                    autoLoad   : true,
                    eventStore : {
                        modelClass : Task
                    },
                    transport  : {
                        load : {
                            url : "data/data.json"
                        }
                    }
                }
            };
        }

        public mounted() {
            const grid = this.$refs.equipment.grid;
            const schedule = this.$refs.scheduler.schedulerInstance;

            this.drag = new Drag({
                grid,
                schedule,
                outerElement : grid.element
            });
        }
    }
</script>

<style lang="scss">
    body,
    html {
        height   : 100%;
        width    : 100%;
        overflow : hidden;
    }

    body {
        margin  : 0;
        display : flex;
    }

    #app {
        flex           : 1 1 0;
        display        : flex;
        flex-direction : column;
        align-items    : stretch;
        overflow       : hidden;
        font-family    : Lato, "Helvetica Neue", Arial, Helvetica, sans-serif;
        font-size      : 14px;

        .horizontal {
            flex           : 1;
            display        : flex;
            flex-direction : row;
        }


        .scheduler-container {
            flex     : 1;
            overflow : hidden;
        }

        .grid-container {
            flex : 0 0 140px;

            .b-gridbase {
                flex        : 0 0 140px;
                border-left : 2px solid #aaa;

                .b-grid-cell {
                    cursor : pointer;
                }
            }
        }

        .b-grid-header {
            height : 57px;
        }

        .b-filter-bar-field {
            margin : 0;
        }
    }

</style>

