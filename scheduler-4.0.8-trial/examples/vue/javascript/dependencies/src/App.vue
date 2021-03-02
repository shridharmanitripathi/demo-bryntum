<!--
/**
 * Application implementation
 */
 -->
<template>
    <div id="app">
        <demo-header
            title="Vue Dependencies demo"
            link='../../../../#example-vue-javascript-dependencies'
        ></demo-header>

        <scheduler
            ref                  = "scheduler"
            :eventColor          = "schedulerConfig.eventColor"
            :eventStyle          = "schedulerConfig.eventStyle"
            :columns             = "schedulerConfig.columns"
            :minHeight           = "schedulerConfig.minHeight"
            :startDate           = "schedulerConfig.startDate"
            :endDate             = "schedulerConfig.endDate"
            :viewPreset          = "schedulerConfig.viewPreset"
            :rowHeight           = "schedulerConfig.rowHeight"
            :barMargin           = "schedulerConfig.barMargin"
            :crudManager         = "schedulerConfig.crudManager"
            :timeRangesFeature   = "schedulerConfig.timeRangesFeature"
            :stripeFeature       = "schedulerConfig.stripeFeature"
            :dependenciesFeature = "schedulerConfig.dependenciesFeature"
            :eventDragFeature    = "schedulerConfig.eventDragFeature"
            :eventRenderer       = "schedulerConfig.eventRenderer"
            :resourceImagePath   = "schedulerConfig.resourceImagePath"
        ></scheduler>
    </div>
</template>

<script>
    // header
    import DemoHeader from './components/Header.vue';

    // scheduler and its config
    import Scheduler from 'bryntum-vue-shared/src/Scheduler.vue';
    import schedulerConfig from './components/schedulerConfig.js';

    // we need to import it here because it comes from the package
    import 'bryntum-scheduler/scheduler.stockholm.css';

    // App
    export default {
        name: 'app',

        // local components
        components: {
            DemoHeader,
            Scheduler
        },

        // function that returns data
        data() {
            return {
                schedulerConfig
            }
        } // eo function data
    } // eo export App

</script>

<style lang="scss">
    @import './App.scss';
</style>

<!-- eof -->
