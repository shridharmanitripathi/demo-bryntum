StartTest(function (t) {
  var scheduler = bryntum.query('scheduler'),
      combo = scheduler.widgetMap.presetCombo;
  t.it('sanity', function (t) {
    t.chain({
      waitForSelector: '.b-sch-foreground-canvas'
    }, function () {
      return t.checkGridSanity(scheduler);
    });
  });
  t.it('Event editor should work', function (t) {
    var eventEdit = scheduler.features.eventEdit,
        chain = [],
        addStep = function addStep(event) {
      chain.push(function (next) {
        eventEdit.editEvent(event);
        next();
      }, {
        waitForElementVisible: '.b-eventeditor'
      }, // The min/max checking must not invalidate
      // valid field values.
      function (next) {
        t.selectorNotExists('.b-invalid');
        next();
      }, BrowserHelper.isIE11 ? {
        click: '.b-button:contains(Cancel)'
      } : {
        type: '[ESC]'
      });
    };

    scheduler.eventStore.forEach(addStep);
    t.chain(chain);
  });
  t.it('Preset combo works', function (t) {
    if (!combo) {
      t.exit('Preset combo not found  ');
    }

    t.ok(combo.isVisible, 'Combo is visible');
    t.is(combo.store.count, 11, 'Combo has correct number of items');
    t.chain( // Collect steps for each item
    combo.store.map(function (rec, index) {
      return [{
        click: '[data-ref=presetCombo]',
        desc: "Combo ".concat(index + 1, " clicked")
      }, {
        waitForEvent: [scheduler, 'presetchange'],
        trigger: {
          click: ".b-list-item[data-index=\"".concat(index, "\"][data-id=\"").concat(rec.id, "\"]")
        }
      }, function (next) {
        // https://github.com/bryntum/support/issues/2121
        // Going from text being wrapped->unwrapped or vice versa fooled DomSync.
        // Text was left behind in cells from previous rendering.
        // All cell text is wrapped now.
        Array.from(document.querySelectorAll('.b-sch-header-row.b-lowest .b-sch-header-timeaxis-cell')).forEach(function (cell) {
          t.isLessOrEqual(cell.scrollWidth, scheduler.tickSize);
        });
        t.is(combo.value, rec.id);
        next();
      }];
    }));
  });
});