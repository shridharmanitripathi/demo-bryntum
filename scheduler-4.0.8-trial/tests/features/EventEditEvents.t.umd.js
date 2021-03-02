// https://app.assembla.com/spaces/bryntum/tickets/8842
StartTest(function (t) {
  var scheduler;
  t.beforeEach(function (t) {
    scheduler && scheduler.destroy();
    scheduler = null;
  }); //region Should fire beforeclose/beforehide/hide once

  t.it('Should fire beforeclose/beforehide/hide once on cancel click', function (t) {
    scheduler = t.getScheduler({
      appendTo: document.body,
      features: {
        eventTooltip: false,
        eventEdit: true
      }
    });
    var editor = scheduler.features.eventEdit.getEditor();
    t.firesOnce(editor, 'beforeclose');
    t.firesOnce(editor, 'beforehide');
    t.firesOnce(editor, 'hide');
    t.chain({
      dblclick: '.b-sch-event'
    }, {
      click: 'button:textEquals(Cancel)'
    }, {
      waitForSelectorNotFound: '.b-eventeditor:not(.b-hidden)'
    });
  });
  t.it('Should fire beforeclose/beforehide/hide once on delete click', function (t) {
    scheduler = t.getScheduler({
      appendTo: document.body,
      features: {
        eventTooltip: false,
        eventEdit: true
      }
    });
    var editor = scheduler.features.eventEdit.getEditor();
    t.firesOnce(editor, 'beforeclose');
    t.firesOnce(editor, 'beforehide');
    t.firesOnce(editor, 'hide');
    t.chain({
      dblclick: '.b-sch-event'
    }, {
      click: 'button:textEquals(Delete)'
    }, {
      waitForSelectorNotFound: '.b-eventeditor:not(.b-hidden)'
    });
  });
  t.it('Should fire beforeclose/beforehide/hide once on save click', function (t) {
    scheduler = t.getScheduler({
      appendTo: document.body,
      features: {
        eventTooltip: false,
        eventEdit: true
      }
    });
    var editor = scheduler.features.eventEdit.getEditor();
    t.firesOnce(editor, 'beforeclose');
    t.firesOnce(editor, 'beforehide');
    t.firesOnce(editor, 'hide');
    t.chain({
      dblclick: '.b-sch-event'
    }, {
      click: 'button:textEquals(Save)'
    }, {
      waitForSelectorNotFound: '.b-eventeditor:not(.b-hidden)'
    });
  });
  t.it('Should fire beforeclose/beforehide/hide once on Enter click', function (t) {
    scheduler = t.getScheduler({
      appendTo: document.body,
      features: {
        eventTooltip: false,
        eventEdit: true
      }
    });
    var editor = scheduler.features.eventEdit.getEditor();
    t.firesOnce(editor, 'beforeclose');
    t.firesOnce(editor, 'beforehide');
    t.firesOnce(editor, 'hide');
    t.chain({
      dblclick: '.b-sch-event'
    }, {
      click: 'input[name=name]'
    }, {
      type: 'foo[ENTER]'
    }, {
      waitForSelectorNotFound: '.b-eventeditor:not(.b-hidden)'
    });
  });
  t.it('Should fire beforeclose/beforehide/hide once on close icon click', function (t) {
    scheduler = t.getScheduler({
      appendTo: document.body,
      features: {
        eventTooltip: false,
        eventEdit: true
      }
    });
    var editor = scheduler.features.eventEdit.getEditor();
    t.firesOnce(editor, 'beforeclose');
    t.firesOnce(editor, 'beforehide');
    t.firesOnce(editor, 'hide');
    t.chain({
      dblclick: '.b-sch-event'
    }, {
      click: '.b-popup-close'
    }, {
      waitForSelectorNotFound: '.b-eventeditor:not(.b-hidden)'
    });
  });
  t.it('Should fire beforeclose/beforehide/hide once on outside click', function (t) {
    scheduler = t.getScheduler({
      appendTo: document.body,
      features: {
        eventTooltip: false,
        eventEdit: true
      }
    });
    var editor = scheduler.features.eventEdit.getEditor();
    t.firesOnce(editor, 'beforeclose');
    t.firesOnce(editor, 'beforehide');
    t.firesOnce(editor, 'hide');
    t.chain({
      dblclick: '.b-sch-event'
    }, {
      waitForSelector: '.b-eventeditor:not(.b-hidden)'
    }, {
      click: '.b-grid-cell'
    }, {
      waitForSelectorNotFound: '.b-eventeditor:not(.b-hidden)'
    });
  }); //endregion
  //region Should fire beforeclose/beforehide/hide once when autoClose and closable are false

  t.it('Should fire beforeclose/beforehide/hide once on cancel click when autoClose and closable are false', function (t) {
    scheduler = t.getScheduler({
      appendTo: document.body,
      features: {
        eventTooltip: false,
        eventEdit: {
          closable: false,
          autoClose: false
        }
      }
    });
    var editor = scheduler.features.eventEdit.getEditor();
    t.firesOnce(editor, 'beforeclose');
    t.firesOnce(editor, 'beforehide');
    t.firesOnce(editor, 'hide');
    t.chain({
      dblclick: '.b-sch-event'
    }, {
      click: 'button:textEquals(Cancel)'
    }, {
      waitForSelectorNotFound: '.b-eventeditor:not(.b-hidden)'
    });
  });
  t.it('Should fire beforeclose/beforehide/hide once on delete click when autoClose and closable are false', function (t) {
    scheduler = t.getScheduler({
      appendTo: document.body,
      features: {
        eventTooltip: false,
        eventEdit: {
          closable: false,
          autoClose: false
        }
      }
    });
    var editor = scheduler.features.eventEdit.getEditor();
    t.firesOnce(editor, 'beforeclose');
    t.firesOnce(editor, 'beforehide');
    t.firesOnce(editor, 'hide');
    t.chain({
      dblclick: '.b-sch-event'
    }, {
      click: 'button:textEquals(Delete)'
    }, {
      waitForSelectorNotFound: '.b-eventeditor:not(.b-hidden)'
    });
  });
  t.it('Should fire beforeclose/beforehide/hide once on save click when autoClose and closable are false', function (t) {
    scheduler = t.getScheduler({
      appendTo: document.body,
      features: {
        eventTooltip: false,
        eventEdit: {
          closable: false,
          autoClose: false
        }
      }
    });
    var editor = scheduler.features.eventEdit.getEditor();
    t.firesOnce(editor, 'beforeclose');
    t.firesOnce(editor, 'beforehide');
    t.firesOnce(editor, 'hide');
    t.chain({
      dblclick: '.b-sch-event'
    }, {
      click: 'button:textEquals(Save)'
    }, {
      waitForSelectorNotFound: '.b-eventeditor:not(.b-hidden)'
    });
  });
  t.it('Should fire beforeclose/beforehide/hide once on Enter click when autoClose and closable are false', function (t) {
    scheduler = t.getScheduler({
      appendTo: document.body,
      features: {
        eventTooltip: false,
        eventEdit: {
          closable: false,
          autoClose: false
        }
      }
    });
    var editor = scheduler.features.eventEdit.getEditor();
    t.firesOnce(editor, 'beforeclose');
    t.firesOnce(editor, 'beforehide');
    t.firesOnce(editor, 'hide');
    t.chain({
      dblclick: '.b-sch-event'
    }, {
      click: 'input[name=name]'
    }, {
      type: 'foo[ENTER]'
    }, {
      waitForSelectorNotFound: '.b-eventeditor:not(.b-hidden)'
    });
  }); //endregion
  //region Should prevent closing when beforeclose returns false

  t.it('Should prevent closing when beforeclose returns false on cancel click', function (t) {
    var beforeCloseCounter = 0;
    scheduler = t.getScheduler({
      appendTo: document.body,
      features: {
        eventTooltip: false,
        eventEdit: {
          editorConfig: {
            showAnimation: false,
            hideAnimation: false,
            listeners: {
              beforeClose: function beforeClose() {
                beforeCloseCounter++;
                return false;
              }
            }
          }
        }
      }
    });
    var editor = scheduler.features.eventEdit.getEditor();
    t.isntFired(editor, 'beforehide');
    t.isntFired(editor, 'hide');
    t.chain({
      dblclick: '.b-sch-event'
    }, {
      click: 'button:textEquals(Cancel)'
    }, function () {
      t.selectorExists('.b-eventeditor:not(.b-hidden)', 'Editor still visible');
      t.is(beforeCloseCounter, 1, 'beforeclose has been fired once');
    });
  });
  t.it('Should prevent closing when beforeclose returns false on delete click', function (t) {
    var beforeCloseCounter = 0;
    scheduler = t.getScheduler({
      appendTo: document.body,
      features: {
        eventTooltip: false,
        eventEdit: {
          editorConfig: {
            showAnimation: false,
            hideAnimation: false,
            listeners: {
              beforeclose: function beforeclose() {
                beforeCloseCounter++;
                return false;
              }
            }
          }
        }
      }
    });
    var editor = scheduler.features.eventEdit.getEditor(); // See ticket for more info
    // https://app.assembla.com/spaces/bryntum/tickets/8842-beforeclose-event-not-fired-consistently-for-eventeditor/details

    if (!BrowserHelper.isIE11) {
      t.isntFired(editor, 'beforehide');
      t.isntFired(editor, 'hide');
    }

    t.chain({
      dblclick: '.b-sch-event'
    }, {
      click: 'button:textEquals(Delete)'
    }, function () {
      if (!BrowserHelper.isIE11) {
        t.selectorExists('.b-eventeditor:not(.b-hidden)', 'Editor still visible');
      }

      t.is(beforeCloseCounter, 1, 'beforeclose has been fired once');
    });
  });
  t.it('Should prevent closing when beforeclose returns false on save click', function (t) {
    var beforeCloseCounter = 0;
    scheduler = t.getScheduler({
      appendTo: document.body,
      features: {
        eventTooltip: false,
        eventEdit: {
          editorConfig: {
            showAnimation: false,
            hideAnimation: false,
            listeners: {
              beforeClose: function beforeClose() {
                beforeCloseCounter++;
                return false;
              }
            }
          }
        }
      }
    });
    var editor = scheduler.features.eventEdit.getEditor();
    t.isntFired(editor, 'beforehide');
    t.isntFired(editor, 'hide');
    t.chain({
      dblclick: '.b-sch-event'
    }, {
      click: 'button:textEquals(Save)'
    }, function () {
      t.selectorExists('.b-eventeditor:not(.b-hidden)', 'Editor still visible');
      t.is(beforeCloseCounter, 1, 'beforeclose has been fired once');
    });
  });
  t.it('Should prevent closing when beforeclose returns false on Enter click', function (t) {
    var beforeCloseCounter = 0;
    scheduler = t.getScheduler({
      appendTo: document.body,
      features: {
        eventTooltip: false,
        eventEdit: {
          editorConfig: {
            showAnimation: false,
            hideAnimation: false,
            listeners: {
              beforeClose: function beforeClose() {
                beforeCloseCounter++;
                return false;
              }
            }
          }
        }
      }
    });
    var editor = scheduler.features.eventEdit.getEditor();
    t.isntFired(editor, 'beforehide');
    t.isntFired(editor, 'hide');
    t.chain({
      dblclick: '.b-sch-event'
    }, {
      click: 'input[name=name]'
    }, {
      type: 'foo[ENTER]'
    }, function () {
      t.selectorExists('.b-eventeditor:not(.b-hidden)', 'Editor still visible');
      t.is(beforeCloseCounter, 1, 'beforeclose has been fired once');
    });
  });
  t.it('Should prevent closing when beforeclose returns false on close icon click', function (t) {
    var beforeCloseCounter = 0;
    scheduler = t.getScheduler({
      appendTo: document.body,
      features: {
        eventTooltip: false,
        eventEdit: {
          editorConfig: {
            showAnimation: false,
            hideAnimation: false,
            listeners: {
              beforeClose: function beforeClose() {
                beforeCloseCounter++;
                return false;
              }
            }
          }
        }
      }
    });
    var editor = scheduler.features.eventEdit.getEditor();
    t.isntFired(editor, 'beforehide');
    t.isntFired(editor, 'hide');
    t.chain({
      dblclick: '.b-sch-event'
    }, {
      click: '.b-popup-close'
    }, function () {
      t.selectorExists('.b-eventeditor:not(.b-hidden)', 'Editor still visible');
      t.is(beforeCloseCounter, 1, 'beforeclose has been fired once');
    });
  });
  t.it('Should prevent closing when beforeclose returns false on outside click', function (t) {
    var beforeCloseCounter = 0;
    scheduler = t.getScheduler({
      appendTo: document.body,
      features: {
        eventTooltip: false,
        eventEdit: {
          editorConfig: {
            showAnimation: false,
            hideAnimation: false,
            listeners: {
              beforeClose: function beforeClose() {
                beforeCloseCounter++;
                return false;
              }
            }
          }
        }
      }
    });
    var editor = scheduler.features.eventEdit.getEditor();
    t.isntFired(editor, 'beforehide');
    t.isntFired(editor, 'hide');
    t.chain({
      dblclick: '.b-sch-event'
    }, {
      waitForSelector: '.b-eventeditor:not(.b-hidden)'
    }, {
      click: '.b-grid-cell'
    }, function () {
      t.selectorExists('.b-eventeditor:not(.b-hidden)', 'Editor still visible');
      t.is(beforeCloseCounter, 1, 'beforeclose has been fired once');
    });
  }); //endregion

  t.it('Delete should be preventable', function (t) {
    scheduler = t.getScheduler({
      appendTo: document.body,
      features: {
        eventEdit: true
      },
      listeners: {
        beforeEventDelete: function beforeEventDelete() {
          return false;
        }
      }
    });
    t.chain({
      dblClick: '[data-event-id="1"]'
    }, {
      click: 'button:textEquals(Delete)'
    }, function () {
      t.selectorExists('[data-event-id="1"]', 'Element not removed');
      t.ok(scheduler.eventStore.getById(1), 'Record not removed');
    });
  });
});