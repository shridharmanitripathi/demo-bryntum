<template>
    <div id="app">
        <demo-header
            :title="$t('title')"
            link='../../../../#example-vue-javascript-localization'
        />
        <scheduler
            ref     = "scheduler"
            :config = "schedulerConfig"
        />
    </div>
</template>

<script>
    // import HelloWorld from './components/HelloWorld.vue'
    import DemoHeader from './components/Header';
    import Scheduler from 'bryntum-vue-shared/src/Scheduler';
    import schedulerConfig from './components/schedulerConfig.js'

    // Stockholm theme
    import 'bryntum-scheduler/scheduler.stockholm.css';

    // import Bryntum locales
    import './locales/index.js';

    export default {
        name : 'app',

        // local components
        components : {
            DemoHeader,
            Scheduler
        }, // eo components

        // data
        data() {
            return {
                schedulerConfig
            }
        } // eo data
    }
</script>

<style lang="scss">
    @import './App.scss';
</style>

<!-- eof -->
