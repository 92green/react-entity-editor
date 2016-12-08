'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _Config = require('./Config');

var _Modal = require('./Modal');

var _Modal2 = _interopRequireDefault(_Modal);

var _Utils = require('./Utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

exports.default = function () {
    var userConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _userConfig$promptCom = userConfig.promptComponent,
        promptComponent = _userConfig$promptCom === undefined ? function () {
        return _react2.default.createElement(_Modal2.default, null);
    } : _userConfig$promptCom,
        preloadActionIds = userConfig.preloadActionIds;


    return function (ComposedComponent) {
        var EntityEditorHock = function (_Component) {
            _inherits(EntityEditorHock, _Component);

            function EntityEditorHock(props) {
                _classCallCheck(this, EntityEditorHock);

                var _this = _possibleConstructorReturn(this, (EntityEditorHock.__proto__ || Object.getPrototypeOf(EntityEditorHock)).call(this, props));

                _this.state = {
                    dirty: false,
                    prompt: null,
                    promptOpen: false
                };
                return _this;
            }

            _createClass(EntityEditorHock, [{
                key: 'componentWillMount',
                value: function componentWillMount() {
                    var onLeaveHook = this.context.entityEditorRoutes.onLeaveHook;


                    if (onLeaveHook) {
                        onLeaveHook(function (a, b) {
                            /*if(this.allowLeave) {
                                return true;
                            }
                            try a generic "go" action
                            return false;*/
                        });
                    }
                }
            }, {
                key: 'componentWillUnmount',
                value: function componentWillUnmount() {
                    this.closePrompt();
                }
            }, {
                key: 'shouldComponentUpdate',
                value: function shouldComponentUpdate(nextProps, nextState) {
                    return (0, _immutable.fromJS)(this.props).equals((0, _immutable.fromJS)(nextProps)) || (0, _immutable.fromJS)(this.state).equals((0, _immutable.fromJS)(nextState));
                }
            }, {
                key: 'openPrompt',
                value: function openPrompt(prompt) {
                    this.setState({
                        prompt: prompt,
                        promptOpen: true
                    });
                }
            }, {
                key: 'closePrompt',
                value: function closePrompt() {
                    var _state = this.state,
                        prompt = _state.prompt,
                        promptOpen = _state.promptOpen;


                    if (!prompt || !promptOpen) {
                        return;
                    }

                    this.setState({
                        promptOpen: false
                    });
                }
            }, {
                key: 'getPromptPromise',
                value: function getPromptPromise(config, type, actionName, payload) {
                    var _this2 = this;

                    var editorData = {
                        dirty: this.state.dirty
                    };

                    var prompt = (0, _Config.promptWithDefaults)(config, type, actionName, editorData);

                    // special case: actions staring with "go" can fallback to use "go" prompts
                    if (!prompt && /^go[A-Z]/.test(actionName)) {
                        prompt = (0, _Config.promptWithDefaults)(config, type, "go", editorData);
                    }

                    return !prompt ? new Promise(function (resolve) {
                        return resolve(payload);
                    }) : new Promise(function (resolve, reject) {
                        prompt.onYes = function () {
                            return resolve(payload);
                        };
                        prompt.onNo = function () {
                            return reject(payload);
                        };
                        _this2.openPrompt(prompt);
                    });
                }
            }, {
                key: 'wrapActionInPrompts',
                value: function wrapActionInPrompts(config, action, actionName, actionProps) {
                    var _this3 = this;

                    var partialAction = action(config);
                    if (typeof partialAction != "function") {
                        throw 'Entity Editor: action "' + actionName + ' must be a function that returns an action function, such as (config) => (actionProps) => { /* return null, promise or false */ }"';
                    }

                    // show confirmation prompt (if exists)
                    return this.getPromptPromise(config, 'confirm', actionName, actionProps).then(function (actionProps) {
                        return (0, _Utils.returnPromise)(partialAction(actionProps)).then(function (result) {
                            // show success prompt (if exists)
                            _this3.getPromptPromise(config, 'success', actionName, result).catch(function () {});
                        }, function (result) {
                            // show error prompt (if exists)
                            _this3.getPromptPromise(config, 'error', actionName, result).catch(function () {});
                        });
                    }, function () {});
                }
            }, {
                key: 'entityEditorProps',
                value: function entityEditorProps(config) {
                    var _this4 = this;

                    var modifiedConfig = _extends({}, config, {
                        callbacks: _extends({}, config.callbacks, {
                            onDirty: function onDirty(_ref) {
                                var dirty = _ref.dirty;

                                if (_this4.state.dirty != dirty) {
                                    _this4.setState({ dirty: dirty });
                                }
                            }
                        })
                    });

                    var actions = (0, _immutable.fromJS)(config).get('actions', (0, _immutable.Map)()).map(function (action, actionName) {
                        return function (actionProps) {
                            if (preloadActionIds) {
                                actionProps.id = preloadActionIds(_this4.props);
                            }
                            return _this4.wrapActionInPrompts(modifiedConfig, action, actionName, actionProps);
                        };
                    }).toJS();

                    var state = {
                        dirty: this.state.dirty
                    };

                    return {
                        actions: actions,
                        state: state
                    };
                }
            }, {
                key: 'render',
                value: function render() {
                    var config = (0, _Config.mergeWithBaseConfig)(this.context.entityEditorRoutes, userConfig);
                    var _state2 = this.state,
                        prompt = _state2.prompt,
                        promptOpen = _state2.promptOpen;


                    return _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement(ComposedComponent, _extends({}, this.props, {
                            entityEditor: this.entityEditorProps(config),
                            entityEditorRoutes: this.context.entityEditorRoutes
                        })),
                        _react2.default.cloneElement(promptComponent(this.props), _extends({}, prompt, {
                            open: promptOpen,
                            onRequestClose: this.closePrompt.bind(this)
                        }))
                    );
                }
            }]);

            return EntityEditorHock;
        }(_react.Component);

        EntityEditorHock.contextTypes = {
            entityEditorRoutes: _react.PropTypes.object
        };

        return EntityEditorHock;
    };
};