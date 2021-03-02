<!--
/**
 * Modified vue-cli/src/components/Scheduler.vue
 */
-->
<template>
    <div class="b-scheduler-container"></div>
</template>

<script>
    import Scheduler from '../lib/PartnerScheduler.js';

    // Defines a Vue component that wraps Bryntum Scheduler
    export default {

        name  : 'scheduler',

        props : {
            // Configs
            autoHeight                     : Boolean,
            barMargin                      : {
                default : 2,
                type    : Number
            },
            columns                        : Array,
            emptyText                      : String,
            eventBodyTemplate              : Function,
            eventColor                     : {
                default : 'green',
                type    : String
            },
            eventLayout                    : String,
            eventRenderer                  : Function,
            eventStyle                     : {
                default : 'plain',
                type    : String
            },
            endDate                        : Date,
            fillTicks                      : Boolean,
            forceFit                       : {
                default : false,
                type    : Boolean
            },
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
                default : 'hourAndDay',
                type    : [String, Object]
            },
            displayDateFormat  : String,
            height             : [ Number, String ],
            maxHeight          : [ Number, String ],
            maxWidth           : [ Number, String ],
            maxZoomLevel       : Number,
            minHeight          : [ Number, String ],
            minWidth           : [ Number, String ],
            minZoomLevel       : Number,
            resourceTimeRanges : Array,
            scrollLeft         : Number,
            scrollTop          : Number,
            selectedEvents     : Array,
            snap               : Boolean,
            tickWidth          : Number,
            timeResolution     : Object,
            viewportCenterDate : Date,
            width              : [ Number, String ],
            zoomLevel          : Number,

            // Stores
            assignmentStore : Object,
            dependencyStore : Object,
            eventStore      : Object,
            resourceStore   : Object,

            resourceImagePath : String,

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
            cellMenuFeature           : [Boolean, Object],
            cellTooltipFeature        : [Boolean, Object],
            columnDragToolbarFeature  : [Boolean, Object],
            columnLinesFeature        : { type : Boolean, default : true },
            columnPickerFeature       : [Boolean, Object],
            columnReorderFeature      : [Boolean, Object],
            columnResizeFeature       : [Boolean, Object],
            dependenciesFeature       : [Boolean, Object],
            dependencyEditFeature     : [Boolean, Object],
            eventDragCreateFeature    : { type : [Boolean, Object], default : true },
            eventDragFeature          : { type : [Boolean, Object], default : true },
            eventEditFeature          : { type : [Boolean, Object], default : true },
            eventFilterFeature        : { type : [Boolean, Object], default : true },
            eventMenuFeature          : { type : [Boolean, Object], default : true },
            eventResizeFeature        : { type : [Boolean, Object], default : true },
            eventTooltipFeature       : { type : [Boolean, Object], default : true },
            filterBarFeature          : [Boolean, Object],
            filterFeature             : [Boolean, Object],
            groupFeature              : [Boolean, Object, String],
            groupSummaryFeature       : [Boolean, Object],
            headerMenuFeature         : [Boolean, Object],
            labelsFeature             : [Boolean, Object],
            listeners                 : Object,
            nonWorkingTimeFeature     : [Boolean, Object],
            panFeature                : [Boolean, Object],
            partner                   : [Object, String],
            quickFindFeature          : [Boolean, Object],
            regionResizeFeature       : Boolean,
            resourceTimeRangesFeature : [Boolean, Object],
            rowReorderFeature         : Boolean,
            scheduleMenuFeature       : [Boolean, Object],
            scheduleTooltipFeature    : { type : [Boolean, Object], default : true },
            searchFeature             : [Boolean, Object],
            sortFeature               : [Boolean, Object, String, Array],
            stripeFeature             : Boolean,
            summaryFeature            : [Boolean, Object],
            timeAxisHeaderMenuFeature : { type : [Boolean, Object], default : true },
            timeRangesFeature         : { type : [Boolean, Object], default : true },
            treeFeature               : [Boolean, Object],
            flex                      : String
        }, // eo props

        // runs after the component is attached to DOM (mounted)
        mounted() {
            const propKeys = Object.keys(this.$props);

            const config = {
                // Render grid to components element
                appendTo : this.$el,

                // Listeners, will relay events using $emit
                listeners : {
                    catchAll(event) {
                        // Uncomment this line to log events being emitted to console
                        //console.log(event.type);
                        this.$emit(event.type, event);
                    },

                    thisObj : this
                },

                features : {}
            };

            // Apply all props to grid config
            propKeys.forEach(prop => {
                let match;
                if ((match = prop.match(/(.*)Feature/))) {
                    // Prop which ends with Feature is a feature config
                    config.features[match[1]] = this[prop];
                }
                else if (prop === 'config') {
                    // Prop is a config object
                    Object.assign(config, this[prop]);
                }
                else {
                    // Prop is a config
                    if (this[prop] !== undefined) config[prop] = this[prop];

                    // Set up a watcher
                    this.$watch(prop, newValue => {
                        this.schedulerInstance[prop] = Array.isArray(newValue) ? newValue.slice() : newValue;
                    });
                }
            }, this);

            // console.log('config=', config, 'props=', this.$props);

            // Create a Bryntum Grid with props as configs
            const engine = this.schedulerInstance = new Scheduler(config);

            engine.eventStore && engine.eventStore.relayAll(engine, 'events');
            engine.resourceStore && engine.resourceStore.relayAll(engine, 'resources');
            engine.assignmentStore && engine.assignmentStore.relayAll(engine, 'assignments');
            engine.dependencyStore && engine.dependencyStore.relayAll(engine, 'dependencies');

        }, // eo function mounted

        // cleanup before destroy
        beforeDestroy() {
            // Make sure Bryntum Grid is destroyed when vue component is
            this.schedulerInstance.destroy();
        } // eo function beforeDestroy

    }; // eo scheduler export

</script>

<!-- eof -->
