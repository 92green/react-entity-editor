'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ModalContent = function (_React$Component) {
    _inherits(ModalContent, _React$Component);

    function ModalContent() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, ModalContent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ModalContent.__proto__ || Object.getPrototypeOf(ModalContent)).call.apply(_ref, [this].concat(args))), _this), _this.onNo = function () {
            _this.props.nextSteps.onNo();
        }, _this.onYes = function () {
            _this.props.nextSteps.onYes();
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(ModalContent, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                classNameTitle = _props.classNameTitle,
                classNameBody = _props.classNameBody,
                classNameButtonContainer = _props.classNameButtonContainer,
                classNameButtonYes = _props.classNameButtonYes,
                classNameButtonNo = _props.classNameButtonNo,
                _props$status = _props.status,
                title = _props$status.title,
                message = _props$status.message,
                yes = _props$status.yes,
                no = _props$status.no;


            return _react2.default.createElement(
                'div',
                null,
                title && _react2.default.createElement(
                    'div',
                    { className: classNameTitle },
                    title
                ),
                _react2.default.createElement(
                    'div',
                    { className: classNameBody },
                    message,
                    _react2.default.createElement(
                        'div',
                        { className: classNameButtonContainer },
                        no && _react2.default.createElement(
                            'button',
                            { className: classNameButtonNo, onClick: this.onNo },
                            no
                        ),
                        yes && _react2.default.createElement(
                            'button',
                            { className: classNameButtonYes, onClick: this.onYes },
                            yes
                        )
                    )
                )
            );
        }
    }]);

    return ModalContent;
}(_react2.default.Component);

ModalContent.propTypes = {
    status: _propTypes2.default.shape({
        title: _propTypes2.default.node,
        message: _propTypes2.default.node,
        yes: _propTypes2.default.node,
        no: _propTypes2.default.node
    }),
    step: _propTypes2.default.shape({
        onYes: _propTypes2.default.func,
        onNo: _propTypes2.default.func
    }),
    classNameTitle: _propTypes2.default.string,
    classNameBody: _propTypes2.default.string,
    classNameButtonContainer: _propTypes2.default.string,
    classNameButton: _propTypes2.default.string,
    classNameButtonNo: _propTypes2.default.string
};
ModalContent.defaultProps = {
    classNameTitle: "Modal_title",
    classNameBody: "Modal_body",
    classNameButtonContainer: "Modal_buttonContainer",
    classNameButtonYes: "Button Button-primary",
    classNameButtonNo: "Button Button-secondary"
};
exports.default = ModalContent;