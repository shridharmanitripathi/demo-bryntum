<!--
/**
 * Application implementation
 */
 -->
<template>
    <div id="app">
        <demo-header
            title="Vue Drag from grid demo"
            link='../../../../#example-vue-javascript-drag-from-grid'
        ></demo-header>
        <div class="content-container">
            <scheduler
                ref                = "scheduler"
                :rowHeight         = "schedulerConfig.rowHeight"
                :barMargin         = "schedulerConfig.barMargin"
                :eventColor        = "schedulerConfig.eventColor"
                :startDate         = "schedulerConfig.startDate"
                :endDate           = "schedulerConfig.endDate"
                :eventStore        = "schedulerConfig.eventStore"
                :columns           = "schedulerConfig.columns"
                :viewPreset        = "schedulerConfig.viewPreset"
                :crudManager       = "schedulerConfig.crudManager"
                :timeRangesFeature = "schedulerConfig.features.timeRanges"
                :stripeFeature     = "schedulerConfig.features.stripe"
                :eventMenuFeature  = "schedulerConfig.features.eventMenu"
                :resourceImagePath = "schedulerConfig.resourceImagePath"
            ></scheduler>

            <grid
                ref = "grid"
                :config = "gridConfig"
            ></grid>
        </div>
    </div>
</template>

<script>
    // header
    import DemoHeader from './components/Header.vue';

    // scheduler and its config and grid
    import Scheduler from 'bryntum-vue-shared/src/Scheduler.vue';
    import schedulerConfig from './components/schedulerConfig.js';
    import Grid from './components/Grid.vue';
    import Task from './lib/Task.js';
    import Drag from './lib/Drag.js';
    import { Toast } from 'bryntum-scheduler';

    // we need to import it here because it comes from the package
    import 'bryntum-scheduler/scheduler.stockholm.css';

    // App
    export default {
        name: 'app',

        // local components
        components: {
            DemoHeader,
            Scheduler,
            Grid
        },

        // function that returns data
        data() {
            return {
                schedulerConfig,
                gridConfig : {
                    ref   : 'grid',
                    store : {
                        modelClass : Task,
                        readUrl    : 'data/unplanned.json',
                        autoLoad   : true
                    }
                }
            }
        }, // eo function data

        mounted() {

            const scheduler = this.$refs.scheduler.schedulerInstance;

            scheduler.eventStore.on({
                update  : this.onEventStoreUpdate,
                add     : this.onEventStoreAdd,
                thisObj : scheduler
            });

            new Drag({
                grid : this.$refs.grid.grid,
                schedule : this.$refs.scheduler.schedulerInstance,
                constrain : false,
                outerElement : this.$refs.grid.grid.element
            });

            Toast.show({
                timeout : 3500,
                html : 'Please note that this example uses the Bryntum Grid, which is licensed separately.'
            });

        }, // eo function mounted

        methods : {
            // specific to this example - reschedules the tasks
            onEventStoreUpdate({ record }) {
                const scheduler = this.$refs.scheduler.schedulerInstance;
                if (scheduler.autoRescheduleTasks)  {
                    scheduler.eventStore.rescheduleOverlappingTasks(record);
                }
            }, // eo function onEventStoreUpdate

            // specific to this example - reschedules the tasks
            onEventStoreAdd({ records }) {
                const scheduler = this.$refs.scheduler.schedulerInstance;
                if (scheduler.autoRescheduleTasks)  {
                    records.forEach((eventRecord) => scheduler.eventStore.rescheduleOverlappingTasks(eventRecord));
                }
            } // eo function onEventStoreAdd
        } // eo methods

    } // eo export App

</script>

<style lang="scss">
    @import './App.scss';
</style>

<!-- eof -->
