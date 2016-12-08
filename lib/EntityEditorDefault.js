'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _EntityEditor = require('./EntityEditor');

var _EntityEditor2 = _interopRequireDefault(_EntityEditor);

var _Modal = require('./Modal');

var _Modal2 = _interopRequireDefault(_Modal);

var _TextDefaults = require('./TextDefaults');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//
// EntityEditorDefault higher order component
//
// Default UI for entity editor for modals, headings and error messages
// This component's child component can implement the UI for the editor itself
//
// EntityEditorDefault is just an example, you are encouraged to create your own custom 'EntityEditorXYZ' for your own projects
//

exports.default = function (config) {
    return function (ComposedComponent) {
        var EntityEditorDefault = function (_Component) {
            _inherits(EntityEditorDefault, _Component);

            function EntityEditorDefault() {
                _classCallCheck(this, EntityEditorDefault);

                return _possibleConstructorReturn(this, (EntityEditorDefault.__proto__ || Object.getPrototypeOf(EntityEditorDefault)).apply(this, arguments));
            }

            _createClass(EntityEditorDefault, [{
                key: 'render',


                //
                // render
                //

                value: function render() {
                    if (this.props.isReading) {
                        return _react2.default.createElement(
                            'p',
                            null,
                            'Loading...'
                        );
                    }

                    if (this.props.errorOnRead) {
                        return _react2.default.createElement(
                            'p',
                            null,
                            'Error: ',
                            this.props.errorOnRead.message
                        );
                    }

                    var propsToRemove = _immutable.List.of(
                    // prompts
                    'prompt', 'closePrompt',
                    // after callbacks
                    'afterRead', 'afterCreate', 'afterUpdate', 'afterDelete', 'afterClose');

                    var filteredProps = propsToRemove.reduce(function (filteredProps, propToRemove) {
                        return filteredProps.delete(propToRemove);
                    }, (0, _immutable.fromJS)(this.props)).toJS();

                    return _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement(
                            'h2',
                            null,
                            this.props.actionName('first'),
                            ' ',
                            this.props.entityName()
                        ),
                        _react2.default.createElement(ComposedComponent, filteredProps),
                        this.renderModal()
                    );
                }
            }, {
                key: 'renderModal',
                value: function renderModal() {
                    var _ref = this.props.prompt || {},
                        open = _ref.open,
                        title = _ref.title,
                        message = _ref.message,
                        status = _ref.status,
                        type = _ref.type,
                        yes = _ref.yes,
                        no = _ref.no,
                        onYes = _ref.onYes,
                        onNo = _ref.onNo;

                    return _react2.default.createElement(
                        _Modal2.default,
                        {
                            isOpen: open,
                            onRequestClose: this.props.closePrompt,
                            title: title,
                            yes: yes,
                            no: no || null,
                            onYes: onYes,
                            onNo: onNo || null },
                        type == "error" && _react2.default.createElement(
                            'h3',
                            null,
                            'Error ',
                            status,
                            ': ',
                            title
                        ),
                        _react2.default.createElement(
                            'p',
                            null,
                            message
                        )
                    );
                }
            }]);

            return EntityEditorDefault;
        }(_react.Component);

        return (0, _EntityEditor2.default)({
            prompts: _TextDefaults.defaultPrompts,
            words: _TextDefaults.defaultWords
        })(EntityEditorDefault);
    };
};