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

var ModalContent = function (_Component) {
    _inherits(ModalContent, _Component);

    function ModalContent() {
        _classCallCheck(this, ModalContent);

        return _possibleConstructorReturn(this, (ModalContent.__proto__ || Object.getPrototypeOf(ModalContent)).apply(this, arguments));
    }

    _createClass(ModalContent, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                title = _props.title,
                children = _props.children,
                yes = _props.yes,
                no = _props.no,
                onYes = _props.onYes,
                onNo = _props.onNo,
                classNameTitle = _props.classNameTitle,
                classNameBody = _props.classNameBody,
                classNameButtonContainer = _props.classNameButtonContainer,
                classNameButtonYes = _props.classNameButtonYes,
                classNameButtonNo = _props.classNameButtonNo;


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
                    children,
                    _react2.default.createElement(
                        'div',
                        { className: classNameButtonContainer },
                        no ? _react2.default.createElement(
                            'button',
                            { className: classNameButtonNo, onClick: onNo },
                            no
                        ) : null,
                        yes ? _react2.default.createElement(
                            'button',
                            { className: classNameButtonYes, onClick: onYes },
                            yes
                        ) : null
                    )
                )
            );
        }
    }]);

    return ModalContent;
}(_react.Component);

ModalContent.propTypes = {
    title: _propTypes2.default.string,
    yes: _propTypes2.default.string,
    no: _propTypes2.default.string,
    onYes: _propTypes2.default.func,
    onNo: _propTypes2.default.func,
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