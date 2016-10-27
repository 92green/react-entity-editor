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

var _reactModal = require('react-modal');

var _reactModal2 = _interopRequireDefault(_reactModal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Modal = function (_Component) {
    (0, _inherits3.default)(Modal, _Component);

    function Modal() {
        (0, _classCallCheck3.default)(this, Modal);
        return (0, _possibleConstructorReturn3.default)(this, (Modal.__proto__ || (0, _getPrototypeOf2.default)(Modal)).apply(this, arguments));
    }

    (0, _createClass3.default)(Modal, [{
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
            var _props = this.props;
            var children = _props.children;
            var isOpen = _props.isOpen;
            var onAfterOpen = _props.onAfterOpen;
            var onRequestClose = _props.onRequestClose;
            var title = _props.title;
            var yes = _props.yes;
            var no = _props.no;
            var onYes = _props.onYes;
            var onNo = _props.onNo;


            return _react2.default.createElement(
                _reactModal2.default,
                {
                    isOpen: isOpen,
                    onAfterOpen: onAfterOpen,
                    onRequestClose: this.onNo.bind(this),
                    className: 'Modal_content',
                    overlayClassName: 'Modal' },
                title && _react2.default.createElement(
                    'div',
                    { className: 'Modal_title' },
                    title
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'Modal_body' },
                    children,
                    _react2.default.createElement(
                        'div',
                        { className: 'Modal_buttons' },
                        no ? _react2.default.createElement(
                            'a',
                            { className: 'Button Button-grey ', onClick: this.onNo.bind(this) },
                            no
                        ) : null,
                        yes ? _react2.default.createElement(
                            'a',
                            { className: 'Button', onClick: this.onYes.bind(this) },
                            yes
                        ) : null
                    )
                )
            );
        }
    }]);
    return Modal;
}(_react.Component);

Modal.propTypes = {
    // props for react modal
    isOpen: _react.PropTypes.bool,
    onAfterOpen: _react.PropTypes.func,
    onRequestClose: _react.PropTypes.func,
    // props for this component
    title: _react.PropTypes.string,
    yes: _react.PropTypes.string,
    no: _react.PropTypes.string,
    onYes: _react.PropTypes.func,
    onNo: _react.PropTypes.func,
    type: _react.PropTypes.string
};

Modal.defaultProps = {
    title: 'Message',
    yes: 'Okay',
    no: null
};

exports.default = Modal;