'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _EntityEditorConfig = require('./config/EntityEditorConfig');

var _EntityEditorConfig2 = _interopRequireDefault(_EntityEditorConfig);

var _EntityEditorHock = require('./EntityEditorHock');

var _EntityEditorHock2 = _interopRequireDefault(_EntityEditorHock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (config) {
    _EntityEditorConfig2.default.validate(config);

    return function (ComposedComponent) {

        function EntityEditorList(props) {
            return _react2.default.createElement(ComposedComponent, props);
        }

        var withHock = (0, _EntityEditorHock2.default)({
            config: config
        });

        return withHock(EntityEditorList);
    };
};