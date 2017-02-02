'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactModal = require('react-modal');

var _reactModal2 = _interopRequireDefault(_reactModal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Modal = function (_Component) {
    _inherits(Modal, _Component);

    function Modal() {
        _classCallCheck(this, Modal);

        return _possibleConstructorReturn(this, (Modal.__proto__ || Object.getPrototypeOf(Modal)).apply(this, arguments));
    }

    _createClass(Modal, [{
        key: 'onYes',
        value: function onYes() {
            this.props.onRequestClose();
            if (this.props.onYes) {
                setTimeout(this.props.onYes, 1);
                // when onYes causes entity editor to unmount, if we call this synchronously then react-modal doesn't unmount properly causing a React invariant error
            }
        }
    }, {
        key: 'onNo',
        value: function onNo() {
            this.props.onRequestClose();
            if (this.props.onNo) {
                setTimeout(this.props.onNo, 1);
                // when onNo causes entity editor to unmount, if we call this synchronously then react-modal doesn't unmount properly causing a React invariant error
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                children = _props.children,
                open = _props.open,
                title = _props.title,
                no = _props.no,
                onYes = _props.onYes,
                onNo = _props.onNo,
                classNames = _props.classNames;


            var propsForChildren = {
                onYes: this.onYes.bind(this),
                onNo: this.onNo.bind(this)
            };

            delete propsForChildren.open;
            delete propsForChildren.onRequestClose;

            var childrenWithProps = _react2.default.Children.map(children, function (kid) {
                return _react2.default.cloneElement(kid, propsForChildren);
            });

            return _react2.default.createElement(_reactModal2.default, {
                isOpen: open,
                onRequestClose: this.onNo.bind(this),
                className: classNames.modalContent,
                overlayClassName: classNames.modal,
                contentLabel: title || (no ? "Confirm" : "Alert"),
                children: childrenWithProps
            });
        }
    }]);

    return Modal;
}(_react.Component);

Modal.propTypes = {
    open: _react.PropTypes.bool,
    title: _react.PropTypes.string,
    yes: _react.PropTypes.string,
    no: _react.PropTypes.string,
    onYes: _react.PropTypes.func,
    onNo: _react.PropTypes.func,
    onRequestClose: _react.PropTypes.func,
    classNames: _react.PropTypes.shape({
        modal: _react.PropTypes.string,
        modalContent: _react.PropTypes.string
    })
};

Modal.defaultProps = {
    classNames: {
        modal: "Modal",
        modalContent: "Modal_content",
        modalTitle: "Modal_title",
        modalBody: "Modal_body",
        modalButtonContainer: "Modal_buttonContainer",
        modalButton: "Button",
        modalButtonSecondary: "Button Button-grey"
    }
};

exports.default = Modal;