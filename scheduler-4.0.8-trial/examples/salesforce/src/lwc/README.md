# Using Bryntum Scheduler as a Lightning Web Component

As of version 4.0.0 Bryntum Scheduler implements **experimental** Locker Service support and can be embedded into a Lightning
Web Component.

## Why is support experimental?

Locker Service creates a sandbox environment for 3rd party JS code, constraining it to the Lightning Web Component (aka
LWC from now on) element. It wraps Web API into proxy objects thus changing behavior and breaking a few things.
 
So which are the affected parts?

### Popups

Bryntum Scheduler uses popups extensively to show tooltips, editors, windows, menus etc. Normally a root element for these is
appended to the document body and used to position popups and listen for key events. Locker Service does not allow us to
do that, instead each LWC has its own root element to show popups. Given all the restrictions with Locker Service,
Bryntum Scheduler avoids using `document`, `document.body` and `window` as much as possible. It uses the LWC root element 
instead, think of it as of a new _body_. This is why it is important to let the bundle know about it. You can see how it
is done in the demo:
```
Promise.all([
    loadScript(this, SCHEDULER + '/scheduler.lwc.module.js'),
    loadStyle(this, SCHEDULER + '/scheduler.stockholm.css')
]).then(() => {
    bryntum.scheduler.init(this.template);
})
``` 

`init(this.template)` call is **required** to use our components.

Major downside in this experimental version is that static resource cannot be seamlessly shared between multiple LWC
instances. This leads to the next challenge.

### Sharing static resource between Lightning Web Components

When the JS bundle is loaded as a static resource it adds a global object called `bryntum`, where it creates product-specific
namespace (scheduler in our case). After the `init` call the bundle starts to use the passed element as the target (root) for
popups as described above. It means if you create two components sharing the static resource, bundle will use last element
passed to the `init()` call. So last loaded component would be a target for popups and key events, meaning some features
(like key navigation) will break. We are looking for a proper solution to this problem.

In case you use components on different pages of the application you could use navigation API to update root each time:
```
import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

export default class Scheduler_component extends LightningElement {
    @wire(CurrentPageReference)
    currentPageReferenceCallback(pageRef) {
        if (this._loaded) {
            bryntum.scheduler.init(this.template);
        }
    }
}
```

#### Is it possible with different static resources?

Unfortunately, it is not possible with default bundle. As mentioned above static resource creates a global object and
when second bundle loads and finds a global object for the same product, it throws exception _"bundle included twice"_. 
In the default demo this would lead to a toast message saying _"Error loading Bryntum Scheduler"_.

At the same time it should be possible with a custom bundle per each Lightning Web Component. You'll need `rollup` 
package, config and entry importing required JS classes.
```
// rollup.config.js
export default [
    {
        input: 'scheduler.entry.js',
        output: {
            dir: 'force-app/main/default/staticresources/custom_scheduler',
            format: 'umd',
            name: 'custom // this is a both a name of the bundle and name of the global object
        }
    }
]

// scheduler.entry.js
// First import special salesforce overrides
import '/path/to/bryntum/lib/Scheduler/override/salesforce/AllOverrides.js';
// Then import init method and required classes (order is irrelevant)
import init from '/path/to/bryntum/lib/Core/override/Init';
import Scheduler from '/path/to/bryntum/lib/Scheduler/view/Scheduler.js';

export { Scheduler, init };

// scheduler_component.js
import SCHEDULER from '@salesforce/resourceUrl/custom_scheduler';
...
    renderedCallback() {
        ...
        Promise.all([
            loadScript(this, GRID + '/custom.js'),
            loadStyle(this, GRID + '/scheduler.stockholm.css')
        ]).then(() => {
            this.createScheduler();
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error loading Bryntum Scheduler',
                    message: error,
                    variant: 'error'
                })
            );
        });
    }

    createScheduler() {
        custom.init(this.template);

        window.scheduler = new custom.Scheduler({
            appendTo: this.template.querySelector('.container'),
            rowHeight: 50,
            barMargin: 8,
            columns: [
                {
                    text: 'Production line',
                    width: 150,
                    field: 'name'
                }
            ],
            startDate: new Date(2017, 11, 1),
            endDate: new Date(2017, 11, 3),
        });
    }
```

#### CSS collision

It is possible to get a CSS collision on components when loading static resources for different Bryntum products. Normally
this should not be a problem because each product bundle exports the components it is based on. Scheduler exports Grid, Gantt
exports both Scheduler and Grid. Which means you can use Grid from Gantt's static resource.

But in case you have a static resource for Grid (having grid.theme.css) and another for Scheduler (having scheduler.theme.css)
you may see some wrong styles, like timeline header misplaced by a few pixels.

We don't know how common this use case would be, so if you experience this issue please let us know on [forum](https://www.bryntum.com/forum)
or [GitHub](https://github.com/bryntum/support/issues).

### Changed/missing API

As mentioned above, the Locker Service does change behavior of some APIs and does not support a few. We refactored our
code base to polish rough edges and allow overriding certain behavior specifically to work with Locker Service. As a result
**scheduler.lwc.module.js only works when Locker Service is enabled**, it is not supposed to work on a regular page.

Overrides are organized in a single entry **lib/Scheduler/override/salesforce/AllOverrides.js** which you will only need if you want to generate a
special bundle (e.g. to achieve minimum size). Entry should be imported first.

## Supported Browsers

We decided to only support modern browsers because Salesforce drops old browsers support by the end of 2020. Thus, IE11
and old (non-chromium based) Edge are not supported. 

## Installation

### Prerequisites

* Salesforce CLI

    We will be using it to create Lightning Web Component and upload it to an organization.
    See [this article](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_intro.htm)
    for installation guidance.
    
* Visual Studio Code with [Salesforce Extension Pack](https://marketplace.visualstudio.com/items?itemName=salesforce.salesforcedx-vscode)

### Setup

1. [Enable Dev Hub in Org](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_enable_devhub.htm)

2. Enable [My Domain](https://help.salesforce.com/articleView?id=domain_name_overview.htm&type=5) to use Lightning features

2. Create base directory for Salesforce DX project:
    ```
    mkdir ~/salesforce
    ```
    
3. Create Salesforce DX project via CLI:
    ```
    cd ~/salesforce
    sfdx force:project:create -n BryntumScheduler --manifest
    cd BryntumScheduler
    ```
    Or from VSCode by typing to command palette: `SFDX: Create Project` -> `Standard` -> ...

4. [Authorize an Org](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_auth_web_flow.htm)
    ```
    sfdx force:auth:web:login --setdefaultdevhubusername
    ```
    Or from VSCode by typing to command palette: `SFDX: Authorize a Dev Hub`

5. Create Scratch Org
    ```
    sfdx force:org:create -f config/project-scratch-def.json --setalias BryntumScheduler --durationdays 30 --setdefaultusername
    ```
    Or from VSCode by typing to command palette: `SFDX: Create a Default Scratch Org`

6. Create static resource

    Copy static resource definition from examples directory to Salesforce DX project directory 
    ```
    cp path-to-bryntum-scheduler/examples/salesforce/src/staticresources/bryntum_scheduler.resource-meta.xml \
    ~/salesforce/BryntumScheduler/force-app/main/default/staticresources/bryntum_scheduler.resource-meta.xml
    ```
   
    Create directory for static resource:
    ```
    mkdir ~/salesforce/BryntumScheduler/force-app/main/default/staticresources/bryntum_scheduler
    ```
   
    Copy required sources to the static resource folder, required sources are:
    - JS bundle specific for LWC
    - CSS bundle
    - Locales
    - Fonts
    ```
    cd path-to-bryntum-scheduler/build
    cp -r scheduler.lwc.module.js scheduler.stockholm.css scheduler.stockholm.css.map scheduler.d.ts locales/ fonts/ \
    ~/salesforce/BryntumScheduler/force-app/main/default/staticresources/bryntum_scheduler
    cd ~/salesforce/BryntumScheduler/
    ```

    Push static resource to a default Scratch Org
    ```
    sfdx force:source:push
    ```
    Or from VSCode by typing to command palette: `SFDX: Push Source To Default Scratch Org`
   
7. Create Lightning Web Component

    ```
    sfdx force:lightning:component:create --type lwc -n Grid_component -d force-app\main\default\lwc
    ```
   Or from VSCode by typing to command palette: `SFDX: Create Lightning Web Component`

8. Copy Lightning Web Component code

    ```
    cd path-to-bryntum-scheduler/examples/salesforce/src/lwc/scheduler_component
    cp *.js *.html *.css *.map ~/salesforce/BryntumScheduler/force-app/main/default/lwc/scheduler_component
    cd ~/salesforce/BryntumScheduler/
    ```
   
   Change component definition in `scheduler_component.js-meta.xml` to expose it in the Lightning App Builder:
   ```
   <isExposed>true</isExposed>
   <masterLabel>Bryntum Scheduler</masterLabel>
   <description>Bryntum Scheduler sample</description>
   <targets>
     <target>lightning__AppPage</target>
   </targets>
   ```

9. Push sources to Scratch Org
    
    ```
    sfdx force:source:push
    ```
    Or from VSCode by typing to command palette: `SFDX: Push Source To Default Scratch Org`
    
## Usage

To use web component we should create Lightning Application 

1. Open default org
    ```
    sfdx force:org:open
    ```
    Or from VSCode by typing to command palette: `SFDX: Open Default Org`
    
2. Open the Lightning App Builder, create new Lightning Page. Pick `App Page` then page name and layout.

3. You should see `Bryntum Scheduler` custom component available for the new page. Append it to any region and save.

4. Activate the page. Click `Activation`, navigate to `Lightning Experience` tab and pick Lightning Application to append
this page to. Save the changes.

5. Open the application page. It should be accessible in the app launcher if you click it and type `Bryntum`.

If everything went correctly you should see simple scheduler demo running on the Lightning Page.


## Notes

* Performance is expected to be less than on regular browser page, considering Locker Service impact.
* Performance of the **trial** bundle is expected to be even less for some tasks. For instance, opening a date picker
takes ~12ms on a normal page, ~33ms in Lightning application for release version and ~38ms for trial version.
