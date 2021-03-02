# Using Material Icons font together with Font Awesome
By default all icons in Bryntum products are based on [Font Awesome 5 Free](https://fontawesome.com/icons?d=gallery).
If you'd like your icons to use Material Icons, but keep ours to use Font Awesome, please add a link to the web font hosted on Google Fonts:

```
<link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet">
```

Read about this and alternative solutions in [the guide](http://google.github.io/material-design-icons/#icon-font-for-the-web) provided by Google.

# Using Material Icons font instead of Font Awesome
But what if you want to use another icon font for the whole project? Lets go through this problem together and replace Font Awesome icons with [Material Icons](https://material.io/resources/icons/?style=baseline).

We have [Theme](https://www.bryntum.com/examples/scheduler/theme/) demo which you can run locally, lets modify it to achieve the result.

## Prepare Material Icons
1. Need to download material icons from [GitHub](https://github.com/google/material-design-icons):
2. Unzip `material-design-icons-master.zip/material-design-icons-master/iconfont` to `scheduler/build/fonts`.
3. Open `examples/theme/resources/custom.scss`, add to the top `material-icons.css` import and update `$icon-font` variable:

```
@import '../../../build/fonts/iconfont/material-icons.css';
...
//$icon-font : 'Font Awesome 5 Free';
$icon-font : 'Material Icons';
```

## Difference between Font Awesome and Material Icons

### Font Awesome
Font Awesome uses special **codes** for every icon. Lets for example take icon "code" (```</>```). In Font Awesome [code icon](https://fontawesome.com/icons/code?style=solid) is coded by **f121** unicode. To paste it to HTML two CSS classes are used: `fas` and `fa-code`:
```html
<i class="fas fa-code"></i>
```
`fas` has styles related to font configurations, like font-family, font-size, etc., when `fa-code` defines [content](https://developer.mozilla.org/en-US/docs/Web/CSS/content) property. In case of "code" icon content is "\f121".

### Material Icons
Material Icons uses special **words** for every icon. These words are placed inside `<i>` tag. In Material Icons [code icon](https://material.io/resources/icons/?search=code&icon=code&style=baseline) is coded by word "code". To paste it to HTML just one `material-icons` CSS class is used:
```html
<i class="material-icons">code</i>
```
`material-icons` similar to `fas` has styles related to font configurations.

### Using Font Awesome notation with Material Icons

According to the docs of [content](https://developer.mozilla.org/en-US/docs/Web/CSS/content) *"The **content** CSS property replaces an element with a generated value"*. That means both approaches will work with Material Icons:
```html
<i class="material-icons">code</i>

<i class="material-icons">
    ::before // content : "code"
</i>
```

## Replacing Font Awesome with Material Icons

Back to the Bryntum code, all classes with "b-" prefix are Bryntum classes, i.e. `b-grid`, `b-scheduler`, `b-icon`, etc. We use our own CSS classes to encapsulate icon font specification:
```html
<i class="b-icon b-icon-code"></i>
```

### Provide equivalents to icons.scss

Lets override `.b-icon-code:before` and some other icons in `examples/theme/resources/custom.scss` right after theme import:

```
// Extend the classic theme
@import '../../../resources/sass/themes/classic.scss';

// Provide content for icons which are used in the sources, see resources/grid-sass/icons.scss
.b-icon-code:before { content : 'code' }
.b-icon-fullscreen:before { content : 'fullscreen' }
.b-icon-info:before { content : 'info' }
.b-icon-angle-left:before { content : 'keyboard_arrow_left' }
.b-icon-angle-right:before { content : 'keyboard_arrow_right' }
.b-icon-prev:before { content : 'keyboard_arrow_left' }
.b-icon-next:before { content : 'keyboard_arrow_right' }
.b-icon-calendar:before { content : 'perm_contact_calendar' }
.b-icon-sub-menu:before { content : 'chevron_right' }
.b-icon-search-plus:before { content : 'zoom_in' }
.b-icon-filter:before { content : 'filter_list' }
.b-icon-remove:before { content : 'clear' }
// and so on...
```

And it's almost done. Since we want Theme demo to use Material icons only, need to adjust it to use Material Icons for events too.
 
### Adjust demo icons

In your applications we encourage you to use your own icons. Don't rely on `b-icon-xx` which is used in our sources or `b-fa-icon-xx` which is used in our demos. By default if [iconCls](#Scheduler/model/EventModel#field-iconCls) is defined we render ```<i>``` tag before event name and apply the classes to it, something like:

```javascript
`<i class="${eventRecord.iconCls}"></i>${eventRecord.name}`
```

To be able to use `iconCls` with Material Icons, you can specify [eventBodyTemplate](#Scheduler/view/mixin/SchedulerEventRendering#config-eventBodyTemplate) function as it's shown below:

```javascript
new Scheduler({
    eventBodyTemplate : eventRecord => `<i class="material-icons">${eventRecord.iconCls}</i>${eventRecord.name}`,
    ...
});
```

And adjust data for that demo to use:
```javascript
events = [
    {
        resourceId : 'r1',
        name       : 'Coding session',
        startDate  : new Date(2017, 0, 1, 10),
        endDate    : new Date(2017, 0, 1, 12),
        eventColor : 'orange',
        iconCls    : 'code'
    },
    {
        resourceId : 'r2',
        name       : 'Conference call',
        startDate  : new Date(2017, 0, 1, 12),
        endDate    : new Date(2017, 0, 1, 15),
        eventColor : 'lime',
        iconCls    : 'phone'
    },
    {
        resourceId : 'r3',
        name       : 'Meeting',
        startDate  : new Date(2017, 0, 1, 14),
        endDate    : new Date(2017, 0, 1, 17),
        eventColor : 'teal',
        iconCls    : 'perm_contact_calendar'
    },
    {
        resourceId : 'r4',
        name       : 'Scrum',
        startDate  : new Date(2017, 0, 1, 8),
        endDate    : new Date(2017, 0, 1, 11),
        eventColor : 'blue',
        iconCls    : 'comment'
    },
    {
        resourceId : 'r5',
        name       : 'Use cases',
        startDate  : new Date(2017, 0, 1, 15),
        endDate    : new Date(2017, 0, 1, 17),
        eventColor : 'violet',
        iconCls    : 'people'
    },
    {
        resourceId : 'r6',
        name       : 'Golf',
        startDate  : new Date(2017, 0, 1, 16),
        endDate    : new Date(2017, 0, 1, 18),
        eventColor : 'pink',
        iconCls    : 'golf_course'
    }
];
```

**Note:** You can introduce a new data field and refrain from using `iconCls`.

### Checking the result

Now need to build sass and check how the demo works in a browser:

<img src="resources/images/theme-demo-with-material-icons.png" style="max-width : 512px" alt="Theme demo with Material Icons">

## Make Tree demo to use Material Icons

1. Copy `material-design-icons-master/iconfont` to `Scheduler/build/fonts`.

2. Update Scheduler/examples/tree/resources/app.scss:

    ```
    // Import new icon font
    @import '../../../build/fonts/iconfont/material-icons.css';
    
    // Define icon font variable to be used everywhere
    $icon-font : 'Material Icons';
    
    // Pick out a theme from our shipped themes to extend
    @import '../../../resources/sass/themes/stockholm.scss';
    
    // Specify your custom theme name by overriding meta theme info (required)
    .b-theme-info:before {
        content: '{"name":"Custom"}';
    }
    
    // Provide content for icons which are used in the sources, see resources/grid-sass/icons.scss
    .b-icon-tree-collapse:before { content : 'keyboard_arrow_right' }
    .b-icon-tree-expand:before { content : 'keyboard_arrow_right' }
    // etc
    ```

3. Update `Scheduler/examples/tree/index.html` to do not include `../../build/scheduler.stockholm.css`
4. Then need to build sass. The output css will contain our classes with Material Icons font, including expanded/collapsed icons in the tree.
