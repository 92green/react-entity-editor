"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

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
        key: "render",
        value: function render() {
            var _props = this.props,
                title = _props.title,
                children = _props.children,
                yes = _props.yes,
                no = _props.no,
                onYes = _props.onYes,
                onNo = _props.onNo,
                classNames = _props.classNames;


            return _react2.default.createElement(
                "div",
                null,
                title && _react2.default.createElement(
                    "div",
                    { className: classNames.modalTitle },
                    title
                ),
                _react2.default.createElement(
                    "div",
                    { className: classNames.modalBody },
                    children,
                    _react2.default.createElement(
                        "div",
                        { className: classNames.modalButtonContainer },
                        yes ? _react2.default.createElement(
                            "button",
                            { className: classNames.modalButton, onClick: onYes },
                            yes
                        ) : null,
                        no ? _react2.default.createElement(
                            "button",
                            { className: classNames.modalButtonSecondary, onClick: onNo },
                            no
                        ) : null
                    )
                )
            );
        }
    }]);

    return ModalContent;
}(_react.Component);

ModalContent.propTypes = {
    title: _react.PropTypes.string,
    yes: _react.PropTypes.string,
    no: _react.PropTypes.string,
    onYes: _react.PropTypes.func,
    onNo: _react.PropTypes.func,
    classNames: _react.PropTypes.shape({
        modalTitle: _react.PropTypes.string,
        modalBody: _react.PropTypes.string,
        modalButtonContainer: _react.PropTypes.string,
        modalButton: _react.PropTypes.string,
        modalButtonSecondary: _react.PropTypes.string
    })
};

ModalContent.defaultProps = {
    classNames: {
        modalTitle: "Modal_title",
        modalBody: "Modal_body",
        modalButtonContainer: "Modal_buttonContainer",
        modalButton: "Button",
        modalButtonSecondary: "Button Button-grey"
    }
};

exports.default = ModalContent;