function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

new Button({
  appendTo: targetElement,
  text: 'Click me for a riddle!',
  onClick: function () {
    var _onClick = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {
      var btn, result;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              btn = _ref.source;
              _context.next = 3;
              return MessageDialog.confirm({
                title: 'The big question',
                message: 'Do one legged ducks swim in circles?'
              });

            case 3:
              result = _context.sent;
              Toast.show("You answered ".concat(result === MessageDialog.yesButton ? 'Yes' : 'No'));

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function onClick(_x) {
      return _onClick.apply(this, arguments);
    }

    return onClick;
  }()
});