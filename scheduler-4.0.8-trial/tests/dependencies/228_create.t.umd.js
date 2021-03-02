StartTest(function (t) {
  var scheduler;
  t.beforeEach(function (t) {
    scheduler && scheduler.destroy();
    scheduler = t.getScheduler({
      features: {
        dependencies: {
          showTooltip: false
        },
        eventTooltip: false,
        scheduleTooltip: false
      },
      dependencyStore: new DependencyStore(),
      resourceStore: t.getResourceStore2({}, 10)
    }, 10);
  });
  t.it('Should create a dependency in the store after successful drop', function (t) {
    t.firesOk(scheduler, {
      beforedependencycreatedrag: 1,
      dependencycreatedragstart: 1,
      dependencycreatedrop: 1
    });
    t.chain({
      moveCursorTo: '[data-event-id="1"]'
    }, {
      mousedown: '[data-event-id="1"] .b-sch-terminal-right'
    }, {
      moveCursorTo: '[data-event-id="2"]'
    }, function (next) {
      t.is(scheduler.features.dependencies.creationTooltip.constrainTo, null, 'Tooltip not constrained');
      next();
    }, {
      moveCursorTo: '[data-event-id="2"] .b-sch-terminal-left'
    }, {
      mouseup: '[data-event-id="2"] .b-sch-terminal-left'
    }, {
      waitForDependencies: null
    }, function () {
      var dep = scheduler.dependencyStore.first;
      t.expect(dep.fromEvent.name).toBe('Assignment 1');
      t.expect(dep.toEvent.name).toBe('Assignment 2');
      t.expect(dep.type).toBe(2);
      t.expect(dep.fromSide).toBe('right');
      t.expect(dep.toSide).toBe('left');
    });
  });
  t.it('Should not create a dependency if view returns false on beforedrag', function (t) {
    t.firesOk(scheduler, {
      beforedependencycreatedrag: 1,
      dependencycreatedragstart: 0,
      dependencycreatedrop: 0
    });
    scheduler.on('beforedependencycreatedrag', function () {
      return false;
    });
    t.chain({
      moveCursorTo: '.b-sch-event:contains(Assignment 1)'
    }, {
      mousedown: '.b-sch-event:contains(Assignment 1) .b-sch-terminal-right'
    }, {
      moveCursorTo: '.b-sch-event:contains(Assignment 2)'
    }, {
      moveCursorTo: '.b-sch-event:contains(Assignment 2) .b-sch-terminal-left'
    }, {
      mouseup: '.b-sch-event:contains(Assignment 2) .b-sch-terminal-left'
    });
  });
  t.it('Terminals should be hidden in read only mode', function (t) {
    scheduler.readOnly = true;
    t.chain({
      moveCursorTo: '.b-sch-event'
    }, function () {
      t.selectorNotExists('.b-sch-event .b-sch-terminal', 'No terminals');
    });
  });
  t.it('Should not start dependency creation when right clicking on a terminal', function (t) {
    t.firesOk(scheduler, {
      beforedependencycreatedrag: 0,
      dependencycreatedragstart: 0,
      dependencycreatedrop: 0
    });
    t.chain({
      setCursorPosition: [1, 1]
    }, {
      moveCursorTo: '[data-event-id="1"]'
    }, {
      mousedown: '[data-event-id="1"] .b-sch-terminal-right',
      options: {
        button: 2
      }
    }, {
      moveCursorTo: '[data-event-id="2"]'
    }, {
      moveCursorTo: '[data-event-id="2"] .b-sch-terminal-left'
    }, {
      mouseup: '[data-event-id="2"] .b-sch-terminal-left'
    }, function () {
      t.notOk(scheduler.dependencyStore.first, 'no dependencies made');
    });
  });
  t.it('Should not raise an exception when left-clicked start terminal and right-clicked end terminal', function (t) {
    t.firesOk(scheduler, {
      beforedependencycreatedrag: 1,
      dependencycreatedragstart: 1,
      dependencycreatedrop: 1
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
      mousedown: '[data-event-id="2"] .b-sch-terminal-left',
      options: {
        button: 2
      },
      desc: 'rightclicked on end terminal'
    }, {
      mouseup: '[data-event-id="2"] .b-sch-terminal-left'
    }, function () {
      var dep = scheduler.dependencyStore.first;
      t.expect(dep.fromEvent.name).toBe('Assignment 1');
      t.expect(dep.toEvent.name).toBe('Assignment 2');
      t.expect(dep.type).toBe(2);
      t.expect(dep.fromSide).toBe('right');
      t.expect(dep.toSide).toBe('left');
    });
  });
  t.it('View should be scrolled when dependency is dragged to the edge', function (t) {
    scheduler.width = scheduler.height = 400;
    var lineLength;
    var verticalScroller = scheduler.scrollable.element,
        horizontalScroller = scheduler.subGrids.normal.scrollable.element,
        // caching scrollwidth for edge
    horizontalScrollWidth = horizontalScroller.scrollWidth;
    t.chain({
      moveCursorTo: '.b-scheduler'
    }, // For IE, terminals gets lost somehow when resizing and mouse already over event
    {
      moveCursorTo: '[data-event-id="1"]'
    }, {
      mousedown: '[data-event-id="1"] .b-sch-terminal-bottom'
    }, {
      moveMouseTo: '.b-grid-body-container',
      offset: ['50%', '100%-10']
    }, {
      waitFor: function waitFor() {
        return verticalScroller.scrollTop + verticalScroller.clientHeight === verticalScroller.scrollHeight;
      }
    }, {
      moveMouseTo: '.b-grid-body-container',
      offset: ['100%-100', '50%']
    }, function (next) {
      lineLength = document.querySelector('.b-sch-dependency-connector').clientWidth;
      next();
    }, {
      moveMouseTo: '.b-grid-body-container',
      offset: ['100%-30', '50%']
    }, {
      waitFor: function waitFor() {
        return horizontalScroller.scrollLeft + horizontalScroller.clientWidth === horizontalScrollWidth;
      }
    }, function (next) {
      t.isGreater(document.querySelector('.b-sch-dependency-connector').clientWidth, lineLength * 2, 'Line width updated during scrolling');
      next();
    }, {
      moveMouseBy: [[-50, 0]]
    }, {
      moveMouseTo: '.event6',
      offset: ['100%-10', '50%']
    }, {
      moveMouseTo: '.event6 .b-sch-terminal-right'
    }, {
      mouseUp: '.event6 .b-sch-terminal-right'
    }, function () {
      var dep = scheduler.dependencyStore.first;
      t.expect(dep.fromEvent.name).toBe('Assignment 1');
      t.expect(dep.toEvent.name).toBe('Assignment 6');
      t.expect(dep.fromSide).toBe('bottom');
      t.expect(dep.toSide).toBe('right');
    });
  });
});