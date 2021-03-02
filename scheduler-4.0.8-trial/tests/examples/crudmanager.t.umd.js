StartTest(function (t) {
  // Use unique cookie session ID per test
  t.setRandomPHPSession();
  var scheduler = bryntum.query('scheduler'),
      crudManager = scheduler.crudManager,
      eventStore = scheduler.eventStore,
      assignmentStore = scheduler.assignmentStore,
      resourceStore = scheduler.resourceStore,
      waitForNoLoadMask = {
    waitForSelectorNotFound: '.b-mask-content',
    desc: 'No loading mask'
  },
      clickResetButton = {
    waitForEvent: [crudManager, 'load'],
    trigger: {
      click: '.b-button[data-ref="resetButton"]'
    },
    desc: 'Data is reset'
  },
      clickLoadButton = {
    waitForEvent: [crudManager, 'load'],
    trigger: {
      click: '.b-button[data-ref="reloadButton"]'
    },
    desc: 'Data is loaded'
  };
  t.it('Should work with single-assigned events', function (t) {
    t.chain(clickResetButton, waitForNoLoadMask, {
      waitForEvent: [crudManager, 'sync'],
      trigger: function trigger() {
        eventStore.add({
          name: 'New added event',
          startDate: eventStore.last.startDate,
          endDate: eventStore.last.endDate
        });
        assignmentStore.add([{
          eventId: eventStore.last.id,
          resourceId: resourceStore.last.id
        }]);
      }
    }, waitForNoLoadMask, {
      waitForSelector: '[data-event-id="10"]',
      desc: 'Added event is rendered'
    }, clickLoadButton, waitForNoLoadMask, {
      waitForSelector: '[data-event-id="10"]',
      desc: 'Added event is still rendered'
    }, clickResetButton, waitForNoLoadMask, {
      waitForSelectorNotFound: '[data-event-id="10"]:not(.b-released)',
      desc: 'Added event is removed'
    });
  });
  t.it('Should work with multi-assigned events', function (t) {
    t.chain(clickResetButton, waitForNoLoadMask, {
      waitForSelector: '[data-event-id="9"][data-resource-id="2"]',
      desc: 'Multi-assigned event exists on resource 2'
    }, {
      waitForSelector: '[data-event-id="9"][data-resource-id="5"]',
      desc: 'Multi-assigned event exists on resource 5'
    }, {
      waitForEvent: [crudManager, 'sync'],
      trigger: function trigger() {
        eventStore.add({
          name: 'New added event (multi-assigned)',
          startDate: eventStore.last.startDate,
          endDate: eventStore.last.endDate
        });
        var eventId = eventStore.last.id;
        assignmentStore.add([{
          eventId: eventId,
          resourceId: 1
        }, {
          eventId: eventId,
          resourceId: 2
        }, {
          eventId: eventId,
          resourceId: 3
        }]);
      },
      desc: 'Adding new multi-assigned event'
    }, waitForNoLoadMask, {
      waitForSelector: '[data-event-id="10"][data-resource-id="1"]',
      desc: 'New multi-assigned event exists on resource 1'
    }, {
      waitForSelector: '[data-event-id="10"][data-resource-id="2"]',
      desc: 'New multi-assigned event exists on resource 2'
    }, {
      waitForSelector: '[data-event-id="10"][data-resource-id="3"]',
      desc: 'New multi-assigned event exists on resource 3'
    }, {
      dblClick: '[data-event-id="10"]',
      desc: 'Show Event edit for event'
    }, {
      click: '.b-chip .b-icon-clear',
      desc: 'Removing resource 1 assignment'
    }, {
      waitForEvent: [crudManager, 'sync'],
      trigger: {
        click: 'button:contains(Save)'
      }
    }, {
      waitForSelectorNotFound: '[data-event-id="10"][data-resource-id="1"]:not(.b-released)',
      desc: 'New multi-assigned event removed from resource 1'
    }, {
      waitForSelector: '[data-event-id="10"][data-resource-id="2"]',
      desc: 'New multi-assigned event exists on resource 2'
    }, {
      waitForSelector: '[data-event-id="10"][data-resource-id="3"]',
      desc: 'New multi-assigned event exists on resource 3'
    });
  }); // https://github.com/bryntum/support/issues/404

  t.it('Should allow to save edited event with now errors', function (t) {
    t.chain(clickResetButton, waitForNoLoadMask, {
      waitForSelectorNotFound: '.b-mask-content',
      desc: 'No loading mask'
    }, {
      dblclick: '[data-event-id=3]'
    }, {
      click: '.b-textfield input[name=name]'
    }, {
      type: 'Test',
      clearExisting: true
    }, {
      click: '.b-button:contains(Save)'
    });
  });
});