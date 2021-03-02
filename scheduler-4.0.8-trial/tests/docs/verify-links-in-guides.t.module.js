/*global DocsBrowserInstance*/
/*eslint no-undef: "error"*/

describe('Open all links in guides and assert correct content + no crashes', async t => {

    let classRecord;
    const
        { navigationTree } = DocsBrowserInstance,
        records            = [];

    DocsBrowserInstance.animateScroll = false;

    t.beforeEach(async(t, cb) => {
        classRecord = records.shift();

        if (classRecord) {
            // Wipe out the old title to be able to query for page loaded
            location.hash = classRecord.fullName;

            t.suppressPassedWaitForAssertion = true;

            await t.waitForSelector(`#content[data-id="${classRecord.id}"]`);
            await t.waitForSelectorNotFound('.b-mask:contains(Loading),.fiddlePanelResult:empty,[data-error]');
        }

        cb();
    });

    DocsBrowserInstance.onSettingsChange({
        settings : {
            showPublic    : true,
            showInternal  : true,
            showPrivate   : true,
            showInherited : true
        }
    });

    navigationTree.expandAll();

    await t.waitForSelectorNotFound('.loading');

    navigationTree.store.traverse(classRec => {
        if (classRec.isLeaf && classRec.isGuide) {
            records.push(classRec);

            t.it(`Checking ${classRec.id}`, t => t.assertDocsLinks(classRecord));
        }
    });
});
