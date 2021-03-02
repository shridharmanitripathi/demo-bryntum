StartTest(t => {
    let document;
    t.setWindowSize(1024, 768);

    t.beforeEach((t, next) => {
        document = t.global.document;
        t.waitForSelector('.example', next);
    });

    t.it('Should initially scroll section into view if provided in hash', t => {
        const href = t.global.location.href;
        t.chain(
            {
                waitForPageLoad : null,
                trigger         : () => t.global.location.href = 'about:blank',
                desc            : `Clean the page`
            },
            {
                waitForPageLoad : null,
                trigger         : () => {
                    t.global.location.href = `${href}#example-eventmenu`;
                },
                desc : `Reload the page with hash`
            },
            { waitForElementTop : '#b-example-eventmenu' }
        );
    });

    t.it('Rendering', t => {
        t.chain(
            next => {
                const example = document.querySelector('#b-example-basic');
                example.scrollIntoView();

                t.isGreater(document.querySelectorAll('.example').length, 5, 'A bunch of examples displayed');
                t.isGreater(document.querySelectorAll('h2').length, 5, 'A bunch of headers displayed');

                const
                    link  = example.href,
                    valid = link.match('basic$') || link.match('basic/bundle.htm$');

                t.ok(valid, 'First link looks correct');

                const browserEl = document.getElementById('browser');

                t.ok(browserEl.scrollHeight > browserEl.clientHeight, 'Browser element is scrollable');

                next();
            },

            { moveCursorTo : '#b-example-basic .tooltip' },
            { waitForSelector : '.b-tooltip:contains(Basic demo)', desc : 'Example tip shown' }
        );
    });

    t.it('Changing theme', t => {
        t.chain(
            // Items are lazy loaded
            { waitFor : () => t.global.shared.infoButton.menuItems, desc : 'Info button items are loaded' },
            // Theme defaults to material, by using ?theme=material on url
            { waitFor : () => document.querySelector('#b-example-basic img').src.toLowerCase().match('thumb.material.png$') },
            // First item should not be a default theme since popup won't be hidden
            ['Classic-Dark', 'Classic', 'Classic-Light', 'Material', 'Stockholm'].map(theme => [
                { click : '[data-ref=infoButton]', desc : 'Click on the cog' },
                { click : '[data-ref=themeCombo]', desc : 'Click on the theme combo' },
                { click : `.b-list-item:contains(${theme})`, desc : `Switching to ${theme} theme` },
                { click : 'header' },
                { waitForSelector : `#b-example-basic img[src="basic/meta/thumb.${theme.toLowerCase()}.png"]`, desc : 'Correct thumb image for basic example' }
            ])
        );
    });

    t.it('Check thumbnail sizes', t => {
        const steps = [];
        document.querySelectorAll('.example').forEach(example => {
            steps.push({
                waitFor : () => {
                    const
                        img  = document.querySelector(`#${example.id} img`),
                        rect = img.getBoundingClientRect();
                    return t.samePx(rect.width, t.bowser.msie ? 256 : 275, 10) && t.samePx(rect.height, t.bowser.msie ? 192 : 206, 10);
                },
                desc : `Correct image size for: "${example.id}"`
            });
        });
        t.chain(steps);
    });

    t.it('Check tooltips for examples not available offline', t => {
        t.chain(
            { scrollIntoView : '#b-example-ionic-ionic-4' },
            { waitForSelector : '#b-example-ionic-ionic-4 i.b-fa-cog', desc : 'Correct info icon used' },
            { moveCursorTo : '#b-example-ionic-ionic-4 .tooltip' },
            {
                waitForSelector : '.b-tooltip-content:contains(This demo needs to be built before it can be viewed)',
                desc            : 'Tooltip shown'
            },
            { moveCursorTo : 'label.title', desc : 'Hiding tooltip to avoid aborting requests' },
            { waitForSelectorNotFound : '.b-tooltip', desc : 'Tooltip hidden' }
        );
    });

});
