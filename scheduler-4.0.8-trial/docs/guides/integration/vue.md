<h1 class="title-with-image"><img src="resources/images/vue.png" alt="Bryntum Scheduler supports Vue"/>Using Bryntum Scheduler with Vue</h1>
The Scheduler itself is framework agnostic but it ships with demos and wrappers to simplify using it with popular frameworks
such as Vue. The purpose of this guide is to give you the basic introduction on how to use Scheduler with Vue. For more information on Vue, please visit <a href="https://vuejs.org" target="_blank">vuejs.org</a>.

There are several integration demos for Vue that ship with Bryntum Scheduler. These demos have been created using <a href="https://cli.vuejs.org" _target="_blank">Vue CLI</a> by running:

```bash
vue create -n example name
# or
vue ui

```

If you did not use Vue CLI to create your project, please see *Custom Configurations* section of this guide.

The examples, located in `examples/vue/javascript` folder, can be run either locally in the development mode or they can be built for production. The demos are ready for direct viewing (in production mode) here: <a href="../examples/#Integration/Vue" target="_blank">Vue Integration Examples</a>.

If you want to run an example locally in the development mode go to its directory and run:

    npm install
    npm run serve

and then navigate to <a href="http://localhost:8080" target="_blank">http://localhost:8080</a>. If you modify the example code while running it locally it is automatically re-built and updated in the browser allowing you to see your changes immediately.

You can also build the examples, or your own application, for production by running:

    npm install
    npm run build

The built production version is then located in `dist` directory that can be deployed to your production server.

The demos use our Vue wrapper, which is a Vue component that uses Scheduler as an internal engine. The wrapper is at this point a basic implementation, but feel free to extend it to cover your needs.


## Include the Vue wrapper
The wrapper consists of a single file `Scheduler.vue`, found under `examples/vue/javascript/_shared`. To use it you can either copy it to your project or you can use it directly from its folder. If you decide to use it from `_shared` folder then run (the first line installs the Scheduler itself):

```bash
npm install --save ../scheduler-2.x.x/build
npm install --save ../_shared
```


in your project directory. Please note that you need to replace the paths above with the actual paths where you unzipped the scheduler distribution. Also, use \ (backslash) as the path separator on Windows.

The installation results in the following lines in dependencies entry in `package.json` of your project:

```json
  "dependencies": {
    "bryntum-scheduler": "file:../scheduler-2.x.x/build",
    "bryntum-vue-shared": "file:../_shared",
    ... other entries
```

Then you can use the wrapper similarly to other Vue components. The following is the example of a very simple Vue application with Bryntum Scheduler:

```html
<template>
    <scheduler
        ref                   = "scheduler"
        :columns              = "schedulerConfig.columns"
        :resources            = "schedulerConfig.resources"
        :events               = "schedulerConfig.events"
        :minHeight            = "schedulerConfig.minHeight"
        :startDate            = "schedulerConfig.startDate"
        :endDate              = "schedulerConfig.endDate"
        :viewPreset           = "schedulerConfig.viewPreset"
        @eventselectionchange = "onEventSelectionChange"
    />
</template>
<script>
    // scheduler and its config
    import Scheduler from 'bryntum-vue-shared/src/Scheduler.vue';
    import schedulerConfig from './components/schedulerConfig.js';

    // see "Theming" chapter of the guide
    import 'bryntum-scheduler/scheduler.stockholm.css';

    // App
    export default {
        name: 'app',

        // local components
        components: {
            Scheduler
        },

        // function that returns data
        data() {
            return {
                schedulerConfig
            }
        } // eo function data

        methods : {
            onEventSelectionChange : function (event) {
            // Code to take action when an event is selected goes here
        }

    } // eo export App

</script>

<style lang="scss">
    @import './App.scss';
</style>

```
As shown above you can assign values and bind to Vue data (`:resources="schedulerConfig.resources"`, or
use `v-bind`) or listen to events (`@eventselectionchange="onEventSelectionChange"`, or use `v-on`).

`schedulerConfig` is configuration object for the Scheduler itself. We recommend to keep it in a separate file because it can become lengthy especially for more advanced scheduler configurations.

The content of `schedulerConfig.js` file could look like this:
```javascript
export default {
    startDate : '2019-06-28 08:00:00',

    viewPreset : {
      base              : 'weekAndDay',
      displayDateFormat : 'll',
      columnLinesFor    : 0
    },

    columns : [/*...*/]

    // other config options
}
```
For proper appearance and functionality of the Scheduler you also need to import its css file. Scheduler ships with several themes you can choose from. The above example uses the default theme "Stockholm".

## Theming

For the scheduler styling you must also import a CSS file that contains your preferred theme. In our examples we import CSS in the `src/App.vue` file as follows:
```javascript
import 'bryntum-scheduler/scheduler.stockholm.css';
```

To switch themes dynamically, instead of importing the CSS file, you need to add a link element to the `public/index.html` file:
```javascript
<link rel="stylesheet" href="<%= BASE_URL %>/scheduler.stockholm.css" id="bryntum-theme">
```
Copy fonts and themes from the `build` folder to the `public` folder of your app and make sure `href` points to the default theme.
To switch the theme at runtime in your application, import `DomHelper` from our bundle and call [setTheme](#Core/helper/DomHelper#function-setTheme-static) with the name of the new theme.
```javascript
import { DomHelper } from 'bryntum-scheduler';
DomHelper.setTheme('classic-dark');
```

## Supported options
The Vue component currently supports the following configs directly:

* [allowOverlap](#Scheduler/view/SchedulerBase#config-allowOverlap)
* [animateRemovingRows](#Grid/view/GridBase#config-animateRemovingRows)
* [assignments](#Scheduler/view/mixin/SchedulerStores#config-assignments)
* [assignmentStore](#Scheduler/view/mixin/SchedulerStores#config-assignmentStore)
* [autoAdjustTimeAxis](#Scheduler/view/TimelineBase#config-autoAdjustTimeAxis)
* [autoHeight](#Grid/view/Grid#config-autoHeight)
* [barMargin](#Scheduler/view/mixin/TimelineEventRendering#config-barMargin)
* [columnLines](#Grid/view/GridBase#config-columnLines)
* [columns](#Grid/view/Grid#config-columns)
* [contextMenuTriggerEvent](#Grid/view/GridBase#config-contextMenuTriggerEvent)
* [createEventOnDblClick](#Scheduler/view/TimelineBase#config-createEventOnDblClick)
* [crudManager](#Scheduler/crud/mixin/CrudManagerView#config-crudManager)
* [defaultResourceImageName](#Scheduler/view/mixin/SchedulerEventRendering#config-defaultResourceImageName)
* [dependencyStore](#Scheduler/data/DependencyStore)
* [disableGridRowModelWarning](#Grid/view/GridBase#config-disableGridRowModelWarning)
* [displayDateFormat](#Scheduler/preset/ViewPreset#field-displayDateFormat)
* [emptyText](#Grid/view/Grid#config-emptyText)
* [enableDeleteKey](#Scheduler/view/mixin/EventNavigation#config-enableDeleteKey)
* [enableEventAnimations](#Scheduler/view/TimelineBase#config-enableEventAnimations)
* [enableTextSelection](#Grid/view/GridBase#config-enableTextSelection)
* [endDate](#Scheduler/view/TimelineBase#config-endDate)
* [endParamName](#Scheduler/view/mixin/SchedulerStores#config-endParamName)
* [eventBarTextField](#Scheduler/view/mixin/SchedulerEventRendering#config-eventBarTextField)
* [eventBodyTemplate](#Scheduler/view/mixin/SchedulerEventRendering#config-eventBodyTemplate)
* [eventColor](#Scheduler/view/mixin/TimelineEventRendering#config-eventColor)
* [eventLayout](#Scheduler/view/mixin/SchedulerEventRendering#config-eventLayout)
* [eventRenderer](#Scheduler/view/mixin/SchedulerEventRendering#config-eventRenderer)
* [events](#Scheduler/view/mixin/SchedulerStores#config-events)
* [eventSelectionDisabled](#Scheduler/view/mixin/EventSelection#config-eventSelectionDisabled)
* [eventStore](#Scheduler/view/mixin/SchedulerStores#config-eventStore)
* [eventStyle](#Scheduler/view/mixin/TimelineEventRendering#config-eventStyle)
* [fillLastColumn](#Grid/view/GridBase#config-fillLastColumn)
* [fullRowRefresh](#Grid/view/GridBase#config-fullRowRefresh)
* [fillTicks](#Scheduler/view/mixin/SchedulerEventRendering#config-fillTicks)
* [hasVisibleEvents](#Scheduler/view/TimelineBase#property-hasVisibleEvents)
* [height](#Core/widget/Widget#config-height)
* [hideHeaders](#Grid/view/GridBase#config-hideHeaders)
* [horizontalEventSorterFn](#Scheduler/view/mixin/SchedulerEventRendering#config-horizontalEventSorterFn)
* [loadMask](#Grid/view/GridBase#config-loadMask)
* [longPressTime](#Grid/view/mixin/GridElementEvents#config-longPressTime)
* [maintainSelectionOnDatasetChange](#Scheduler/view/mixin/EventSelection#config-maintainSelectionOnDatasetChange)
* [managedEventSizing](#Scheduler/view/mixin/TimelineEventRendering#config-managedEventSizing)
* [maxHeight](#Core/widget/Widget#property-maxHeight)
* [maxWidth](#Core/widget/Widget#property-maxWidth)
* [maxZoomLevel](#Scheduler/view/mixin/TimelineZoomable#property-maxZoomLevel)
* [milestoneAlign](#Scheduler/view/Scheduler#property-milestoneAlign)
* [milestoneCharWidth](#Scheduler/view/SchedulerBase#config-milestoneCharWidth)
* [milestoneLayoutMode](#Scheduler/view/TimelineBase#config-milestoneLayoutMode)
* [minHeight](#Core/widget/Widget#property-minHeight)
* [minWidth](#Core/widget/Widget#property-minWidth)
* [minZoomLevel](#Scheduler/view/mixin/TimelineZoomable#property-minZoomLevel)
* [mode](#Scheduler/view/Scheduler#property-mode)
* [multiEventSelect](#Scheduler/view/mixin/EventSelection#config-multiEventSelect)
* [partner](#Scheduler/view/TimelineBase#config-partner)
* [passStartEndParameters](#Scheduler/view/mixin/SchedulerStores#config-passStartEndParameters)
* [readOnly](#Grid/view/Grid#config-readOnly)
* [removeUnassignedEvent](#Scheduler/view/mixin/SchedulerStores#config-removeUnassignedEvent)
* [resizeToFitIncludesHeader](#Grid/view/GridBase#config-resizeToFitIncludesHeader)
* [resourceColumns](#Scheduler/view/mixin/SchedulerEventRendering#config-resourceColumns)
* [resourceImagePath](#Scheduler/view/mixin/SchedulerEventRendering#config-resourceImagePath)
* [resourceMargin](#Scheduler/view/mixin/SchedulerEventRendering#config-resourceMargin)
* [resources](#Scheduler/view/mixin/SchedulerStores#config-resources)
* [resourceStore](#Scheduler/view/mixin/SchedulerStores#config-resourceStore)
* [resourceTimeRanges](#Scheduler/feature/ResourceTimeRanges)
* [responsiveLevels](#Grid/view/mixin/GridResponsive#config-responsiveLevels)
* [rowHeight](#Grid/view/Grid#config-rowHeight)
* [scrollLeft](#Scheduler/view/mixin/TimelineScroll#property-scrollLeft)
* [scrollTop](#Scheduler/view/mixin/TimelineScroll#property-scrollTop)
* [selectedEvents](#Scheduler/view/mixin/EventSelection#property-selectedEvents)
* [selectionMode](#Grid/view/mixin/GridSelection#config-selectionMode)
* [showDirty](#Grid/view/GridBase#config-showDirty)
* [showRemoveRowInContextMenu](#Grid/view/GridBase#config-showRemoveRowInContextMenu)
* [snap](#Scheduler/view/TimelineBase#config-snap)
* [snapRelativeToEventStartDate](#Scheduler/view/TimelineBase#config-snapRelativeToEventStartDate)
* [startDate](#Scheduler/view/TimelineBase#config-startDate)
* [startParamName](#Scheduler/view/mixin/SchedulerStores#config-startParamName)
* [subGridConfigs](#Grid/view/GridBase#config-subGridConfigs)
* [tickSize](#Scheduler/view/mixin/TimelineEventRendering#property-tickSize)
* [timeRanges](#Scheduler/data/CrudManager#property-timeRangesStore)
* [timeResolution](#Scheduler/preset/ViewPreset#field-timeResolution)
* [triggerSelectionChangeOnRemove](#Scheduler/view/mixin/EventSelection#config-triggerSelectionChangeOnRemove)
* [useInitialAnimation](#Scheduler/view/mixin/SchedulerEventRendering#config-useInitialAnimation)
* [viewportCenterDate](#Scheduler/view/mixin/TimelineDateMapper#property-viewportCenterDate)
* [viewPreset](#Scheduler/view/mixin/TimelineViewPresets#config-viewPreset)
* [weekStartDay](#Scheduler/view/TimelineBase#config-weekStartDay)
* [width](#Core/widget/Widget#property-width)
* [workingTime](#Scheduler/view/TimelineBase#config-workingTime)
* [zoomLevel](#Scheduler/view/mixin/TimelineZoomable#property-zoomLevel)
* [zoomOnMouseWheel](#Scheduler/view/mixin/TimelineZoomable#config-zoomOnMouseWheel)
* [zoomOnTimeAxisDoubleClick](#Scheduler/view/mixin/TimelineZoomable#config-zoomOnTimeAxisDoubleClick)


Any other config you want to use can be specified in a `config` prop:

```html
 <scheduler
     :config="{ showRemoveRowInContextMenu: false }"
 >
 </scheduler>
```

It also supports configuring the following features, all suffixed with `Feature` to avoid naming collisions with props:

* [cellEditFeature](#Grid/feature/CellEdit)
* [cellTooltipFeature](#Grid/feature/CellTooltip)
* [columnDragToolbarFeature](#Grid/feature/ColumnDragToolbar)
* [columnLinesFeature](#Scheduler/feature/ColumnLines)
* [columnPickerFeature](#Grid/feature/ColumnPicker)
* [columnReorderFeature](#Grid/feature/ColumnReorder)
* [columnResizeFeature](#Grid/feature/ColumnResize)
* [contextMenuFeature](#Grid/feature/ContextMenu)
* [dependenciesFeature](#Scheduler/feature/Dependencies)
* [dependencyEditFeature](#Scheduler/feature/DependencyEdit)
* [eventMenuFeature](#Scheduler/feature/EventMenu)
* [eventDragFeature](#Scheduler/feature/EventDrag)
* [eventDragCreateFeature](#Scheduler/feature/EventDragCreate)
* [eventDragSelectFeature](#Scheduler/feature/EventDragSelect)
* [eventEditFeature](#Scheduler/feature/EventEdit)
* [eventFilterFeature](#Scheduler/feature/EventFilter)
* [eventResizeFeature](#Scheduler/feature/EventResize)
* [eventTooltipFeature](#Scheduler/feature/EventTooltip)
* [filterBarFeature](#Grid/feature/FilterBar)
* [filterFeature](#Grid/feature/Filter)
* [groupFeature](#Grid/feature/Group)
* [groupSummaryFeature](#Grid/feature/GroupSummary)
* [headerContextMenuFeature](#Scheduler/feature/HeaderContextMenu)
* [headerZoomFeature](#Scheduler/feature/HeaderZoom)
* [labelsFeature](#Scheduler/feature/Labels)
* [nonWorkingTimeFeature](#Scheduler/feature/NonWorkingTime)
* [panFeature](#Scheduler/feature/Pan)
* [quickFindFeature](#Grid/feature/QuickFind)
* [regionResizeFeature](#Grid/feature/RegionResize)
* [resourceTimeRangesFeature](#Scheduler/feature/ResourceTimeRanges)
* [rowReorderFeature](#Grid/feature/RowReorder)
* [scheduleMenuFeature](#Scheduler/feature/ScheduleMenu)
* [scheduleTooltipFeature](#Scheduler/feature/ScheduleTooltip)
* [searchFeature](#Grid/feature/Search)
* [simpleEventEditFeature](#Scheduler/feature/SimpleEventEdit)
* [sortFeature](#Grid/feature/Sort)
* [stripeFeature](#Grid/feature/Stripe)
* [summaryFeature](#Grid/feature/Summary)
* [timeRangesFeature](#Scheduler/feature/TimeRanges)
* [treeFeature](#Grid/feature/Tree)

For example to disable creating events by dragging on empty area and define a default sorter:

```html
<scheduler
  :eventDragCreateFeature="false"
  sort="name"
/>
```

## Accessing the Scheduler engine
To access Scheduler functionality not exposed by the wrapper, you can access the Scheduler engine directly. Within the wrapper it
is available as `this.schedulerInstance`, from the outside it could look something like this:

```html
<scheduler
    ref="scheduler"
/>
```

```javascript
// From within your Vue instance, as declared above
this.$refs.scheduler.schedulerInstance.scrollEventIntoView(xxx);
```

For more information on what functions etc. are available in the engine, please view the [API docs](#Scheduler/view/Scheduler).

## Dealing with events

There are lots of features which fire events on the owning Scheduler. For example [EventDrag](#Scheduler/feature/EventDrag) feature fires [afterEventDrop](#Scheduler/feature/EventDrag#event-afterEventDrop) event on the Scheduler. To subscribe to an event, use the [`on`](#Core/mixin/Events#function-on) API method on the schedulerInstance:
```javascript
this.$refs.scheduler.schedulerInstance.on('afterEventDrop', ({ eventRecords }) => {
    console.log(eventRecords.map(event => event.resource.events))
})
```
The handler above logs events which are assigned to the same resource.

## Custom Configurations
<a href="https://cli.vuejs.org/" target="_blank">Vue CLI</a> is the default tooling for creating, developing and managing Vue applications so it has been chosen for our examples. It also provides an abstraction level between the application and Webpack and easy configurability of the project through `vue.config.js` file.

While this approach would be best in majority of cases, you can still have a custom Webpack configuration that is not managed by Vue CLI. Although it is not feasible for us to support all possible custom configurations we have some guidelines to make the Bryntum Scheduler integration easier and smoother.

If you face any issues, executing one or more of the following steps should resolve the problem.

### Copy Vue wrappers to the project tree
We use Vue wrappers from the `bryntum-vue-shared` package in our examples and it works. However, for non-CLI projects it may be necessary to copy wrappers' files (`Scheduler.vue`, `FullscreenButton.vue`, etc.) to your project tree to ensure that they are transpiled together with other project files.

The wrappers are located in `examples/vue/javascript/_shared/src` folder. Copy the files from there to your project.

### Use UMD version of Bryntum Scheduler build
In some case it may be needed to use this version for the custom build process to succeed. For that, uncomment the line with `umd` version and comment the other one in all Vue wrappers you use (`Scheduler.vue`, `FullscreenButton.vue`, etc.)
```
    // import { Scheduler } from 'bryntum-scheduler';
    import { Scheduler } from 'bryntum-scheduler/scheduler.umd';
```

### Add or edit `.eslintignore` file
It may also be necessary to ignore linter for some files. If you do not have `.eslintignore` in your project root create it (edit it otherwise) so that it has at least the following content:
```
Scheduler.vue
FullscreenButton.vue
scheduler.module.js
scheduler.umd.js
```

## Troubleshooting

### Building

In case you face any issues with building or running our examples please try running the following commands in the example or the project directory:
```bash
rm -rf package-lock.json node_modules
npm install
npm run build
```

If you use Vue CLI, you can also try adding the following to your `vue.config.js`:
```
module.exports = {
...
    transpileDependencies: [
        'bryntum-scheduler'
    ],
...
    chainWebpack: (config) => {
        config.resolve.symlinks(false);
    }
};
```

### Internet Explorer

If you need IE 11 compatibility and you experience problems the following should help:

`main.js:`
```
// core-js polyfills are required for IE11 compatibility. If you don't use IE then delete them
import "core-js/stable";
```

`package.json:` (in dependencies section)
```
"core-js": "~3.3.6",
```

## Further reading
* For more information on config options, features, events and methods consult please the <a href="#api">API docs</a>
* For more information on Vue see the <a href="https://vuejs.org/" target="_blank">Vue.js site</a>
* If you have any questions related to the integration or Scheduler itself you can always ask on <a href="https://www.bryntum.com/forum/">our forum</a>

