'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

exports.default = _react.PropTypes.shape({
    actions: _react.PropTypes.objectOf(_react.PropTypes.func).isRequired,
    operations: _react.PropTypes.objectOf(_react.PropTypes.func).isRequired,
    actionable: _react.PropTypes.bool,
    status: _react.PropTypes.object,
    names: _react.PropTypes.shape({
        item: _react.PropTypes.string,
        items: _react.PropTypes.string,
        Item: _react.PropTypes.string,
        Items: _react.PropTypes.string
    }),
    state: _react.PropTypes.object
});