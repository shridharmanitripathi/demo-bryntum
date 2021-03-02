<!--
/**
 * Application implementation
 */
 -->
<template>
    <div id="app">
        <demo-header
            title="Vue Animations demo"
            link='../../../../#example-vue-javascript-animations'
        >
        <div> And here is the demo header content</div>
        </demo-header>

        <scheduler
            ref                  = "scheduler"
            :eventColor          = "schedulerConfig.eventColor"
            :columns             = "schedulerConfig.columns"
            :minHeight           = "schedulerConfig.minHeight"
            :startDate           = "schedulerConfig.startDate"
            :endDate             = "schedulerConfig.endDate"
            :viewPreset          = "schedulerConfig.viewPreset"
            :rowHeight           = "schedulerConfig.rowHeight"
            :barMargin           = "schedulerConfig.barMargin"
            :crudManager         = "schedulerConfig.crudManager"
            :useInitialAnimation = "schedulerConfig.useInitialAnimation"
            :timeRangesFeature   = "schedulerConfig.timeRangesFeature"
            :resourceImagePath   = "schedulerConfig.resourceImagePath"
        ></scheduler>
    </div>
</template>

<script>
    // header
    import DemoHeader from './components/Header.vue';

    // scheduler and its config
    import Scheduler from 'bryntum-vue-shared/src/Scheduler.vue';
    import { DateHelper } from 'bryntum-scheduler';
    import schedulerConfig from './components/schedulerConfig.js';

    // event bus
    import { eventBus } from './main';

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
        }, // eo function data

        // runs after the instance is created - installs listeners
        created() {
            // centralized button click listeners
            eventBus.$on('click', this.dispatchClick);

            // slider change event listener
            eventBus.$on('duration', this.onDurationChange);
        }, // eo function created

        mounted() {

            // set the default animation duration
            this.onDurationChange(600);

        }, // eo function mounted

        methods : {
            // dispatch button clicks from this centralized
            // click handler to the respective action handlers
            dispatchClick(action) {
                const method = `${action}Handler`,
                      me = this
                ;
                // console.log(method);
                if(me[method]) me[method](action);
            }, // eo function dispatchClick

            // set time of all Meetings to max 1 hour
            maxHandler(action) {
                this.$refs.scheduler.schedulerInstance.eventStore.query((task) => task.eventType === 'Meeting').forEach((task) => task.duration = Math.min(task.duration, 1));
            }, // eo function maxHandler

            // moves events of type "Meeting" after lunch
            moveHandler(action) {
                const scheduler = this.$refs.scheduler.schedulerInstance,
                      eventStore = scheduler.eventStore
                ;
                if(scheduler.features) {
                    const lunchFinishTime = scheduler.features.timeRanges.store.getById('lunch').endDate
                    eventStore.query((task) => task.eventType === 'Meeting').forEach((task) => task.startDate = DateHelper.max(task.startDate, lunchFinishTime));
                }

            }, // eo function moveHandler

            // randomizes the events
            randomHandler(action) {
                const scheduler = this.$refs.scheduler.schedulerInstance,
                      eventStore = scheduler.eventStore,
                      indices = [],
                      nbrToAnimate = Math.min(eventStore.count, 4)
                ;

                // Grab a bunch of random events to change
                while (indices.length < nbrToAnimate) {
                    const index = Math.floor(Math.random() * eventStore.count);

                    if (!indices.includes(index)) {
                        indices.push(index);
                    }
                }
                indices.forEach((index) => {
                    const ev = eventStore.getAt(index);

                    if (ev) {
                        ev.beginBatch();
                        ev.resourceId = (scheduler.resourceStore.indexOf(ev.resource) + 2) % 8 + 1;
                        ev.setStartDate(DateHelper.add(ev.startDate, ev.startDate.getHours() % 2 ? 1 : -1, 'hour'), true);
                        ev.endBatch();
                    }
                });
            }, // eo function randomHandler

            // handle animation duration change
            onDurationChange(value) {
                const scheduler = this.$refs.scheduler.schedulerInstance;
                let styleNode = this.styleNode;

                if(!styleNode) {
                    styleNode = this.styleNode = document.createElement('style');
                    document.head.appendChild(styleNode);
                }

                scheduler.transitionDuration = value;
                styleNode.innerHTML = `.b-grid-row,.b-sch-event-wrap { transition-duration: ${value / 1000}s !important; }`;

            } // eo function onDurationChange

        }, // eo methods

        // cleanup before destroy
        beforeDestroy() {
            // remove event listeners from eventBus
            eventBus.$off['click', 'duration'];
        } // eo function beforeDestroy

    } // eo export App

</script>

<style lang="scss">
    @import './App.scss';
</style>

<!-- eof -->
