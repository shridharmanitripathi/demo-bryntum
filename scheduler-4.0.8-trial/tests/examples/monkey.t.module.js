StartTest(t => {

    // Test setup
    const
        testConfig = t.getConfig(),
        {
            webComponent,
            waitSelector,
            targetSelector,
            skipTargets,
            isPR
        } = testConfig;

    let isFailed;

    // Use unique cookie session ID per test
    t.setRandomPHPSession();

    t.diag('Test PageURL: ' + t.scopeProvider.sourceURL);

    !isPR && t.it('Crazy monkeys', t => {
        function getParams(asObject) {
            let ret = window.top.location.search.substr(1).split('&').filter(function(p) {
                return p;
            });

            if (asObject) {
                ret = ret.reduce(function(prev, curr) {
                    const p = curr.split('=');
                    prev[decodeURIComponent(p[0])] = decodeURIComponent(p[1]);
                    return prev;
                }, {});
            }

            return ret;
        }

        window.top.setMonkeyActions = window.setMonkeyActions = function(actions) {
            const params = getParams();
            let i;

            for (i = 0; i < params.length; ++i) {
                if (params[i].startsWith('monkeyActions=')) {
                    break;
                }
            }

            params[i] = 'monkeyActions=' + encodeURIComponent(JSON.stringify(actions));
            window.top.location.search = '?' + params.join('&');
        };

        const selectorPrefix = webComponent && /webcomponent/.test(t.global.location.href) ? `${webComponent} ->` : '';

        t.waitForSelector(t.global.location.href.includes('websockets') ? '.b-scheduler' : (selectorPrefix + waitSelector), () => {
            function test() {
                t.pass('Example rendered without exception');

                // Play external steps if provided in query string
                if (window.top.location.search.match('monkeyActions')) {
                    // TODO: what is the right thing here?
                    // t.forceTestVisible();

                    const params = getParams(true);
                    t.chain(JSON.parse(params.monkeyActions));
                }
                else {
                    t.monkeyTest({
                        target          : selectorPrefix + targetSelector,
                        skipTargets     : ['#fullscreen-button', '.b-skip-test', '.b-codeeditor'].concat(skipTargets || []),
                        nbrInteractions : 10,
                        callback(actionLog) {
                            isFailed = Boolean(t.nbrExceptions || t.failed);
                            window.monkeyActions = actionLog;
                        }
                    });
                }
            }

            if (document.querySelector('.x-messagebox')) {
                t.click('.x-messagebox .x-button', test);
            }
            else {
                test();
            }
        });
    });

    t.it('Smart monkeys', t => {
        t.smartMonkeys();

        if (isFailed) {
            t.fail('Smart monkeys found error', 'Wild monkey actions: ' + JSON.stringify(window.monkeyActions));
        }
    });
});
