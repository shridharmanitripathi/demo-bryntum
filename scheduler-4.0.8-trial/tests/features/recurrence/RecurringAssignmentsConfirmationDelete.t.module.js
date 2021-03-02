StartTest(t => {
    let scheduler;

    t.beforeEach(() => {
        scheduler && scheduler.destroy();
    });

    t.it('Should remove occurrences when assignmentStore is used', async t => {
        scheduler = await t.getSchedulerAsync({
            enableRecurringEvents : true,
            events                : [
                {
                    id             : 1,
                    startDate      : '2011-01-03 12:00',
                    endDate        : '2011-01-03 18:00',
                    recurrenceRule : 'FREQ=DAILY;INTERVAL=1',
                    cls            : 'event1'
                }
            ],
            assignments : [
                { id : 1, resourceId : 'r1', eventId : 1 }
            ]
        });

        const
            event = scheduler.eventStore.first,
            occurrenceId = event.occurrences[1].id;

        t.chain(
            { click : `[data-event-id="${occurrenceId}"]` },

            { type : '[DELETE]' },

            { click : '.b-popup button:contains(Only)' },

            { waitForSelectorNotFound : `${scheduler.unreleasedEventSelector}[data-event-id="${occurrenceId}"]`, desc : 'Occurrence removed' }
        );
    });
});
