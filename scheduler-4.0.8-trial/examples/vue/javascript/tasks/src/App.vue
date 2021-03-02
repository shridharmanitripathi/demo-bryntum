<!--
 * App component
-->
<template>
    <div id="app">
        <header class="app-header">
            <h1><a id="title" href="../../../../#example-vue-javascript-tasks">Vue Tasks demo</a></h1>
        </header>

        <scheduler
            ref                       = "scheduler"
            :time-ranges-feature      = "schedulerConfig.timeRangesFeature"
            :columns                  = "schedulerConfig.columns"
            :start-date               = "schedulerConfig.startDate"
            :end-date                 = "schedulerConfig.endDate"
            :bar-margin               = "schedulerConfig.barMargin"
            :row-height               = "schedulerConfig.rowHeight"
            :event-color              = "schedulerConfig.eventColor"
            :event-style              = "schedulerConfig.eventStyle"
            :view-preset              = "schedulerConfig.viewPreset"
            :crud-manager             = "schedulerConfig.crudManager"
            :event-renderer           = "schedulerConfig.eventRenderer"
            :listeners                = "schedulerConfig.listeners"
            :cell-edit-feature        = "schedulerConfig.cellEditFeature"
            :tree-feature             = "schedulerConfig.treeFeature"
            :event-drag-feature       = "schedulerConfig.eventDragFeature"
            :event-edit-feature       = "schedulerConfig.eventEditFeature"
            :event-resize-feature     = "schedulerConfig.eventResizeFeature"
            :non-working-time-feature = "schedulerConfig.nonWorkingTimeFeature"
            :resource-image-path      = "schedulerConfig.resourceImagePath"
        ></scheduler>
    </div>
</template>

<script>
    // libraries
    import Scheduler from "bryntum-vue-shared/src/Scheduler.vue";
    import { AjaxHelper, DateHelper, DateField, ResourceModel, EventHelper } from 'bryntum-scheduler';

    // our stuff
    import schedulerConfig from './components/schedulerConfig.js';
    import colors from './components/colors.js';

    // This CSS must be imported here because it is in package
    import 'bryntum-scheduler/scheduler.stockholm.css';

    // The data for this demo (data/data.json) uses the 'clients' property to hold children of resources
    ResourceModel.childrenField = 'clients';

    // export App vue component
    export default {
        name:'app',

        // local components
        components : {
            Scheduler
        },

        // function that returns data
        data() {
            return {
                schedulerConfig
            } // eo return
        }, // eo function data()

        mounted() {
            const scheduler = this.$refs.scheduler.schedulerInstance;


            // This listener is specific to the Tasks demo and can be removed if not needed
            // Handle click on those add divs
            EventHelper.addListener({
                element  : scheduler.element,
                delegate : '.add',
                click(event) {
                    const employee = scheduler.getRecordFromElement(event.target);
                    if (employee) {
                        // Add a new client with random color
                        employee.appendChild({
                            name  : 'New client',
                            color : colors[Math.floor(Math.random() * colors.length)].toLowerCase()
                        });
                    }
                }
            });
        }

    }; // eo export App
</script>

<style lang="scss">
    @import './App.scss';

    @font-face {
        font-family: "Source Sans Pro";
        src: url("assets/SourceSansPro-Regular.ttf.woff2") format("woff2"), url("assets/SourceSansPro-Regular.ttf.woff") format("woff");
        font-weight: 400;
    }

    html, body, #app {
        height: 100%;
    }

    body {
        visibility: unset;
        font-family: "Source Sans Pro", "Helvetica Neue", Helvetica, sans-serif;
        font-size: 15px;
        margin: 0;
    }

    #app {
        display:flex;
        flex-direction : column;
    }

    .b-scheduler-container {
        flex:1;
    }

    .app-header {
        padding: 2.1em .5em 2.1em 5em;
        background: url(~bryntum-resources/images/logo_bryntum_bw.png) #2667C8;
        background-repeat: no-repeat;
        background-size: 40px;
        background-position: center left 1.5em;
        display: flex;
    }

    .app-header h1 {
        margin: 0;
        font-size: 1.8em;
        color: #fff;
        font-weight: normal;
        flex: 1;
        align-self: center;
    }

    .app-header a {
        color: inherit;
        text-decoration: none;
    }

    .app-header button {
        width: 2.8em;
        background: #8BC34A;
        border: none;
        color: #fff;
        cursor: pointer;
        font-size: 1em;
        font-family: "Source Sans Pro", "Helvetica Neue", Helvetica, sans-serif;
        border-radius: 2px;
        margin-right: .5em;
    }

    .app-header button:hover {
        background: #9CCC65;
    }

    .app-header button:active {
        background: #9CCC65;
    }

    .app-header button:disabled {
        background: #ccbdb8 !important;
        cursor: default;
    }

    .app-header button.red {
        background: #F44336;
    }

    .app-header button.red:hover {
        background: #EF5350;
    }

    .b-sch-range {
        background: repeating-linear-gradient(-55deg, #ddd, #ddd 10px, #eee 5px, #eee 20px);
        opacity: 0.5;
    }

    .info {
        flex-direction: column;
    }

</style>

<!-- eof -->
