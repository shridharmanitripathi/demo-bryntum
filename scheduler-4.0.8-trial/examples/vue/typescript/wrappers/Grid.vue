<template>
    <div class="grid-container"></div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import { Grid, Store } from "bryntum-scheduler";

    // Defines a Vue component that wraps Bryntum Grid
    @Component({
        props : {
            // Configs
            autoHeight          : Boolean,
            columns             : Array,
            data                : Array,
            emptyText           : String,
            enableTextSelection : Boolean,
            hideHeaders         : Boolean,
            id                  : String,
            readOnly            : Boolean,
            responsiveLevels    : {
                default : undefined,
                type    : Object
            },
            rowHeight           : Number,
            store               : Object,

            config : Object,

            // Features, only used for initialization
            cellEditFeature          : Boolean,
            cellMenuFeature          : [Boolean, Object],
            cellTooltipFeature       : [Boolean, Object],
            columnDragToolbarFeature : Boolean,
            columnPickerFeature      : Boolean,
            columnReorderFeature     : Boolean,
            columnResizeFeature      : Boolean,
            filterBarFeature         : [Boolean, Object],
            filterFeature            : [Boolean, Object],
            groupFeature             : [Boolean, Object, String],
            groupSummaryFeature      : Boolean,
            headerMenuFeature        : [Boolean, Object],
            quickFindFeature         : Boolean,
            regionResizeFeature      : Boolean,
            searchFeature            : Boolean,
            sortFeature              : [Boolean, Object, String, Array],
            stripeFeature            : Boolean,
            summaryFeature           : Boolean,
            treeFeature              : Boolean
        },
    })
    export default class GridComponent extends Vue {
        public name = "grid";

        public gridInstance!: Grid;

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

            // Create a Bryntum Grid with props as configs
            this.gridInstance = new Grid(config);

        }

        public beforeDestroy() {
            // Make sure Bryntum Grid is destroyed when vue component is
            this.gridInstance.destroy();
        }
    }
</script>
