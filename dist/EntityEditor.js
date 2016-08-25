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

var _EntityEditorHandler = require('./EntityEditorHandler');

var _EntityEditorHandler2 = _interopRequireDefault(_EntityEditorHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
import Modal from 'toyota-styles/lib/components/Modal';
import Loader from 'toyota-styles/lib/components/Loader';
import ErrorMessage from 'toyota-styles/lib/components/ErrorMessage';
*/

//
// EntityEditor higher order component
//
// Default UI for entity editor for modals, headings and error messages
// This component's child component can implement the UI for the editor itself
//

exports.default = function (config) {
    return function (ComposedComponent) {
        var EntityEditor = function (_Component) {
            (0, _inherits3.default)(EntityEditor, _Component);

            function EntityEditor() {
                (0, _classCallCheck3.default)(this, EntityEditor);
                return (0, _possibleConstructorReturn3.default)(this, (EntityEditor.__proto__ || (0, _getPrototypeOf2.default)(EntityEditor)).apply(this, arguments));
            }

            (0, _createClass3.default)(EntityEditor, [{
                key: 'render',


                //
                // render
                //

                value: function render() {
                    var _props = this.props;
                    var reading = _props.reading;
                    var isNew = _props.isNew;
                    var readError = _props.readError;
                    var children = _props.children;


                    if (reading) {
                        return _react2.default.createElement(Loader, null);
                    }

                    if (readError) {
                        return _react2.default.createElement(ErrorMessage, { message: readError.get('message') });
                    }

                    return _react2.default.createElement(
                        'div',
                        null,
                        this.renderHeading(),
                        _react2.default.createElement(ComposedComponent, this.props),
                        this.renderModal()
                    );
                }
            }, {
                key: 'renderHeading',
                value: function renderHeading() {
                    if (!this.props.showHeading) {
                        return null;
                    }
                    return _react2.default.createElement(this.props.headingTag, { className: 'hug-top' }, this.props.actionName(['titleCase']) + ' ' + this.props.entityName(['first']));
                }
            }, {
                key: 'renderModal',
                value: function renderModal() {
                    if (!this.props.prompt) {
                        return null;
                    }

                    var _props$prompt = this.props.prompt;
                    var title = _props$prompt.title;
                    var message = _props$prompt.message;
                    var status = _props$prompt.status;
                    var type = _props$prompt.type;
                    var yes = _props$prompt.yes;
                    var no = _props$prompt.no;
                    var onYes = _props$prompt.onYes;
                    var onNo = _props$prompt.onNo;


                    if (type == "error") {
                        return _react2.default.createElement(
                            Modal,
                            {
                                isOpen: true,
                                onRequestClose: this.props.closePrompt,
                                title: title,
                                yes: yes,
                                no: no || null,
                                onYes: onYes,
                                onNo: onNo || null },
                            _react2.default.createElement(ErrorMessage, {
                                title: title,
                                code: status,
                                message: message
                            })
                        );
                    }

                    return _react2.default.createElement(
                        Modal,
                        {
                            isOpen: true,
                            onRequestClose: this.props.closePrompt,
                            title: title,
                            yes: yes,
                            no: no || null,
                            onYes: onYes,
                            onNo: onNo || null },
                        _react2.default.createElement(
                            'p',
                            null,
                            message
                        )
                    );
                }
            }]);
            return EntityEditor;
        }(_react.Component);

        EntityEditor.propTypes = {
            // id and abilites
            id: _react.PropTypes.any, // (editor will edit item if this is set, or create new if this is not set)
            willCopy: _react.PropTypes.bool,
            isNew: _react.PropTypes.bool,
            canSave: _react.PropTypes.bool,
            canDelete: _react.PropTypes.bool,
            // props from entity editor - prompts
            prompt: _react.PropTypes.object,
            closePrompt: _react.PropTypes.func,
            // data transaction states
            reading: _react.PropTypes.bool,
            creating: _react.PropTypes.bool,
            updating: _react.PropTypes.bool,
            deleting: _react.PropTypes.bool,
            saving: _react.PropTypes.bool,
            fetching: _react.PropTypes.bool,
            // errors
            readError: _react.PropTypes.any,
            writeError: _react.PropTypes.any,
            // permissions
            permitCreate: _react.PropTypes.bool,
            permitUpdate: _react.PropTypes.bool,
            permitDelete: _react.PropTypes.bool,
            // props from entity editor - callbacks
            onSave: _react.PropTypes.func,
            onClose: _react.PropTypes.func,
            onDelete: _react.PropTypes.func,
            onReset: _react.PropTypes.func,
            onGotoEdit: _react.PropTypes.func,
            // after callbacks - fired on success, must each return a resolve promise
            afterRead: _react.PropTypes.func,
            afterCreate: _react.PropTypes.func,
            afterUpdate: _react.PropTypes.func,
            afterDelete: _react.PropTypes.func,
            afterClose: _react.PropTypes.func,
            // naming
            entityName: _react.PropTypes.func,
            actionName: _react.PropTypes.func,
            // options
            showHeading: _react.PropTypes.bool,
            headingTag: _react.PropTypes.string
        };

        EntityEditor.defaultProps = {
            showHeading: true,
            headingTag: "h1"
        };

        return (0, _EntityEditorHandler2.default)()(EntityEditor);
    };
};