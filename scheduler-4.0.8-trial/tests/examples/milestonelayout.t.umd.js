StartTest(function (t) {
  var selector = '[data-event-id="2"]';
  bryntum.query('scheduler').enableEventAnimations = false;
  var scheduler;
  t.it('sanity', function (t) {
    t.chain({
      waitForSelector: '.b-sch-foreground-canvas'
    }, function (next, el) {
      scheduler = bryntum.fromElement(el[0], 'scheduler');
      next();
    }, function () {
      return t.checkGridSanity(scheduler);
    });
  });
  t.it('sizes', function (t) {
    t.chain({
      waitForSelector: '.b-sch-event'
    }, {
      click: '.b-combo'
    }, {
      click: '.b-list-item:contains(Default)'
    }, function (next) {
      t.isApprox(document.querySelector(selector + ' .b-sch-event').getBoundingClientRect().width, 40, 'Correct width');
      next();
    }, {
      click: '.b-combo'
    }, {
      click: '.b-list-item:contains(Estimate)'
    }, function (next) {
      t.isApprox(document.querySelector(selector).getBoundingClientRect().width, 240, 'Correct width');
      next();
    }, {
      click: '.b-combo'
    }, {
      click: '.b-list-item:contains(Data)'
    }, function (next) {
      t.isApprox(document.querySelector(selector).getBoundingClientRect().width, 200, 'Correct width');
      next();
    }, {
      click: '.b-combo'
    }, {
      click: '.b-list-item:contains(Measure)'
    }, function () {
      t.isApprox(document.querySelector(selector).getBoundingClientRect().width, 185, 'Correct width');
    });
  });
});