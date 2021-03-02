<h1 class="title-with-image"><img src="resources/images/angular.png" alt="Bryntum Scheduler supports Angular"/>Using Bryntum Scheduler with Angular</h1>
The Scheduler itself is framework agnostic, but it ships with demos and wrappers to simplify using it with popular frameworks such as Angular. The purpose of this guide is to give you a basic introduction on how to use Scheduler with Angular.

Several Scheduler demos use a wrapper for Scheduler that turns it into an Angular component. The wrapper is at this point a basic implementation, but feel free to extend it to cover your needs. Supported properties and how to add non-supported ones is described later in this guide.

The Scheduler includes demos for several Angular versions. Most of them need to be built before viewing, please open `examples/angular` and check the demo corresponding to your Angular version.

You can view all Angular demos in our <a href="../examples/#Integration/Angular" target="_blank">example browser</a>.

The latest examples have been created with `ng new example-name` so they can be run locally in development mode by invoking:
```
npm install
npm start
```
and then navigating to <a href="http://localhost:4200" target="_blank">http://localhost:4200</a>. If you modify the example code while running it locally it is automatically rebuilt and updated in the browser allowing you to see your changes immediately.

You can also build the production version of an example, or your application, by running:
```
npm install
npm run build
```

The built version is then located in the `dist` sub-folder which contains a compiled version that can be deployed to your production server.


## Install Scheduler npm package
Scheduler package contains all the Bryntum Scheduler code together with supporting widgets and utilities in the form of a module that can be installed with `npm` package manager. The package is located in `build` folder of the unzipped Bryntum Scheduler distribution. For example, if you unzipped to `/Users/developer/scheduler-2.3.1`, then run this code to install it:

```
npm install --save /Users/developer/scheduler-2.3.1/build

or

npm install --save c:\Users\developer\scheduler-2.3.1\build # on Windows

```

You can also use relative path to the Scheduler `build` folder.

The result is the entry for `bryntum-scheduler` in your `package.json`, for example:
```json
"dependencies": {
    "bryntum-scheduler": "file:../../../../build"
    ... other dependencies
}
```

**Note:** Do not put Scheduler sources **inside** your Angular application! Always keep them outside, otherwise TS will fail to compile your application.

## Integrating Scheduler with Angular using the wrapper
The Scheduler wrapper and wrappers for other supporting components are implemented as Angular shared library named `bryntum-angular-shared` located in `examples/angular/_shared` folder.

**_IMPORTANT:_** _You can copy the source wrapper file from the shared library sources to your project. The wrapper is in `examples/angular/_shared/projects/bryntum-angular-shared/src/lib/scheduler.component.ts`. When you prefer to copy the wrapper to your project, you can skip the rest of this section. For example `angular-5` demo uses copied wrapper, when `angular-8` demo uses wrapper as npm package._

There are several steps to execute to use this library in your project:

* Build `bryntum-angular-shared` package
* Install `bryntum-angular-shared` package
* Add `bryntum-angular-shared` to `tsconfig.json`
* Import Bryntum Angular Shared Module

Then you will be able to use the custom tag `<bry-scheduler>` the same way as you use your application components. Our latest examples are built this way so you can refer to them to see the details of its usage.

### Build `bryntum-angular-shared` package
Change to the package folder `examples/angular/_shared` and run:
```
npm install
npm run build
```

### Install `bryntum-angular-shared` package
In your project folder run
```
npm install --save ../_shared/dist/bryntum-angular-shared
```

### Add `bryntum-angular-shared` to `tsconfig.json`
`tsconfig.json` is located in the root of your project. For the Angular to find the shared library we need to add path to `compilerOptions` property. We need these paths:

```json
  "paths": {
    "bryntum-angular-shared":[
      "../_shared/dist/bryntum-angular-shared"
    ],
    "@angular/*": [
      "node_modules/@angular/*"
    ]
  }
```
Adjust the above path to `bryntum-angular-shared` according to the real locations of your project and the Scheduler distribution.

## Import Bryntum Angular Shared Module
Add the following code to your `app.module.ts`:
```javascript
import { BryntumAngularSharedModule } from 'bryntum-angular-shared'
@NgModule({
  imports: [
    BryntumAngularSharedModule
  ]
})
```

**_Note:_** _Our examples import UMD version of the Scheduler package to achieve IE 11 compatibility. If you do not need to support this browser then edit the scheduler wrapper in `examples/angular/_shared/projects/bryntum-angular-shared/src/lib/scheduler.component.ts` to import the base version of the package._

_Mind please that you cannot import both normal and UMD version of the Scheduler package in one application. The error `Bundle included twice` means that both UMD and normal version is imported. In that case revise all your imports and make sure that only one version is used._

## Using the wrapper in your application
Now you can use the wrapper as follows:

```html
<bry-scheduler
    #scheduler
    [columns]           = "schedulerConfig.columns"
    [viewPreset]        = "schedulerConfig.viewPreset"
    (onSchedulerEvents) = "onSchedulerEvents($event)"
></bry-scheduler>
```

## Theming

For the scheduler styling you must also import a CSS file that contains your preferred theme. In our examples we import CSS in the `src/styles.scss` file as follows:
```scss
@import "bryntum-scheduler/scheduler.material.css";
```

To switch themes dynamically, instead of importing the CSS file, you need to add a link element to the `src/index.html` file:
```html
<base href="./">
<link rel="stylesheet" href="assets/scheduler.stockholm.css" id="bryntum-theme">
```
Copy fonts and themes from the `build` folder to the `src/assets` folder of your app and make sure `href` points to the default theme.
To switch the theme at runtime in your application, import `DomHelper` from our bundle and call [setTheme](#Core/helper/DomHelper#function-setTheme-static) with the name of the new theme.
```javascript
import { DomHelper } from 'bryntum-scheduler';
DomHelper.setTheme('classic-dark');
```

## Supported properties

The following properties can be directly bound to `<bry-scheduler>` Angular component. They are then passed from it down to the native instance of the Scheduler (`schedulerInstance`). In the following example, the value of variable `schedulerConfig.events` will become `schedulerInstance.events`:

```html
<bry-scheduler
  [events] = "schedulerConfig.events"
></bry-scheduler>
```
The list of supported config options and properties:

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

## Supported features

Features are distinguished from config options and properties by `Feature` suffix. They are mapped to the corresponding feature of the `schedulerInstance`. In the following example, the value of variable `schedulerConfig.stripeFeature` will become `schedulerInstance.features.stripe`:

```html
<bry-scheduler
  [stripeFeature] = "schedulerConfig.stripeFeature"
></bry-scheduler>
```

The list of supported features:

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

## Adding properties which are not supported by default
Scheduler wrapper has a lot of properties which are supported by default. But sometimes you need to add those which are not supported. For example [autoAdjustTimeAxis](#Scheduler/view/TimelineBase#config-autoAdjustTimeAxis).

First you need to update the wrapper `examples/angular/_shared/projects/bryntum-angular-shared/src/lib/scheduler.component.ts`:

```javascript
private configs : string[] = [
    'autoAdjustTimeAxis',
    ...
]

@Input() autoAdjustTimeAxis: boolean;
```

Then rebuild `bryntum-angular-shared` package. For that you need to go to `examples/angular/_shared` and run:

```
npm run build
```

Now, that the wrapper has been updated and built, you can use the new config in your application. Let's say you want to add it to Basic demo (`examples/angular/basic`).

For that edit `examples/angular/basic/src/app/schedulerConfig.js` and specify value:

```javascript
export default {
    autoAdjustTimeAxis : false, // lets say you want to disable auto adjusting
    ...
};
```

Then add the config option to the template in `examples/angular/basic/src/app/app.component.html`:

```html
<bry-scheduler
    #scheduler
    [autoAdjustTimeAxis] = "schedulerConfig.autoAdjustTimeAxis"
    ...
></bry-scheduler>
```

The last step is to build the demo and check the result. Go to `examples/angular/basic` and run

```
npm run build
```

## Accessing the Scheduler engine
If you need to access Scheduler functionality not exposed by the wrapper, you can access the Scheduler engine directly.
Within the wrapper it is available as `this.schedulerInstance`, from the outside it could look something like this:

```html
<bry-scheduler
  #scheduler
></bry-scheduler>
```

```javascript
class AppComponent {

  @ViewChild(SchedulerComponent) scheduler:SchedulerComponent;

  onClick() {
    this.scheduler.schedulerInstance.scrollEventIntoView(xx);
  }
}
```

For more information on what functions etc. are available in the engine, please view the [API docs](#Scheduler/view/Scheduler).


## Integrating Scheduler with Angular directly (without a wrapper)
Although the Scheduler is a very complex and sophisticated component, it is still very easy to use. All the Scheduler needs is:

1. a configuration object
2. an element to render to

### Scheduler configuration
The best practice is to keep Scheduler configuration in a separate file from which it is imported and passed to the Scheduler constructor. The code would then look similar to the following:

```javascript
import { Scheduler } from 'bryntum-scheduler';
import schedulerConfig from './schedulerConfig';

schedulerConfig.appendTo = 'container';

const scheduler = new Scheduler(schedulerConfig);
```

where `schedulerConfig.js` would contain configuration similar to the following:
```javascript
export default {
    startDate : '2019-06-21 08:00:00',

    viewPreset : {
      base              : 'weekAndDay',
      displayDateFormat : 'll',
      columnLinesFor    : 0
    },

    columns : [...]

    // other config options
}
```
To find out more about all the available configuration options of the Bryntum Scheduler, please consult the <a href="#api">API docs</a>.

### Rendering to an element
The Bryntum Scheduler needs an existing HTML element to render into. It can be declared as `appendTo`, `insertBefore` or `insertFirst` property with values being either an HTMLElement instance or a string which is the id of an element. The Scheduler renders itself as the part of its instantiation if any of the above properties is specified in the config passed into constructor.

In the above example we assign `schedulerConfig.appendTo = 'container'`, which is the id of the containing element, for example `<div id="container"></div>`.

If we do not want to render Scheduler during instantiation you can omit the above properties and render the component manually at the appropriate time by passing the container to the `render` method. It would look like this:

```javascript
import Scheduler from 'bryntum-scheduler';
import schedulerConfig from './schedulerConfig'

// some other code...

const scheduler = new Scheduler(schedulerConfig);

// some other code...

scheduler.render('container');

```

The most common scenario is to render Scheduler in the `ngOnInit` method. At this time we already have a valid element into which we can render the Scheduler component. A very simple example of an Angular component doing this would be following:

```javascript
import { Component, OnInit, ElementRef } from '@angular/core';
import schedulerConfig from './schedulerConfig';
import { Scheduler } from 'bryntum-scheduler';

@Component({
  selector: 'scheduler-view',
  template: '<div></div>'
});

export class SchedulerViewComponent implements OnInit {

    private elementRef     : ElementRef;
    public schedulerInstance : any;

    constructor(element : ElementRef) {
        this.elementRef = element;
    }

    ngOnInit() {
        const schedulerInstance = new Scheduler({
            ...schedulerConfig,
            appendTo : this.elementRef.nativeElement,
        });

        this.schedulerInstance = schedulerInstance;
    }
}

```
The above component can be used anywhere in your Angular application as `<scheduler-view></scheduler-view>`.


## Updating properties at runtime
If you need, you can implement the `ngOnChanges` method in the above component that is called by Angular when any of the properties of the component changes. You would then analyze the changes and you would pass them down to `schedulerInstance` as required by calling its methods or assigning its properties.

## Listening to Scheduler events
The last missing piece is listening and reacting to events fired by the Scheduler. For example, listening to selection change as the user clicks on tasks.

You can install listeners on Scheduler by:

* passing `listeners` config option
* calling `on` or `addListener` method

Listeners config could look similar to this:

```javascript
    listeners : {
        selectionchange : (event) {
            console.log(event);
        }
    }
```

The same effect can be achieved by calling `on` method on Scheduler instance:

```javascript
schedulerInstance.on('selectionchange', (event) => {
    console.log(event);
})
```

## Troubleshooting

If you face troubles building or running our examples, such issues may be resolved by executing the following commands in the example or project directory:

```bash
rm -rf package-lock.json node_modules
npm install
npm run build
```

The error `Bundle included twice` usually means that somewhere you have imported both the normal and UMD versions of the Scheduler package. Check inspect the code and import either UMD or normal version of the Scheduler but not both. Don't forget to inspect the shared packages too.

When using Angular 9 lazy-loading with dynamic imports you may also get `Bundle included twice` runtime error, but with a different cause. The solution for this issue is be to change target from `ESNext` to `CommonJS` in the `compilerOptions` section of `tsconfig.json` file.

When updating Angular version with `ng update` you may get error:
```
404 Not Found - GET https://registry.npmjs.org/bryntum-angular-shared - Not found
Cannot read property '4.0.3' of undefined
```
The easiest solution is to temporarily remove `bryntum-angular-shared` package from `package.json`, upgrade Angular version and then add the not-found package back to `package.json`.

## Further reading
* For more information on config options, features, events and methods consult please the <a href="#api">API docs</a>
* For more information on Angular see the <a href="https://angular.io" target="_blank">Angular site</a>
* If you have any questions related to the integration or Scheduler itself you can always ask on <a href="https://www.bryntum.com/forum/">our forum</a>
