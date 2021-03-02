function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/*global DocsBrowserInstance*/

/*eslint no-undef: "error"*/
describe('Open all links in guides and assert correct content + no crashes', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
    var classRecord, _DocsBrowserInstance, navigationTree, records;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _DocsBrowserInstance = DocsBrowserInstance, navigationTree = _DocsBrowserInstance.navigationTree, records = [];
            DocsBrowserInstance.animateScroll = false;
            t.beforeEach( /*#__PURE__*/function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t, cb) {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        classRecord = records.shift();

                        if (!classRecord) {
                          _context.next = 8;
                          break;
                        }

                        // Wipe out the old title to be able to query for page loaded
                        location.hash = classRecord.fullName;
                        t.suppressPassedWaitForAssertion = true;
                        _context.next = 6;
                        return t.waitForSelector("#content[data-id=\"".concat(classRecord.id, "\"]"));

                      case 6:
                        _context.next = 8;
                        return t.waitForSelectorNotFound('.b-mask:contains(Loading),.fiddlePanelResult:empty,[data-error]');

                      case 8:
                        cb();

                      case 9:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x2, _x3) {
                return _ref2.apply(this, arguments);
              };
            }());
            DocsBrowserInstance.onSettingsChange({
              settings: {
                showPublic: true,
                showInternal: true,
                showPrivate: true,
                showInherited: true
              }
            });
            navigationTree.expandAll();
            _context2.next = 7;
            return t.waitForSelectorNotFound('.loading');

          case 7:
            navigationTree.store.traverse(function (classRec) {
              if (classRec.isLeaf && classRec.isGuide) {
                records.push(classRec);
                t.it("Checking ".concat(classRec.id), function (t) {
                  return t.assertDocsLinks(classRecord);
                });
              }
            });

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());