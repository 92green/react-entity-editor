'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _EntityEditorLoader = require('./EntityEditorLoader');

var _EntityEditorLoader2 = _interopRequireDefault(_EntityEditorLoader);

var _EntityEditorHock = require('./EntityEditorHock');

var _EntityEditorHock2 = _interopRequireDefault(_EntityEditorHock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
    var userConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var fetchComponent = userConfig.fetchComponent,
        errorComponent = userConfig.errorComponent,
        promptComponent = userConfig.promptComponent,
        _userConfig$receivedW = userConfig.receivedWhen,
        receivedWhen = _userConfig$receivedW === undefined ? function (props) {
        return !!props.list;
    } : _userConfig$receivedW;


    return function (ComposedComponent) {

        function EntityEditorList(props) {
            return _react2.default.createElement(ComposedComponent, props);
        }

        var withLoader = (0, _EntityEditorLoader2.default)({
            fetchComponent: fetchComponent,
            errorComponent: errorComponent,
            receivedWhen: receivedWhen
        });

        var withHock = (0, _EntityEditorHock2.default)(_extends({}, userConfig, {
            promptComponent: promptComponent
        }));

        return withLoader(withHock(EntityEditorList));
    };
};