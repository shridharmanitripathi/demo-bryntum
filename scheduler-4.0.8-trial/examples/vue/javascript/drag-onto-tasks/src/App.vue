<!--
 * App component
 -->
<template>
    <div id="app">
        <demo-header
            title="Vue Drag onto tasks demo"
            link='../../../../#example-vue-javascript-drag-onto-tasks'
        ></demo-header>
        <div class="content-container">
            <scheduler
                ref                   = "scheduler"
                :rowHeight            = "schedulerConfig.rowHeight"
                :barMargin            = "schedulerConfig.barMargin"
                :eventColor           = "schedulerConfig.eventColor"
                :startDate            = "schedulerConfig.startDate"
                :endDate              = "schedulerConfig.endDate"
                :columns              = "schedulerConfig.columns"
                :viewPreset           = "schedulerConfig.viewPreset"
                :crudManager          = "schedulerConfig.crudManager"
                :timeRangesFeature    = "schedulerConfig.features.timeRanges"
                :eventMenuFeature     = "schedulerConfig.features.eventMenu"
                :eventEditFeature     = "schedulerConfig.features.eventEdit"
                :regionResizeFeature  = "schedulerConfig.features.regionResize"
                :eventBodyTemplate    = "schedulerConfig.eventBodyTemplate"
                :eventRenderer        = "schedulerConfig.eventRenderer"
                :onEquipmentStoreLoad = "schedulerConfig.onEquipmentStoreLoad"
                :equipmentStore       = "schedulerConfig.equipmentStore"
                :resourceImagePath    = "schedulerConfig.resourceImagePath"
            ></scheduler>

            <grid
                ref     = "grid"
                :config = "gridConfig"
            ></grid>
        </div>
    </div>

</template>

<script>
    // App
    import DemoHeader from './components/Header.vue';

    // Scheduler and its config and grid
    import Scheduler from 'bryntum-vue-shared/src/Scheduler.vue';
    import schedulerConfig from './components/schedulerConfig.js';

    // Scheduler components
    import { AjaxStore, Toast, ObjectHelper, EventStore } from 'bryntum-scheduler';
    import Task from './lib/Task.js';
    import Grid from './components/Grid.vue';
    import Drag from './lib/Drag.js';

    // We need to import it here because it comes from the package
    import 'bryntum-scheduler/scheduler.stockholm.css';

    const equipmentStore = new AjaxStore({
        modelClass : Task,
        readUrl    : 'data/equipment.json',
        sorters    : [
            { field : 'name', ascending : true }
        ]
    });

    // Create EventStore
    const eventStore = new EventStore({
        modelClass : Task
    });

    // Apply EventStore to CrudManager
    ObjectHelper.merge(schedulerConfig, {
        crudManager : {
            eventStore
        }
    });

    // App
    export default {
        name: 'app',

        // Local components
        components: {
            DemoHeader,
            Scheduler,
            Grid
        }, // eo components

        // Function that returns data
        data() {
            // console.log(schedulerConfig);
            return {
                schedulerConfig,
                gridConfig : {
                    // Use a chained Store to avoid its filtering to interfere with Scheduler rendering
                    store : equipmentStore.makeChained(() => true)
                }
            }
        }, // eo function data

        mounted() {
            const
                grid = this.$refs.grid.grid,
                schedule = this.$refs.scheduler.schedulerInstance,
                outerElement = grid.element;

            new Drag({
                grid,
                schedule,
                outerElement
            });

            Toast.show({
                timeout : 3500,
                html : 'Please note that this example uses the Bryntum Grid, which is licensed separately.'
            });

            schedule.equipmentStore = equipmentStore;
            schedule.onEquipmentStoreLoad = schedulerConfig.onEquipmentStoreLoad;

            schedule.equipmentStore.on('load', schedule.onEquipmentStoreLoad.bind(schedule));

            equipmentStore.load();

        } // eo mounted

    } // eo export App

</script>

<style lang="scss">
    @import './App.scss';
</style>

<!-- eof -->
