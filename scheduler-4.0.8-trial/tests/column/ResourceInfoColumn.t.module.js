import { EventHelper } from '../../build/scheduler.module.js?447702';

StartTest(t => {
    let scheduler;

    t.beforeEach(() => scheduler && scheduler.destroy());

    t.it('Should show generic image if IMG is not found in list of valid names', async t => {
        scheduler = await t.getSchedulerAsync({
            resources : [
                { name : 'bar' }
            ],
            resourceImagePath : '../examples/_shared/images/users/',
            columns           : [
                {
                    type       : 'resourceInfo',
                    text       : 'Staff',
                    validNames : [
                        'foo'
                    ]
                }
            ]
        }, 1);

        t.chain(
            { waitForSelector : 'img[src*="none.png"]' },
            { waitForTextPresent : '0 events' }
        );
    });

    t.it('Should show generic image if IMG is not found', async t => {
        scheduler = t.getScheduler({
            resources : [
                { name : 'foo' }
            ],
            resourceImagePath : '../examples/_shared/images/users/',
            columns           : [
                {
                    type       : 'resourceInfo',
                    text       : 'Staff',
                    validNames : [
                        'foo'
                    ]
                }
            ]
        }, 1);

        t.isCalledNTimes('setDefaultResourceImage', scheduler.columns.first, 1, 'Default image is set once');

        await t.waitForProjectReady();

        t.chain(
            { waitForSelector : 'img[src*="none.png"]' }
        );
    });

    // https://app.assembla.com/spaces/bryntum/tickets/9127
    t.it('validNames null should allow all names', t => {
        scheduler = t.getScheduler({
            resources : [
                { name : 'foo' }
            ],
            resourceImagePath : '../examples/_shared/images/users/',
            columns           : [
                {
                    type       : 'resourceInfo',
                    text       : 'Staff',
                    validNames : null
                }
            ]
        }, 1);

        t.chain(
            { waitForSelector : 'img[src*="foo.jpg"]' },
            { waitForProjectReady : scheduler } // Dont want to destroy it while calculating, not handled well
        );
    });

    t.it('Should not instantly reload images with invalid resourceImagePath or defaultResourceImageName', async t => {
        let errorCount = 0, detacher;

        const checkResourceImages = (resourceImagePath, defaultResourceImageName, resourceImageExtension, resourceName, checkImageName, checkErrorCount) => [
            async() => {
                errorCount = 0;
                scheduler = t.getScheduler({
                    resources : [
                        { name : resourceName }
                    ],
                    columns : [
                        {
                            type       : 'resourceInfo',
                            validNames : []
                        }
                    ],
                    defaultResourceImageName,
                    resourceImagePath,
                    resourceImageExtension
                }, 1);

                detacher = EventHelper.on({
                    element : scheduler.element,
                    error   : () => errorCount++,
                    capture : true
                });

                await scheduler.project.commitAsync();
            },
            { diag : `path="${resourceImagePath}" default="${defaultResourceImageName}"  extension="${resourceImageExtension}" name="${resourceName}" => ${checkErrorCount} error(s)` },
            { waitForSelector : `img[src="${checkImageName}"]`, desc : `${checkImageName} image found` },
            { waitFor : () => errorCount === checkErrorCount, desc : `Expected amount of errors = ${checkErrorCount}` },
            async() => {
                scheduler.destroy();
                scheduler = null;
                detacher();
            }
        ];

        // Each resource tries to load image by name and if it fails then loads default one
        // Error count depends on name image and default image existence

        const validPath = '../examples/_shared/images/users/';

        t.chain(
            checkResourceImages(validPath, 'none.png', '.jpg', 'Kate', validPath + 'kate.jpg', 0),
            checkResourceImages(validPath, 'none.png', '.png', 'Kate', validPath + 'none.png', 1),
            checkResourceImages(validPath, 'none.png', '.jpg', 'Foo', validPath + 'none.png', 1),
            checkResourceImages(validPath, 'bad.jpg', '.jpg', 'Foo', validPath + 'bad.jpg', 2),
            checkResourceImages('', 'none.png', '.jpg', 'Foo', '/none.png', 2),
            checkResourceImages('..', 'none.png', '.jpg', 'Foo', '../none.png', 2),
            checkResourceImages('../', 'none.png', '.jpg', 'Foo', '../none.png', 2),
            checkResourceImages(validPath, 'none.jpg', '.png', 'None', validPath + 'none.png', 0),
            checkResourceImages('', null, '.png', 'Foo', '/foo.png', 1),
            checkResourceImages('', undefined, '.png', 'Foo', '/foo.png', 1),
            checkResourceImages('', '', '.png', 'Foo', '/foo.png', 1)
        );
    });

    // https://app.assembla.com/spaces/bryntum/tickets/9316
    t.it('Should be possible to specify renderer for ResourceInfoColumn', async t => {
        scheduler = await t.getSchedulerAsync({
            resources : [
                { name : 'foo' }
            ],
            columns : [{
                type  : 'resourceInfo',
                text  : 'Staff',
                field : 'name',
                renderer() {
                    return 'custom';
                }
            }]
        });

        t.waitForSelector('.b-grid-cell:contains(custom)');
    });

    t.it('Should contain resource name in default renderer', async t => {
        scheduler = await t.getSchedulerAsync({
            resources : [
                { name : 'foo' }
            ],
            columns : [{
                type  : 'resourceInfo',
                text  : 'Staff',
                field : 'name'
            }]
        });

        t.waitForSelector('.b-grid-cell:contains(foo)');
    });

    t.it('Should show image by image and imageUrl resource fields', async t => {
        let loadCount = 0;

        document.body.addEventListener('load', e => {
            if (e.target.nodeName.toUpperCase() === 'IMG') {
                loadCount++;
            }
        }, true);

        scheduler = await t.getSchedulerAsync({
            resourceImagePath : '../examples/_shared/images/users/',
            resources         : [
                {
                    age   : 22,
                    name  : 'resource 1',
                    image : 'team.jpg'
                },
                {
                    age      : 88,
                    name     : 'resource 2',
                    imageUrl : '../examples/_shared/images/users/amit.jpg'
                }

            ],
            columns : [
                {
                    field : 'age'
                },
                {
                    autoSyncHtml : false,
                    type         : 'resourceInfo'
                }
            ],
            features : {
                group : 'id'
            }
        }, 1);

        t.chain(
            { waitForSelector : 'img[src*="examples/_shared/images/users/team.jpg"]' },
            { waitForSelector : 'img[src*="examples/_shared/images/users/amit.jpg"]' },

            { waitFor : () => loadCount === 2 },
            async() => document.body.addEventListener('load', () => t.fail('load should not be called after a record update'), true),

            { dblClick : '.b-grid-cell:contains("22")' },
            { type : '42[ENTER]', clearExisting : true },

            { waitFor : 500, desc : 'some to allow the image to load, in case there is a bug in DOM update triggering a reload of the image' },

            async() => t.is(loadCount, 2, 'No load triggered')
        );
    });

});
