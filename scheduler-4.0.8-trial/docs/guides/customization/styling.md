# Styling
The Scheduler is rendered in the DOM using regular HTML and CSS, and can be completely styled using SASS. The resource 
rows, header time axis cells (like days and months), and events of the scheduler can each be styled and colored 
differently. It ships with both compiled CSS bundles and the original scss files. The CSS includes different themes and 
a variety of presets and colors which can be used to alter how the Scheduler and its events look. You can also 
programmatically modify the appearance of cells, headers and events using renderers.

**Note:** The trial version does not include the SASS. You need the full version to be able to follow some of the 
instructions below.

## Styling event bars using predefined styles and colors
Bryntum Scheduler ships with 7 predefined event styles, each available in 12 colors. Style and color can be specified
for the entire schedule, per resource or per event. Event settings overrides resource, which in its turn overrides the 
scheduler setting. The following snippet shows how to assign colors:

```javascript
// Make all events blue by default
scheduler.eventColor = 'blue';
// Make all events assigned to a specific resource orange:
resoure.eventColor = 'orange';
// Make a single event violet:
event.eventColor = 'violet';
```

This demo has one event per available color:

<div class="external-example" data-file="guides/styling/colors.js"></div>

Event styles are assigned in a very similar way:

```javascript
// Make all events use "border" style by default
scheduler.eventStyle = 'border';
// Make all events assigned to a resource use "line" style:
resoure.eventStyle = 'line';
// Make a single event colored:
event.eventStyle = 'colored';
```

And this demo shows the predefined styles:

<div class="external-example" data-file="guides/styling/styles.js"></div>

Give the <a href="../examples/eventstyles" target="_blank">examples/eventstyles</a> demo a shot if you want to try
different colors and styles.

**Note:** If you want to control the appearance of events using custom CSS we recommend setting both `eventColor` and 
`eventStyle` to `null`. This applies very basic styling that is easier to override using CSS.

## Using different theme

Scheduler ships with five themes: Stockholm, classic, classic-light, classic-dark and material. Each theme is compiled 
into a self containing bundle in the `build/` folder. Simply include it on a page to use it (don't forget the id!):

```html
<link rel="stylesheet" href="build/scheduler.stockholm.css" id="bryntum-theme">
<link rel="stylesheet" href="build/scheduler.classic.css" id="bryntum-theme">
<link rel="stylesheet" href="build/scheduler.classic-light.css" id="bryntum-theme">
<link rel="stylesheet" href="build/scheduler.classic-dark.css" id="bryntum-theme">
<link rel="stylesheet" href="build/scheduler.material.css" id="bryntum-theme">
```

Comparison of themes:

![Classic theme](../examples/grouping/meta/thumb.classic.png "Default theme")
![Classic-Light theme](../examples/grouping/meta/thumb.classic-light.png "Light theme")
![Classic-Dark theme](../examples/grouping/meta/thumb.classic-dark.png "Dark theme")
![Material theme](../examples/grouping/meta/thumb.material.png "Material theme")
![Stockholm theme](../examples/grouping/meta/thumb.stockholm.png "Stockholm theme")

In most of the included examples you can switch theme on the fly by clicking on the info icon found in the header and
then picking a theme in the dropdown.

## Creating a custom theme

To create your own theme, follow these steps:

1. Make a copy of and existing theme found under resources/sass/themes, for example classic-light.scss
2. Edit the variables in it to suit your needs (you can find all available variables by looking in resources/sass/variables.scss)
3. Compile it to CSS and bundle it using your favorite SASS compiler/bundler
4. Include your theme on page (and remove any default theme you where using)

Please see <a href="../examples/theme" target="_blank">examples/theme</a> for a custom theme in action:

<a href="../examples/theme" target="_blank"><img src="resources/images/custom-theme.png" style="max-width : 512px" alt="Custom theme"></a>

## Using renderers and CSS

Contents of grid cells, header cells and events can be fully customized using 'renderers'. Renderers are functions with 
access to a the data used output grid cells / header cells / events (such as style and CSS classes, and in some cases 
elements). They can manipulate the data to alter appearances or return a value to have it displayed.

In the demo below, we use the following APIs:
* [Resource `cls` field](#Scheduler/model/ResourceModel#field-cls) - To provide row specific styling
* [Column cell renderer](#Grid/column/Column#config-renderer) - To output custom cell content 
* [Column header renderer](#Grid/column/Column#config-headerRenderer) - To add special text in column header
* [Time Axis cell renderer](#Scheduler/preset/ViewPresetHeaderRow#config-renderer) - To show a sad emoji on the most 
  boring day week of the day (Monday) 
* [Event bar renderer](#Scheduler/view/mixin/SchedulerEventRendering#config-eventRenderer) - To output custom text into 
  the event bar

<div class="external-example" data-file="guides/styling/renderers.js"></div>

```javascript
const scheduler = new Scheduler({
    viewPreset : {
        base    : 'weekAndDayLetter',
        headers : [
            {
                unit                : 'week',
                dateFormat          : 'ddd DD MMM YYYY', // Mon 01 Jan 2017
            },
            {
                unit                : 'day',
                renderer : (start, end, headerConfig, index) => {
                    if (start.getDay() === 1) {
                        headerConfig.headerCellCls = "blue-monday";
                        return '☹️'
                    }

                    return DateHelper.format(start, 'd1');
                }
            }
        }
    ],
    columns: [
        {
            text: 'Name',
            field: 'name',
            width: 160,
            htmlEncode : false,
            // Custom header renderer
            headerRenderer ({column}) => column.text.toUpperCase() + '!',
            // Custom cell renderer
            renderer({record, value}) {
                return `<i class="b-fa b-fa-${record.gender}"></i>${value}`;
            }
        }
    ],

    // Custom event renderer
    eventRenderer({eventRecord, tplData}) {
        // Inline style
        tplData.style = 'font-weight: bold; border-radius: 3px';
        // Add CSS class
        tplData.cls.add('my-custom-css');
        return 'Activity: ' + eventRecord.name;
    }
});
```

## Other useful configs

There are a few other configs worth mentioning to affect the styling of your Scheduler/events:

* `barMargin`, distance between overlapping events within a resource ([docs](#Scheduler/view/mixin/TimelineEventRendering#config-barMargin)) ([demo](../examples/rowheight))
* `resourceMargin`, distance between the first and last event and the resources borders ([docs](#Scheduler/view/mixin/SchedulerEventRendering#config-resourceMargin)) ([demo](../examples/rowheight))
* `eventLayout`, determines if overlapping events stack, pack or simply overlap ([docs](#Scheduler/view/mixin/SchedulerEventRendering#config-eventLayout)) ([demo](../examples/layouts))

```javascript
 const scheduler = new Scheduler({
     barMargin : 3,
     resourceMargin : 15,
     eventLayout : 'pack',
     ...
 });
```

# Learn more
Some more information can be found in the following blog posts:

* [Styling your tasks, part 1](https://www.bryntum.com/blog/styling-your-tasks-part-1-built-in-styling)
* [Styling your tasks, part 2](https://www.bryntum.com/blog/styling-your-tasks-part-2-custom-styling)

Happy styling :)

