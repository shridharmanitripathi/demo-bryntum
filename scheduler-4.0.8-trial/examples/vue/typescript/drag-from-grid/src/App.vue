<template>
    <div id="app">
        <app-header
            @click="onToggleClick"
        />

        <div class="horizontal">
            <schedule
                ref="schedule"
                :auto-reschedule-tasks="autoReschedule"
            />

            <unplanned-grid
                ref="unplannedGrid"
                :event-store="eventStore"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import AppHeader from "@/components/AppHeader.vue";
    import Schedule from "@/components/Schedule.vue";
    import UnplannedGrid from "@/components/UnplannedGrid.vue";
    import Drag from "@/lib/Drag";
    import { EventStore } from "bryntum-scheduler";
    import "bryntum-scheduler/scheduler.stockholm.css";

    @Component({
        components : {
            AppHeader,
            UnplannedGrid,
            Schedule
        },
    })
    export default class App extends Vue {
        public eventStore: EventStore | null = null;
        public autoReschedule: boolean = false;
        public drag!: Drag;

        public $refs!: {
            unplannedGrid: UnplannedGrid,
            schedule: Schedule
        };

        public onToggleClick(button: HTMLButtonElement) {
            this.autoReschedule = button.classList.contains("pressed");
        }

        public mounted() {
            const unplannedGrid = this.$refs.unplannedGrid,
                schedule = this.$refs.schedule;

            this.eventStore = schedule.engine.eventStore;

            this.drag = new Drag({
                grid         : unplannedGrid.engine,
                schedule     : schedule.engine,
                constrain    : false,
                outerElement : unplannedGrid.engine && unplannedGrid.engine.element
            });

        }
    }
</script>

<style>
    @font-face {
        font-family : "Source Sans Pro";
        src         : url("assets/SourceSansPro-Regular.ttf.woff2") format("woff2"), url("assets/SourceSansPro-Regular.ttf.woff") format("woff");
        font-weight : 400;
    }

    html, body, #app {
        height : 100%;
    }

    body {
        visibility  : unset;
        font-family : "Source Sans Pro", "Helvetica Neue", Helvetica, sans-serif;
        font-size   : 15px;
        margin      : 0;
    }

    #app {
        display        : flex;
        flex-direction : column;
    }

    .horizontal {
        display        : flex;
        flex-direction : row;
        flex           : 1;
    }

    .scheduler-container {
        flex     : 1;
        overflow : hidden;
    }

    .grid-container {
        width       : 300px;
        border-left : 2px solid #aaa;
    }

    .info {
        flex-direction : column;
    }

    .desc {
        font-size   : .8em;
        font-weight : 300;
    }

    .b-grid-header {
        height : 57px;
    }

    .b-sch-event.b-drag-invalid {
        background : red;
    }

    .b-unassigned-class.b-drag-proxy:not(.b-drag-invalid) {
        background : green;
    }

    .b-aborting.b-unassigned-class {
        transition     : transform 0.3s !important;

        background     : red;
        position       : absolute !important;
        z-index        : 10000;
        pointer-events : none;
        opacity        : 0.8;
        box-sizing     : border-box;
    }
</style>
