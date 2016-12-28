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
                open = _props.open,
                title = _props.title,
                message = _props.message,
                yes = _props.yes,
                no = _props.no;


            return _react2.default.createElement(
                _reactModal2.default,
                {
                    isOpen: open,
                    onRequestClose: this.onNo.bind(this),
                    className: 'Modal_content',
                    overlayClassName: 'Modal',
                    contentLabel: title || (no ? "Confirm" : "Alert") },
                title && _react2.default.createElement(
                    'div',
                    { className: 'Modal_title' },
                    title
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'Modal_body' },
                    message,
                    _react2.default.createElement(
                        'div',
                        { className: 'Modal_buttons' },
                        yes ? _react2.default.createElement(
                            'a',
                            { className: 'Button', onClick: this.onYes.bind(this) },
                            yes
                        ) : null,
                        no ? _react2.default.createElement(
                            'a',
                            { className: 'Button Button-grey', onClick: this.onNo.bind(this) },
                            no
                        ) : null
                    )
                )
            );
        }
    }]);

    return Modal;
}(_react.Component);

Modal.propTypes = {
    message: _react.PropTypes.any,
    title: _react.PropTypes.string,
    yes: _react.PropTypes.string,
    no: _react.PropTypes.string,
    open: _react.PropTypes.bool,
    onYes: _react.PropTypes.func,
    onNo: _react.PropTypes.func,
    onRequestClose: _react.PropTypes.func
};

exports.default = Modal;