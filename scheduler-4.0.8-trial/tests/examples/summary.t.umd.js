StartTest(function (t) {
  var scheduler;
  t.it('sanity', function (t) {
    t.chain({
      waitForSelector: '.b-sch-foreground-canvas'
    }, function (next, el) {
      scheduler = bryntum.fromElement(el[0], 'scheduler'); // Make test work.
      // TODO: Fix summary feature leaving cached bodyHeight stale.
      // https://github.com/bryntum/bryntum-suite/issues/631

      scheduler.onHeightChange();
      next();
    }, function () {
      return t.checkGridSanity(scheduler);
    });
  }); // Sequence fails with very quick (faster than a human can do) click sequence after a delete.

  t.it('Monkey-discovered failure vector', function (t) {
    // This should not throw
    t.chain({
      rightclick: [919, 206]
    }, {
      click: [532, 602]
    }, {
      type: '[LEFT][DELETE]'
    }, {
      click: [435, 658]
    });
  });
});