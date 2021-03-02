/**
 *- Custom event editor test
 */
StartTest(t => {
    t.chain(
        // basic rendering
        { waitForSelector : '.b-timelinebase' },

        // test if popup opens and can save name
        { dblClick : '.b-sch-event:contains("Meeting #1")' },
        { waitForSelector : '.v-dialog [primary-title]:textEquals("Meeting #1")' },
        { click : '.v-dialog label:textEquals("Name") + input' },
        { type : ' is important' },
        { click : '.v-dialog button:textEquals("Save")' },
        { waitForSelector : '.b-sch-event:contains("Meeting #1 is important")' },

        // test if popup can cancel edits
        { dblClick : '.b-sch-event-wrap :contains("Appointment #1")', offset : [80, 10] },
        { waitForSelector : '.v-dialog [primary-title]:textEquals("Appointment #1")' },
        { click : '.v-dialog label:textEquals("Name") + input' },
        { type : ' is important' },
        { click : '.v-dialog button:textEquals("Cancel")' },
        { waitForSelectorNotFound : '.b-sch-event:contains("Meeting #2 is important")' }

    ); // eo t.chain

}); // eo StartTest

// eof
