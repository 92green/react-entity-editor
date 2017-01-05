'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactModal = require('react-modal');

var _reactModal2 = _interopRequireDefault(_reactModal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ModalContent(props) {
    var title = props.title,
        message = props.message,
        yes = props.yes,
        no = props.no,
        onYes = props.onYes,
        onNo = props.onNo,
        classNames = props.classNames;


    return _react2.default.createElement(
        'div',
        null,
        title && _react2.default.createElement(
            'div',
            { className: classNames.modalTitle },
            title
        ),
        _react2.default.createElement(
            'div',
            { className: classNames.modalBody },
            message,
            _react2.default.createElement(
                'div',
                { className: classNames.modalButtonContainer },
                yes ? _react2.default.createElement(
                    'button',
                    { className: classNames.modalButton, onClick: onYes.bind(this) },
                    yes
                ) : null,
                no ? _react2.default.createElement(
                    'button',
                    { className: classNames.modalButtonSecondary, onClick: onNo.bind(this) },
                    no
                ) : null
            )
        )
    );
}

ModalContent.propTypes = {
    title: _react.PropTypes.string,
    message: _react.PropTypes.any,
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