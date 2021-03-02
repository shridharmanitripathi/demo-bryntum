<h1 class="title-with-image"><img src="resources/images/react.png" alt="Bryntum Scheduler supports React"/>Using Bryntum Scheduler with React</h1>

The Scheduler itself is framework agnostic, but it ships with demos and wrappers to simplify using it with popular frameworks
such as React. The purpose of this guide is to give you the basic introduction on how to use Scheduler with React.

Scheduler ships with React demos which run either in development mode or can be built for production. They are located in `examples/react/javascript` folder. The demos are ready for direct viewing (in production mode) here: <a href="../examples/#Integration/React" target="_blank">React Integration Examples</a>.


The React demos have been created using <a href="https://github.com/facebook/create-react-app" target="_blank">create-react-app</a> script so that they can be run locally by running `npm start` in their respective directories, or they can be built for production by running `npm run build`.

Examples use our React wrapper (`BryntumScheduler.js`), which is a React component that uses Scheduler as an internal engine. The wrapper is at this point a basic implementation, but feel free to extend it to cover your needs.

The exception to the above are `Localization` and `Advanced` examples that use Bryntum scheduler component directly without a wrapper.


For more information on React, please visit <a href="https://reactjs.org/" target="_blank">reactjs.org</a>.


If you did not use create-react-app to create your project, please see the *Custom Configurations* section of this guide.

## Install Scheduler npm package
The Scheduler package contains all the Bryntum Scheduler code together with supporting widgets and utilities in the form of a module that can be installed with `npm` package manager. The package is located in `build` folder of the unzipped Bryntum Scheduler distribution. For example, if you unzipped to `/Users/developer/scheduler-2.3.1`, then run this code to install it:

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

## Using the BryntumScheduler wrapper
1. Copy `BryntumScheduler.js` from `examples/react/_shared/src/lib` to a directory in your project, for example `src/components`.

    _Note: You can also copy other files from the shared library or from the examples if you want or if they contain the functionality similar to your needs._

2. Import the wrapper in your file that will use it:
    ```javascript
    import BryntumScheduler from './components/BryntumScheduler'
    ```

    _Note: You may also take another approach instead of copying wrapper and other files to your project tree. You may want to create a separate package, a library, that would contain the wrapper and other useful files. This approach would be preferred especially when you use scheduler in several projects and you want to share the common part(s) among them._

    _We use this approach in our examples. See the source of `_shared` folder for details. This folder contains package `bryntum-react-shared` that is then imported from in the examples sources. For example:_

    ```jsx
    import { BryntumScheduler } from 'bryntum-react-shared'
    ```

3. Use it in your code at the place you need it the way similar to the following:

    ```jsx
    <BryntumScheduler
        ref        = {scheduler}
        autoHeight = {true}
        startDate  = {new Date(2019, 5, 17, 18)}
        endDate    = {new Date(2019, 5, 17, 20)}
        // other properties
    />
    ```

The wrapper defines a React component named `BryntumScheduler`. You can use it the same way as you would use other React components. The example of a very simple one-file application template follows:

```jsx
// the scheduler wrapper
import BryntumScheduler from './components/BryntumScheduler.js';
import React, { Component} from 'react'

export default class App extends Component {

    state = {
        events    : [ ... ],
        resources : [ ... ]
    };

    handleSelectionChange = (event) => {
        // Code to take action when an event is selected goes here
    };

    render() {
        return (
            <BryntumScheduler
                ref = {'scheduler'}

                events    = {this.state.events}
                resources = {this.state.resources}

                startDate = {new Date(2017, 1, 7, 8)}
                endDate   = {new Date(2017, 1, 7, 18)}

                onEventSelectionChange = {this.handleSelectionChange}
            />
        );
    }
}

```

As shown in the example above the component can be configured using props and it handles state and events.

### Best practices
There are many possible ways of creating and building React applications ranging from the recommended default way of using [Create React App](https://create-react-app.dev/) scripts through applications initially created with Create React App but ejected later, up to very custom setups using Webpack or another packager and manually created application.

We used Create React App to create all our React examples and it has proven to be the simples, most compatible and most reliable way of using Bryntum Scheduler in a React application.

The broad steps are as follows:

0. Download the Bryntum Scheduler, trial or full version depending on your license
1. Use `npx create-react-app bryntum-demo` to create a basic empty React application
2. Install `bryntum-scheduler` according to section **Install Scheduler npm package** above
3. Copy `BryntumScheduler.js` wrapper or build and install `bryntum-react-shared`
4. Import and use the `BryntumScheduler` in the application
5. Import a Scheduler CSS file, for example `scheduler.stockholm.css` to achieve the proper scheduler look

The whole process is demonstrated in the following video:

<img src="resources/images/clean-react.gif" style="border:1px solid silver" alt="Test">

Our examples also use resources from `bryntum-react-shared`, for example `shared.scss`, fonts and images that are used to style demo's header, logo, etc. These are generally not needed in your application because you have different logo, colors, layout of header, etc.

We recommend to use the above procedure and create the application from scratch but if you take our demo as the basis, do not forget to clean it up from imports, resources, css files and rules that are not needed.

Also we do not recommend to copy the downloaded and unzipped Scheduler to your project tree not only because it would bloat the size but mainly because it can fool the IDE to propose auto-imports from the wrong places. For example:
```
// if you installed bryntum-react-shared, you should never import from the source file
import FullscreenButton from './scheduler-trial/examples/react/_shared/lib/FullscreenButton.js'

// but always from the package
import { FullscreenButton } from 'bryntum-react-shared';
```
If you decide to copy the files from Bryntum download to your project, always copy selectively only the source files you need, not the whole distribution.

Please consult Custom Configurations section below if your project has not been created with Create React App.


## Using React as cell renderer
Bryntum Scheduler column already supports configuration option [renderer](#Grid/column/Column#config-renderer) which is function that receives rich parameters used as inputs to compose the resulting returned html. Any kind of conditional complex logic can be used to prepare a visually rich cell content.

Yet, there can be a situation when you already have a React component that implements the desired cell visualizations and re-writing its functionality as the renderer function would only be superfluous work.

It is now possible to use JSX that can refer also to React components as a cell renderer. The support is implemented in the `BryntumScheduler` wrapper therefore the wrapper must be used for the JSX renderers to work.

### Using simple inline JSX

Using inline JSX is as simple as the following:

```jsx
renderer: ({ value }) => <b>{value}</b>
```

If you also need to access other data fields, you can do it this way:

```jsx
renderer: (renderData) => <div><b>{renderData.value}</b>/{renderData.record.role}</div>
```

_**Note:** Mind please that the above functions return html-like markup without quotes. That makes the return value JSX and it is understood and processed as such. If you enclose the markup in quotes it will not work._

### Using a custom React component

It is similarly simple. Let's have the following simple component:

```jsx
import React, { Component } from 'react';

// Defines a simple button React component
export default class DemoButton extends Component {
    render() {
        return <button
            className="b-button b-green"
            onClick={this.props.onClick}
            style={{ width : '100%' }}
        >{this.props.text}</button>
    }
}
```
The button expects `text` and `onClick` as its properties. In the grid application we have to import `DemoButton` and then we can use this component as follows:

```jsx
import DemoButton from '../components/DemoButton';

/**
 * User clicked the "+1 hour" button on a resource
 */
handleDelayClick = record => {
    record.events.forEach(event => {
        // Move 1h forward in time
        event.startDate = new Date(event.startDate.getTime() + 1000 * 60 * 60);
    });
};

render = () => {
    return (
        <BryntumScheduler
            // Scheduler columns
            columns={[
                {
                    text     : 'Delay<div class="small-text">(React component)</div>',
                    width    : 120,
                    editor   : false,
                    // Using custom React component
                    renderer : ({ record }) =>
                        <DemoButton
                            text={'+1 hour'}
                            onClick={() => this.handleDelayClick(record)}
                        />
                },
                // ... other columns
            ]}
            // ... other props
        />
    );
}

```
The column `renderer` function above is expected to return JSX, exactly same as in the case of simple inline JSX, but here it returns imported `DemoButton` component. The `renderer` also passes the mandatory props down to the component so that it can render itself in the correct row context.

If you use Functional React Components, wrap them in the `renderer` function that will return React FC, otherwise you will not be able to use React Hooks:

```jsx
import React, {useEffect} from 'react';
const CellRenderer = ({value}) => {
    useEffect(()=>{
        console.log('Running useEffect');
    },[]);

    return <div>{value}</div>
}

// this will work
return (
    <BryntumScheduler
        columns={[
            field: 'name',
            text: 'Name',
            renderer: ({value}) => <CellRenderer value={value} />
        ]}
    >
)

// this will NOT work
return (
    <BryntumScheduler
        columns={[
            field: 'name',
            text: 'Name',
            renderer: CellRenderer
        ]}
    >
)
```

### React renderers performance
The renderers are implemented as React portals. These portals can be discarded (deleted) when not needed anymore to limit the memory consumption or they can be hidden without DOM manipulation for fast performance (default). When you need to limit the memory consumption you can set `discardPortals` to true.

```
<BryntumScheduler
    discardPortals={true}
    // ...
>
```

## Using React as cell editor

It is also possible to use a React component as the cell editor that activates on the cell dbl-click by default. The React component acting as the editor has to implement the following methods:

* setValue
* getValue
* isValid
* focus

These methods are required by `BryntumScheduler` React wrapper and an exception is thrown if any of them is missing.

The React component implementing the grid cell editor could look like this:

```jsx
import React, { Component, Fragment } from 'react';

// Defines a simple React cell editor that displays two buttons Yes|No, for editing boolean columns
export default class DemoEditor extends Component {
    state = {
        value : ''
    };

    // Should return the value to be applied when editing finishes
    getValue() {
        return this.state.value;
    }

    // Current cell value + context, set when editing starts. Use it to populate your editor
    setValue(value, cellEditorContext) {
        this.setState({ value });
    }

    // Invalid editors are not allowed to close (unless grid is so configured).
    // Implement this function to handle validation of your editor
    isValid() {
        // This simple editor is always valid
        return true;
    }

    // Called when editing starts, to set focus at the desired place in your editor
    focus() {
        if (this.state.value) {
            this.noButton.focus();
        }
        else {
            this.yesButton.focus();
        }
    }

    onYesClick() {
        this.setValue(true);
        this.noButton.focus();
    }

    onNoClick() {
        this.setValue(false);
        this.yesButton.focus();
    }

    render() {
        return <Fragment>
            <button
                className="yes-button"
                tabIndex={-1}
                ref={el => this.yesButton = el}
                style={{ background: this.state.value ? '#D5F5E3' : '#F2F3F4' }}
                onClick={this.onYesClick.bind(this)}
            >Yes</button>
            <button
                className="no-button"
                tabIndex={-1}
                ref={el => this.noButton = el}
                style={{ background: this.state.value ? '#F2F3F4' : '#F5B7B1' }}
                onClick={this.onNoClick.bind(this)}
            >No</button>
        </Fragment>;
    }
}
```

Having the component which implements the editor we can use it in our application as follows:

```jsx
import DemoEditor from '../components/DemoEditor';

render = () => {
    return (
        <BryntumScheduler
            columns={[
                {
                    field    : 'important',
                    text     : 'Important<div class="small-text">(React editor)</div>',
                    align    : 'center',
                    width    : 120,
                    renderer : ({ value }) => value ? 'Yes' : 'No',
                    editor   : ref => <DemoEditor ref={ref}/>
                },
                // ... other columns
            ]}
            // ... other props
        />
    );

```
The `editor` function receives `ref` as the argument and that must be passed down to the React component that implements the cell editor. Although there is no apparent use of this property in the component code itself, it is mandatory because it is used by the `BryntumScheduler` wrapper to keep the reference to the React editor component. You can also pass another props if you need but never forget `ref={ref}`.

JSX Cell renderers and editors are implemented as <a href="https://reactjs.org/docs/portals.html" target="_blank">React Portals</a> that allow rendering of React components outside of their parent trees, anywhere in the DOM. We use this feature to render the above DemoButtons in grid cells. The following screenshot shows these buttons in the React Dev Tools. You can click on it so see it in action.

<a href="../examples/react/javascript/simple" target="_blank">
<img src="resources/images/SchedulerJSX.png" alt="Example of Bryntum Scheduler with JSX">
</a>


## Supported options

The React component supports the following configuration options:

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

It also supports configuring the following features:

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

Please mind that features are distinguished from config options by `Feature` suffix and are propagated to the underlying engine feature with the suffix stripped. Thus, `sortFeature` will become `feature.sort` in the Bryntum Scheduler (schedulerInstance).

For example to disable creating events by dragging on empty area and define a default sorter:

```html
<BryntumScheduler
    eventDragCreateFeature = {false}
    sortFeature            = {'name'}
/>
```

## The native Bryntum Scheduler instance

It is important to know that the React component that we may even call "scheduler" is _not_ the native Bryntum Scheduler instance, it remains to be a wrapper or an interface between the React application and the Bryntum Scheduler itself.

The majority of properties and features are propagated from the wrapper down to the underlying Bryntum Scheduler instance but there might be the situations when you want to access the Bryntum Scheduler directly. That is fully valid approach and you are free to do it.

### Accessing the Scheduler engine

To access Scheduler functionality not exposed by the wrapper, you can access the Scheduler engine directly. Within the
wrapper it is available as `this.schedulerInstance`, from the outside it could look something like this:

```jsx
<BryntumScheduler
    ref = {'scheduler'}
/>
```

```jsx
// From within your React app
this.refs.scheduler.schedulerInstance.scrollEventIntoView(xx);
```

When accessing `schedulerInstance` directly, use <a href="#Scheduler/view/Scheduler" target="_blank">API docs</a> to know which properties and methods you may use and what are the valid values.

## Using Scheduler without the wrapper

You can use the scheduler directly if you prefer to do so. In that case you must ensure that you pass the scheduler configuration to the component and that you take care of propagation of changes from your upper level components to the scheduler as necessary.

If you use <a href="https://reactjs.org/docs/hooks-intro.html" target="_blank">React Hooks</a> (available from React version 16.8.0) your code may look as follows:
```javascript
import schedulerConfig from './components/schedulerConfig';

// refs
const
    scheduler = useRef(),
    firstRun  = useRef(true);

// create scheduler (initial, run-once)
useEffect(() => {
    scheduler.current = new Scheduler({
        ...schedulerConfig,
        appendTo : 'content'
    });
}, []);

// handles zoom level change
useEffect(() => {
    if (!firstRun.current) {
        const method = props.zoomLevel >= scheduler.current.zoomLevel ? 'zoomIn' : 'zoomOut';
        scheduler.current[method]();
    }
    else {
        firstRun.current = false;
    }
}, [props.zoomLevel]);
```
`schedulerConfig` above would be the object that contains the complete configuration for Scheduler component. It is best to keep that configuration, that can get quite long, in a separate file.

## Theming

For the scheduler styling you must also import a CSS file that contains your preferred theme. In our examples we import CSS in the `src/App.js` file as follows:
```javascript
import 'bryntum-scheduler/scheduler.stockholm.css';
```

To switch themes dynamically, instead of importing the CSS file, you need to add a link element to the `public/index.html` file:
```javascript
<link rel="stylesheet" href="%PUBLIC_URL%/scheduler.stockholm.css" id="bryntum-theme">
```
Copy fonts and themes from the `build` folder to the `public` folder of your app and make sure `href` points to the default theme.
To switch the theme at runtime in your application, import `DomHelper` from our bundle and call [setTheme](#Core/helper/DomHelper#function-setTheme-static) with the name of the new theme.
```javascript
import { DomHelper } from 'bryntum-scheduler';
DomHelper.setTheme('classic-dark');
```

## React useState hook in functional components
The common React practice of preserving data between functional component's re-runs is to use `useState` hook this way:
```
import React, { useState } from 'react';

function App = props => {
    const [value, setValue] = useState('Initial value');

    // ...
    return ( /* component JSX /*)
}
```

State variable `value` can then be accessed within the scope of `App`. However, if a function defined in the scope of `App` is passed to Bryntum Scheduler as a listener function or renderer, then the `value` within that function will be always `'Initial value'`. This is not a feature or bug of Bryntum Scheduler but it is how React works.

The following simplified code demonstrates the problem:

```
import React, { useState } from 'react';

function App = props => {
    const [value, setValue] = useState('Initial value');

    const handler = () => {
        console.log(value) // will always output 'Initial value'
    }

    // ...
    return (
        <button onClick={()=>{
            setValue('Other value');
        }}>Click me</button>
        <BryntumScheduler
            listeners={{
                mouseOver:handler
            }}
        />
    );
}
```
To solve this problem use `useContext` React hook instead of `useState`. It can be implemented as follows:
```
import React, { createContext, useContext } from 'react';

const context = createContext('Initial Global Value');

const App = props => {
    let globalValue = useContext(context);

    const handler = () => {
        console.log(globalValue);
    }

    // ...
    return (
        <button onClick={()=>{
            globalValue = 'Other Value';
        }}>Click me</button>
        <BryntumScheduler
            listeners={{
                mouseOver:handler
            }}
        />
    );
}
```
This approach is only necessary if the listener or renderer functions passed to Bryntum Scheduler need to access variables from the enclosing React functional component.

## Custom Configurations
<a href="https://create-react-app.dev/" target="_blank">Create React App</a> is an officially supported way to create single-page React applications. It offers a modern build setup with no configuration so it has been chosen for our examples.

While this approach is preferable in the majority of cases, you can still have a custom Webpack configuration that is not managed by Create React App scripts. Although it is not feasible for us to support all possible custom configurations we have some guidelines to make the Bryntum Scheduler integration easier and smoother.

If you face any issues, performing one or more of the following steps should resolve the problem.

### Copy React wrappers to the project tree
We use React wrappers from the `bryntum-react-shared` package in our examples and it works. However, for some projects it may be necessary to copy wrappers' files (`BryntumScheduler.js`, `BryntumWidget.js`, etc.) to your project tree to ensure that they are transpiled together with the other project files.

The wrappers are located in `examples/react/_shared/src/lib` folder. Copy the files from there to your project.

### Use UMD version of Bryntum Scheduler build
In some cases it might be necessary to use this version for the custom build process to succeed even if you do not need IE11 compatibility. The reason is that your Webpack/Babel/ESLint configuration may not match the non-umd code.

For that, uncomment the line with `umd` version and comment the other one in all React wrappers you use (`BryntumScheduler.js`, `BryntumWidget.js`, etc.)
```
// we import scheduler.umd for IE11 compatibility only. If you don't use IE import:
// import { Scheduler, ObjectHelper, Widget } from 'bryntum-scheduler';
import { Scheduler, ObjectHelper, Widget } from 'bryntum-scheduler/scheduler.umd';
```

### Add or edit `.eslintignore` file
It may also be necessary to ignore linter for some files. If you do not have `.eslintignore` in your project root create it (edit it otherwise) so that it has at least the following content:
```
BryntumScheduler.js
BryntumWidget.js
FullscreenButton.js
scheduler.module.js
scheduler.umd.js
```

### Clear npm cache
Clearing the npm cache can sometimes resolve problems mainly with dependencies not found. To clear the cache run:
```
npm cache clear --force
```


## Troubleshooting

If you face any issues building or running examples or your application, such issues can be often resolved by the following commands run in the example or the project directory:

```bash
rm -rf package-lock.json node_modules
npm install
npm run build
```

If you see a failure like the one below, that is probably your linter doesn't accept our bundle. Please try to disable our bundle completely from checking by any linters. In case of "eslint" add `/* eslint-disable */` to the top of the bundle.

```
./src/build/scheduler.module.js
  Line 9:   Unexpected use of 'self'                                               no-restricted-globals
  Line 9:   Unexpected use of 'self'                                               no-restricted-globals
  Line 10:   'jQuery' is not defined                                                no-undef
  Line 10:  Expected an assignment or function call and instead saw an expression  no-unused-expressions
  Line 34:    Expected an assignment or function call and instead saw an expression  no-unused-expressions
  Line 160:  'view' is not defined                                                  no-undef
  Line 160:  'centered' is not defined                                              no-undef
  Line 162:  Unexpected use of 'location'                                           no-restricted-globals
  Line 162:  Unexpected use of 'location'                                           no-restricted-globals
  Line 162:  Unexpected use of 'location'                                           no-restricted-globals
  Line 162:  'bryntum' is not defined                                               no-undef
  Line 162:  'dataLayer' is not defined
```

## Further reading
* For more information on config options, features, events and methods consult please the <a href="#api">API docs</a>
* For more information on React see the <a href="https://reactjs.org" target="_blank">React docs</a>
* For more information on Create React App scripts see <a href="https://facebook.github.io/create-react-app/" target="_blank">the documentation</a>
* If you have any questions related to the integration or Scheduler itself you can always ask on <a href="https://www.bryntum.com/forum/">our forum</a>
