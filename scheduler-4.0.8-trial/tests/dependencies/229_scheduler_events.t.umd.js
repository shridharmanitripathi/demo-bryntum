StartTest(function (t) {
  var scheduler;
  t.beforeEach(function () {
    scheduler && scheduler.destroy();
    scheduler = t.getScheduler({
      dependencyStore: new DependencyStore(),
      resourceStore: t.getResourceStore2({}, 10)
    }, 10);
  });
  t.it('Correct events fired on valid drag/drop', function (t) {
    t.firesOk(scheduler, {
      'beforedependencycreatedrag': 1,
      'dependencycreatedragstart': 1,
      'dependencycreatedrop': 1,
      'afterdependencycreatedrop': 1
    });
    t.chain({
      moveCursorTo: '[data-event-id="1"]'
    }, {
      mousedown: '[data-event-id="1"] .b-sch-terminal-right'
    }, {
      moveCursorTo: '[data-event-id="2"]'
    }, {
      moveCursorTo: '[data-event-id="2"] .b-sch-terminal-left'
    }, {
      mouseup: '[data-event-id="2"] .b-sch-terminal-left'
    });
  });
  t.it('Correct events fired on invalid drag/drop', function (t) {
    t.firesOk(scheduler, {
      'beforedependencycreatedrag': 1,
      'dependencycreatedragstart': 1,
      'dependencycreatedrop': 0,
      'afterdependencycreatedrop': 1
    });
    t.chain({
      moveCursorTo: '.b-sch-event:contains(Assignment 1)'
    }, {
      mousedown: '.b-sch-event:contains(Assignment 1) .b-sch-terminal-right'
    }, {
      moveCursorTo: '.b-sch-event:contains(Assignment 2)'
    }, {
      mouseup: '.b-sch-event:contains(Assignment 2)'
    });
  });
});