'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (propKeys, outputFunction) {
    return function (ComposedComponent) {
        return function (_Component) {
            (0, _inherits3.default)(PropChangeListener, _Component);

            function PropChangeListener(props, context) {
                (0, _classCallCheck3.default)(this, PropChangeListener);
                return (0, _possibleConstructorReturn3.default)(this, (PropChangeListener.__proto__ || (0, _getPrototypeOf2.default)(PropChangeListener)).call(this, props, context));
            }

            (0, _createClass3.default)(PropChangeListener, [{
                key: 'componentWillMount',
                value: function componentWillMount() {
                    outputFunction(this.props);
                }
            }, {
                key: 'componentWillReceiveProps',
                value: function componentWillReceiveProps(nextProps) {
                    // make props immutable Maps
                    var thisPropsImmutable = (0, _immutable.fromJS)(this.props);
                    var nextPropsImmutable = (0, _immutable.fromJS)(nextProps);

                    var booleanTest = propKeys.map(function (ii) {
                        var keyPath = ii.split('.');
                        return thisPropsImmutable.getIn(keyPath) !== nextPropsImmutable.getIn(keyPath);
                    }).indexOf(true);

                    if (booleanTest !== -1) {
                        outputFunction(nextProps);
                    }
                }
            }, {
                key: 'render',
                value: function render() {
                    return _react2.default.createElement(ComposedComponent, this.props);
                }
            }]);
            return PropChangeListener;
        }(_react.Component);
    };
};