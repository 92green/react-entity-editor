'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

exports.default = _react.PropTypes.shape({
    actions: _react.PropTypes.objectOf(_react.PropTypes.func).isRequired,
    abilities: _react.PropTypes.objectOf(_react.PropTypes.bool).isRequired,
    status: _react.PropTypes.object
});