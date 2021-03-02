#Loading using RequireJS
##Include CSS
Include the CSS for the theme you want to use on page:
```html
<link rel="stylesheet" type="text/css" href="path-to-scheduler/scheduler.[theme].css" id="bryntum-theme">
```
##Require the Scheduler
Define where the module can be found:
```javascript
requirejs.config({   
    paths: {
        'scheduler': 'path-to-scheduler/scheduler.umd'
    }
});
```

And then require it and use it:
```javascript
requirejs([ 'scheduler' ], function (bryntum) {

    var scheduler = new bryntum.Scheduler();

});
```

For a complete example, check out the <a href="../examples/requirejs" target="_blank">requirejs example</a>.
