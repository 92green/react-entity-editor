'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _EntityEditorLoader = require('./EntityEditorLoader');

var _EntityEditorLoader2 = _interopRequireDefault(_EntityEditorLoader);

var _EntityEditorHock = require('./EntityEditorHock');

var _EntityEditorHock2 = _interopRequireDefault(_EntityEditorHock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
    var userConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return function (ComposedComponent) {

        function EntityEditorList(props) {
            return _react2.default.createElement(ComposedComponent, props);
        }

        var withLoader = (0, _EntityEditorLoader2.default)("list", userConfig);
        var withHock = (0, _EntityEditorHock2.default)(userConfig);
        return withLoader(withHock(EntityEditorList));
    };
};