<!--
/**
 * Application file
 */
-->
<template>
    <v-app>
        <demo-header
            title="Vue Custom Event Editor demo"
            link='../../../../#example-vue-javascript-custom-event-editor'
        >
        </demo-header>

        <scheduler
            ref                = "scheduler"
            :columns           = "schedulerConfig.columns"
            :resources         = "schedulerConfig.resources"
            :events            = "schedulerConfig.events"
            :minHeight         = "schedulerConfig.minHeight"
            :startDate         = "schedulerConfig.startDate"
            :endDate           = "schedulerConfig.endDate"
            :viewPreset        = "schedulerConfig.viewPreset"
            :rowHeight         = "schedulerConfig.rowHeight"
            :barMargin         = "schedulerConfig.barMargin"
            :multiEventSelect  = "schedulerConfig.multiEventSelect"
            :resourceImagePath = "schedulerConfig.resourceImagePath"
            :listeners         = "listeners"
        ></scheduler>

        <event-editor
            v-model      = "showEditor"
            :eventRecord = "eventRecord"
            :eventStore  = "eventStore"
            :resourceId  = "resourceId"
            @close       = "onCloseEditor"
        ></event-editor>
    </v-app>
</template>

<script>
    // header
    import DemoHeader from './components/Header.vue';

    // event editor
    import EventEditor from './components/EventEditor.vue';

    // scheduler and its config
    import Scheduler from 'bryntum-vue-shared/src/Scheduler.vue';
    import schedulerConfig from './components/schedulerConfig.js';

    // we need to import it here because it comes from the package
    import 'bryntum-scheduler/scheduler.stockholm.css';

    // App
    export default {
        name : 'app',

        // local components
        components : {
            DemoHeader,
            Scheduler,
            EventEditor
        },

        // function that returns data
        data() {
            return {
                schedulerConfig,
                showEditor  : false,
                eventRecord : null,
                eventStore  : null,
                resourceId  : null,
                listeners   : {
                    beforeEventEdit : this.beforeEventEditHandler
                }
            }
        }, // eo function data

        methods : {
            beforeEventEditHandler(event) {
                this.openEditor(event);
                return false;
            },

            openEditor({source, resourceRecord, eventRecord}) {
                Object.assign(this, {
                    eventStore  : source.eventStore,
                    resourceId  : resourceRecord.id,
                    eventRecord : eventRecord,
                    showEditor  : true
                });
            },

            onCloseEditor() {
                const engine = this.$refs.scheduler.schedulerInstance;
                if(engine) {
                    engine.refresh();
                }
            }
        } // eo methods
    } // eo export App

</script>

<style lang="scss">
  @import './App.scss';
</style>

<!-- eof -->
