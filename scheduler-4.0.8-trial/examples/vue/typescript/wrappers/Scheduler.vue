<template>
    <div class="scheduler-container"></div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import { Scheduler } from "bryntum-scheduler";

    // Defines a Vue component that wraps Bryntum Scheduler
    @Component({
        props : {
            // Configs
            autoHeight                     : Boolean,
            barMargin                      : Number,
            columns                        : Array,
            emptyText                      : String,
            eventBodyTemplate              : Function,
            eventColor                     : String,
            eventLayout                    : String,
            eventRenderer                  : Function,
            eventStyle                     : String,
            endDate                        : Date,
            fillTicks                      : Boolean,
            forceFit                       : Boolean,
            hideHeaders                    : Boolean,
            id                             : String,
            milestoneCharWidth             : Number,
            milestoneLayoutMode            : String,
            multiEventSelect               : Boolean,
            readOnly                       : Boolean,
            responsiveLevels               : {
                default : undefined,
                type    : Object
            },
            rowHeight                      : Number,
            startDate                      : Date,
            viewPreset                     : {
                default : "hourAndDay",
                type    : [ String, Object ]
            },

            // Stores
            assignmentStore : Object,
            dependencyStore : Object,
            eventStore      : Object,
            resourceStore   : Object,
            equipmentStore  : Object,

            crudManager : Object,

            // Data
            assignments  : Array,
            dependencies : Array,
            events       : Array,
            resources    : Array,
            timeRanges   : Array,

            config : Object,

            // Features, only used for initialization
            cellEditFeature           : { type : [Boolean, Object], default : true },
            cellMenuFeature           : { type : [Boolean, Object], default : true },
            columnLinesFeature        : { type : Boolean, default : true },
            dependenciesFeature       : [Boolean, Object],
            eventMenuFeature          : { type : [Boolean, Object], default : true },
            eventDragCreateFeature    : { type : [Boolean, Object], default : true },
            eventDragFeature          : { type : [Boolean, Object], default : true },
            eventEditFeature          : { type : [Boolean, Object], default : true },
            eventFilterFeature        : { type : [Boolean, Object], default : true },
            eventResizeFeature        : { type : [Boolean, Object], default : true },
            eventTooltipFeature       : { type : [Boolean, Object], default : true },
            groupFeature              : [Boolean, Object, String],
            groupSummaryFeature       : [Boolean, Object],
            timeAxisHeaderMenuFeature : { type : [Boolean, Object], default : true },
            labelsFeature             : [Boolean, Object],
            nonWorkingTimeFeature     : [Boolean, Object],
            regionResizeFeature       : Boolean,
            scheduleTooltipFeature    : { type : [Boolean, Object], default : true },
            sortFeature               : [Boolean, Object, String, Array],
            stripeFeature             : Boolean,
            summaryToolbarFeature     : [Boolean, Object],
            timeRangesFeature         : { type : [Boolean, Object], default : true }
        }
    })
    export default class SchedulerComponent extends Vue {
        public name = "scheduler";

        public schedulerInstance!: Scheduler;

        public mounted() {
            const propKeys = Object.keys(this.$props);
            const featureConfig: Record<string, any> = {};

            const config: Record<string, any> = {
                // Render grid to components element
                appendTo : this.$el,

                // Listeners, will relay events using $emit
                listeners : {
                    catchAll(event: any) {
                        // Uncomment this line to log events being emitted to console
                        this.$emit(event.type, event);
                    },

                    thisObj : this
                },

                features : featureConfig
            };

            // Apply all props to grid config
            propKeys.forEach((prop: any) => {
                if (prop.indexOf("Feature") > -1) {
                    const featureName = prop.substr(0, prop.length - "Feature".length);
                    // Prop is a feature config
                    featureConfig[featureName] = this.$props[prop];
                } else if (prop === "config") {
                    // Prop is a config object
                    Object.assign(config, this.$props[prop]);
                } else {
                    // Prop is a config
                    if (this.$props[prop] !== undefined) config[prop] = this.$props[prop];

                    // Set up a watcher
                    this.$watch(prop, (newValue: any) => {
                        // @ts-ignore
                        this.schedulerInstance[prop] = Array.isArray(newValue) ? newValue.slice() : newValue;
                    });
                }
            }, this);

            // Create a Bryntum Scheduler with props as configs
            this.schedulerInstance = new Scheduler(config);
        }

        public beforeDestroy() {
            // Make sure Bryntum Grid is destroyed when vue component is
            this.schedulerInstance.destroy();
        }

        // methods : {
        public removeEvent() {
            const scheduler = this.schedulerInstance;
            scheduler.eventStore.remove(scheduler.selectedEvents);
        }

        public addEvent() {
            const scheduler = this.schedulerInstance,
                startDate = new Date(scheduler.startDate.getTime()),
                endDate = new Date(startDate.getTime());

            endDate.setHours(endDate.getHours() + 1);

            scheduler.eventStore.add({
                resourceId : scheduler.resourceStore.first.id,
                name       : "New task",
                desc       : "Meeting",
                startDate,
                endDate
            });
        }
    }
</script>
