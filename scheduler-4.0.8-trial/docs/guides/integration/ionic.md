<h1 class="title-with-image"><img src="resources/images/ionic.png" alt="Bryntum Scheduler supports Ionic"/>Using Bryntum Scheduler with Ionic</h1>
Scheduler itself is framework agnostic, but it ships with demos and wrappers to simplify using it with popular frameworks
such as Ionic. The purpose of this guide is to give a basic introduction on how to use Scheduler with Ionic.

The Scheduler ships with an Ionic 4 demo, which can be viewed at <a href="../examples/ionic/ionic-4" target="_blank">examples/ionic/ionic-4</a>.
The demo contains a wrapper for Scheduler that turns it into an Ionic component. The wrapper is at this point a basic
implementation, but feel free to extend it to cover your needs.

##Install Scheduler npm package
The package is located in `build` folder. Run this code to install package.

```
npm install Scheduler/build
```

`Scheduler/build` should be the path to the Scheduler's `build` folder.

##Installing Ionic framework

Installation and API documentation can be found at the Ionic project's page https://ionicframework.com/.

Install the Ionic CLI globally with npm:

```
$ npm install -g ionic
```

The -g means it is a global install. For Window’s it's recommended to open an Admin command prompt. For Mac/Linux, run the command with sudo.

##Run scheduler Ionic demo app

Open `./examples/Ionic` folder and execute:

```
$  ionic serve
```

##Create and run your simple Ionic app

Create an App:

```
$  ionic start IonicApp blank
```

`blank` is a common starter template for the app.

Run the App:

```
 cd IonicApp
 ionic serve
```

##Include the Ionic wrapper
The wrapper consists of a single file `scheduler.component.ts`, found under `examples/Ionic/src/app/scheduler`. To use it:

1. Copy it to your project `IonicApp/src/app/scheduler`
2. The wrapper should import Scheduler and other components from `bryntum-scheduler` package

```typescript
    import {Scheduler, Model, Store} from 'bryntum-scheduler';
```

To create IE11 compatible application specify UMD bundle in import directly

```typescript
    import {Scheduler, Model, Store} from 'bryntum-scheduler/scheduler.umd.js';
```

4. Also add CSS for the theme you want to use to styles in `angular.json` file:

```json
"styles": [
    "node_modules/bryntum-scheduler/scheduler.default.css"
]
```

##Using the Scheduler component
The wrapper defines an Ionic component named `SchedulerComponent`, with the corresponding tag `<scheduler>`.
You use it as you would other components, for example to define a basic scheduler in your `.html` file:

```html
<scheduler
    [events]="events"
    [resources]="resources"
    [startDate]="startDate"
    [endDate]="endDate"
    (onSchedulerEvents)="onSchedulerEvents($event)"
  ></scheduler>
```

And some TypeScript code to go with that in your `.ts` file (only showing the relevant parts):

```typescript
import {SchedulerComponent} from "./scheduler/scheduler.component";

export class AppComponent {
  events        = [xx];
  resources     = [xx];
  startDate     = new Date(2018, 1, 7, 8);
  endDate       = new Date(2018, 1, 7, 22);

  onSchedulerEvents() {
    // Catch scheduler event here
  }
}

```

As shown in the example above the component can use property bindings and event bindings.

##Supported options
The Ionic component currently supports the following configs directly:

* [autoHeight](#Grid/view/Grid#config-autoHeight)
* [barMargin](#Scheduler/view/mixin/TimelineEventRendering#config-barMargin)
* [columns](#Grid/view/Grid#config-columns)
* [emptyText](#Grid/view/Grid#config-emptyText)
* [endDate](#Scheduler/view/TimelineBase#config-endDate)
* [eventBodyTemplate](#Scheduler/view/mixin/SchedulerEventRendering#config-eventBodyTemplate)
* [eventColor](#Scheduler/view/mixin/TimelineEventRendering#config-eventColor)
* [eventLayout](#Scheduler/view/mixin/SchedulerEventRendering#config-eventLayout)
* [eventStyle](#Scheduler/view/mixin/TimelineEventRendering#config-eventStyle)
* [eventRenderer](#Scheduler/view/mixin/SchedulerEventRendering#config-eventRenderer)
* [readOnly](#Grid/view/Grid#config-readOnly)
* [responsiveLevels](#Grid/view/mixin/GridResponsive#config-responsiveLevels)
* [rowHeight](#Grid/view/Grid#config-rowHeight)
* [startDate](#Scheduler/view/TimelineBase#config-startDate)
* [viewPreset](#Scheduler/view/mixin/TimelineViewPresets#config-viewPreset)

And these configs related to data:

* [assignmentStore](#Scheduler/view/mixin/SchedulerStores#config-assignmentStore)
* [crudManager](#Scheduler/crud/mixin/CrudManagerView#config-crudManager)
* [dependencyStore](#Scheduler/view/mixin/SchedulerStores#config-dependencyStore)
* [events](#Scheduler/view/mixin/SchedulerStores#config-events)
* [eventStore](#Scheduler/view/mixin/SchedulerStores#config-eventStore)
* [resources](#Scheduler/view/mixin/SchedulerStores#config-resources)
* [resourceStore](#Scheduler/view/mixin/SchedulerStores#config-resourceStore)

It also supports configuring the following features using properties (only for initialization):

* [cellEdit](#Grid/feature/CellEdit)
* [cellTooltip](#Grid/feature/CellTooltip)
* [columnLines](#Scheduler/feature/ColumnLines)
* [columnPicker](#Grid/feature/ColumnPicker)
* [columnReorder](#Grid/feature/ColumnReorder)
* [columnResize](#Grid/feature/ColumnResize)
* [contextMenu](#Grid/feature/ContextMenu)
* [dependencies](#Scheduler/feature/Dependencies)
* [eventDrag](#Scheduler/feature/EventDrag)
* [eventMenu](#Scheduler/feature/EventMenu)
* [eventDrag](#Scheduler/feature/EventDrag)
* [eventDragCreate](#Scheduler/feature/EventDragCreate)
* [eventEdit](#Scheduler/feature/EventEdit)
* [eventFilter](#Scheduler/feature/EventFilter)
* [eventResize](#Scheduler/feature/EventResize)
* [eventTooltip](#Scheduler/feature/EventTooltip)
* [filter](#Grid/feature/Filter)
* [filterBar](#Grid/feature/FilterBar)
* [group](#Grid/feature/Group)
* [groupSummary](#Scheduler/feature/GroupSummary)
* [headerContextMenu](#Scheduler/feature/HeaderContextMenu)
* [labels](#Scheduler/feature/Labels)
* [nonWorkingTime](#Scheduler/feature/NonWorkingTime)
* [regionResize](#Grid/feature/RegionResize)
* [search](#Grid/feature/Search)
* [scheduleTooltip](#Scheduler/feature/ScheduleTooltip)
* [sort](#Grid/feature/Sort)
* [stripe](#Grid/feature/Stripe)
* [summary](#Scheduler/feature/Summary)
* [timeRanges](#Scheduler/feature/TimeRanges)
* [tree](#Grid/feature/Tree)

For example to disable creating events by dragging on empty area and define a default sorter:

```html
<scheduler
    [eventDragCreate]=false
    sort="name"
    ></scheduler>
```

##Accessing the Scheduler engine
To access Scheduler functionality not exposed by the wrapper, you can access the Scheduler engine directly. Within the wrapper it
is available as `this.schedulerInstance`, from the outside it could look something like this:

```html
<scheduler
    #scheduler
    ></scheduler>
```

```
class AppComponent {

  @ViewChild(SchedulerComponent) scheduler:SchedulerComponent;

  onClick() {
    this.scheduler.schedulerInstance.scrollEventIntoView(xx);
  }
}
```

For more information on what functions etc. are available in the engine, please view the [API docs](#Scheduler/view/Scheduler).

##Using with ionic page style attributes

You can setup scheduler component to occupy all free space (align fullscreen) inside <ion-content> tag with this code:

Home page
```html
<ion-header>
...
</ion-header>

<ion-content>
    <scheduler
    #scheduler
    ></scheduler>
</ion-content>
```

Add scheduler styling to align it to full screen

```css
scheduler {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretch;
}
```
