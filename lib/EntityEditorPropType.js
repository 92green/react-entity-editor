'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _propTypes2.default.shape({
    actions: _propTypes2.default.objectOf(_propTypes2.default.func).isRequired,
    operations: _propTypes2.default.objectOf(_propTypes2.default.func).isRequired,
    actionable: _propTypes2.default.bool,
    status: _propTypes2.default.object,
    names: _propTypes2.default.shape({
        item: _propTypes2.default.string,
        items: _propTypes2.default.string,
        Item: _propTypes2.default.string,
        Items: _propTypes2.default.string
    }),
    state: _propTypes2.default.object
});