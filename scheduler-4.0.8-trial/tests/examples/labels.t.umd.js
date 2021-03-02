StartTest(function (t) {
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
  t.it('Edit the duration', function (t) {
    var scheduler, event, duration;
    t.chain({
      waitForSelector: '.b-sch-event-wrap'
    }, function (next) {
      scheduler = bryntum.query('scheduler');
      event = scheduler.eventStore.findByField('name', 'Out of office')[0].data;
      duration = event.duration;
      next();
    }, {
      dblclick: ".b-sch-event-wrap:contains(Out of office) .b-sch-label-left"
    }, // Wait to focus the label feature's left editor
    {
      waitFor: function waitFor() {
        return document.activeElement === scheduler.features.labels.left.editor.inputField.input;
      }
    }, // Spin up
    function (next) {
      t.click(scheduler.features.labels.left.editor.inputField.triggers.spin.upButton, next);
    }, {
      type: '[ENTER]'
    }, function () {
      t.is(event.duration, duration + 1);
    });
  });
});