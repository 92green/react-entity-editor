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

            /*componentWillMount() {
                const {
                    entityEditorRoutes: {
                        onLeaveHook
                    }
                } = this.context;
                 if(onLeaveHook) {
                    onLeaveHook((a,b) => {
                        if(this.allowLeave) {
                            return true;
                        }
                        try a generic "go" action
                        return false;
                    });
                }
            }*/

            _createClass(EntityEditorHock, [{
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
                key: 'getEditorState',
                value: function getEditorState() {
                    return {
                        dirty: this.state.dirty
                    };
                }
            }, {
                key: 'setEditorState',
                value: function setEditorState() {
                    var _this2 = this;

                    return {
                        dirty: function dirty(_dirty) {
                            if (_this2.state.dirty != _dirty) {
                                _this2.setState({ dirty: _dirty });
                            }
                        }
                    };
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
                    var _this3 = this;

                    var prompt = (0, _Config.promptWithDefaults)(config, type, actionName, this.getEditorState());

                    // special case: actions staring with "go" can fallback to use "go" prompts
                    if (!prompt && /^go[A-Z]/.test(actionName)) {
                        prompt = (0, _Config.promptWithDefaults)(config, type, "go", this.getEditorState());
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
                        _this3.openPrompt(prompt);
                    });
                }
            }, {
                key: 'wrapActionWithPrompts',
                value: function wrapActionWithPrompts(config, action, actionName, actionProps) {
                    var _this4 = this;

                    var partialAction = action(config);
                    if (typeof partialAction != "function") {
                        throw 'Entity Editor: action "' + actionName + ' must be a function that returns an action function, such as (config) => (actionProps) => { /* return null, promise or false */ }"';
                    }

                    var doNothing = function doNothing() {};

                    // show confirmation prompt (if exists)
                    return this.getPromptPromise(config, 'confirm', actionName, actionProps).then(function (actionProps) {
                        // perform action
                        return (0, _Utils.returnPromise)(partialAction(actionProps)).then(function (result) {
                            // show success prompt (if exists)
                            return _this4.getPromptPromise(config, 'success', actionName, result).then(_this4.callAfter, _this4.callAfter);
                        }, function (result) {
                            // show error prompt (if exists)
                            return _this4.getPromptPromise(config, 'error', actionName, result).then(doNothing, doNothing);
                        });
                    }, doNothing);
                }
            }, {
                key: 'wrapCallbackWithAfter',
                value: function wrapCallbackWithAfter(partialCallback, key, callbacks) {
                    return function () {
                        var after = /^on/.test(key) ? callbacks[key.replace(/^on/, 'after')] : null;

                        return (0, _Utils.returnPromise)(partialCallback.apply(undefined, arguments)).then(function (response) {
                            return { response: response, after: after };
                        });
                    };
                }
            }, {
                key: 'callAfter',
                value: function callAfter(_ref) {
                    var response = _ref.response,
                        after = _ref.after;

                    after && after(response);
                }
            }, {
                key: 'getPreparedConfig',
                value: function getPreparedConfig(config) {
                    var _this5 = this;

                    var callbacks = {};

                    (0, _immutable.fromJS)(config.callbacks).reduce(function (callbacks, callback, key) {
                        // partially apply the callbacks so they have knowledge of the full set of callbacks and any other config they're allowed to receive
                        var partialCallback = callback({
                            callbacks: callbacks,
                            setEditorState: _this5.setEditorState()
                        });

                        // if not a function then this callback hasnt been set up correctly, error out
                        if (typeof partialCallback != "function") {
                            throw 'Entity Editor: callback "' + key + ' must be a function that returns a \'callback\' function, such as (config) => (callbackProps) => { /* return null, promise or false */ }"';
                        }

                        // wrap partialCallback in a function that takes the callback response and nests it in a new object,
                        // so we can also pass a reference to an 'after' function in the promise payload
                        // the 'after' function will be called after the user closes out of a success dialog
                        callbacks[key] = _this5.wrapCallbackWithAfter(partialCallback, key, callbacks);
                        return callbacks;
                    }, callbacks);

                    return (0, _immutable.fromJS)(config).set('callbacks', callbacks).toJS();
                }
            }, {
                key: 'entityEditorProps',
                value: function entityEditorProps(config) {
                    var _this6 = this;

                    var preparedConfig = this.getPreparedConfig(config);

                    // wrap each of the actions in prompts so they can handle confirmation, success and error
                    // also preload action props with their ids if required (such as with EntityEditorItem)
                    var actions = (0, _immutable.fromJS)(config).get('actions', (0, _immutable.Map)()).map(function (action, actionName) {
                        return function (actionProps) {
                            if (preloadActionIds) {
                                actionProps.id = preloadActionIds(_this6.props);
                            }
                            return _this6.wrapActionWithPrompts(preparedConfig, action, actionName, actionProps);
                        };
                    }).toJS();

                    // choose state vars to pass down in a state prop
                    var state = {
                        dirty: this.state.dirty
                    };

                    var props = {
                        actions: actions,
                        state: state
                    };

                    var _state2 = this.state,
                        prompt = _state2.prompt,
                        promptOpen = _state2.promptOpen;


                    if (promptOpen && prompt && prompt.asProps) {
                        props.prompt = Object.assign({}, prompt);
                    }

                    return props;
                }
            }, {
                key: 'render',
                value: function render() {
                    var config = (0, _Config.mergeWithBaseConfig)(this.context.entityEditorRoutes, userConfig);
                    var _state3 = this.state,
                        prompt = _state3.prompt,
                        promptOpen = _state3.promptOpen;


                    var promptAsProps = prompt && prompt.asProps;

                    return _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement(ComposedComponent, _extends({}, this.props, {
                            entityEditor: this.entityEditorProps(config),
                            entityEditorRoutes: this.context.entityEditorRoutes
                        })),
                        _react2.default.cloneElement(promptComponent(this.props), _extends({}, prompt, {
                            open: promptOpen && !promptAsProps,
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