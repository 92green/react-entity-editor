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

var _Utils = require('./Utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

;

exports.default = function () {
    var userConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var preloadActionIds = userConfig.preloadActionIds,
        _userConfig$entityEdi = userConfig.entityEditorProp,
        entityEditorProp = _userConfig$entityEdi === undefined ? "entityEditor" : _userConfig$entityEdi,
        _userConfig$entityEdi2 = userConfig.entityEditorRoutesProp,
        entityEditorRoutesProp = _userConfig$entityEdi2 === undefined ? "entityEditorRoutes" : _userConfig$entityEdi2;


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
                        prompt.payload = payload;
                        _this3.openPrompt(prompt);
                    });
                }
            }, {
                key: 'wrapActionWithPrompts',
                value: function wrapActionWithPrompts(config, action, actionName, actionProps) {
                    var _this4 = this;

                    // partially apply actions, giving it a subset of config (at this point only callbacks are provided)
                    var partialAction = action({
                        callbacks: config.callbacks
                    });

                    if (typeof partialAction != "function") {
                        throw 'Entity Editor: action "' + actionName + ' must be a function that returns an action function, such as (config) => (actionProps) => { /* return null, promise or false */ }"';
                    }

                    var doNothing = function doNothing() {};
                    var doSuccessAction = function doSuccessAction(result) {
                        var successAction = config.successActions && config.successActions[actionName];

                        // use default successAction if none explicitly provided
                        // which will call callbacks.after<ACTIONNAME> if it exists
                        if (!successAction) {
                            successAction = function successAction(_ref) {
                                var callbacks = _ref.callbacks;
                                return function (successActionProps) {
                                    var after = 'after' + actionName.charAt(0).toUpperCase() + actionName.slice(1);
                                    callbacks[after] && callbacks[after](successActionProps);
                                    return successActionProps;
                                };
                            };
                        }

                        var partialSuccessAction = successAction(config);
                        if (typeof partialSuccessAction != "function") {
                            throw 'Entity Editor: successAction "' + actionName + ' must be a function that returns a successAction function, such as (config) => (successActionProps) => {}"';
                        }
                        return (0, _Utils.returnPromise)(partialSuccessAction(result));
                    };

                    // create promises for onConfirm, onSuccess and onError, and simply pass through where they don't exist
                    var onConfirm = actionProps.onConfirm,
                        onSuccess = actionProps.onSuccess,
                        onError = actionProps.onError;

                    // show confirmation prompt (if exists)

                    this.getPromptPromise(config, 'confirm', actionName, actionProps).then(function (actionProps) {
                        // call onConfirm (if exists)
                        onConfirm && onConfirm(actionProps);
                        return actionProps;
                    }).then(function (actionProps) {
                        // perform action and continue promise chain
                        return (0, _Utils.returnPromise)(partialAction(actionProps)).then(function (result) {
                            // call onSuccess (if exists)
                            onSuccess && onSuccess(result);
                            return result;
                        }, function (result) {
                            // call onError (if exists)
                            onError && onError(result);
                            throw result;
                        }).then(function (result) {
                            // show success prompt (if exists)
                            return _this4.getPromptPromise(config, 'success', actionName, result).then(doSuccessAction, doSuccessAction);
                        }, function (result) {
                            // show error prompt (if exists)
                            console.error(result);
                            return _this4.getPromptPromise(config, 'error', actionName, result).then(doNothing, doNothing);
                        });
                    }, doNothing);
                }
            }, {
                key: 'getPreparedConfig',
                value: function getPreparedConfig(config) {
                    var _this5 = this;

                    var immutableConfig = (0, _immutable.fromJS)(config);
                    var callbacks = {};

                    immutableConfig.get('callbacks').reduce(function (callbacks, callback, key) {

                        // create arguments to be passed as config into each callback
                        var callbackArgsWithSuper = function callbackArgsWithSuper(_super) {
                            return (0, _immutable.Map)({
                                callbacks: callbacks,
                                _super: _super,
                                setEditorState: _this5.setEditorState()
                            }).filter(function (ii) {
                                return ii;
                            }).toObject();
                        };

                        // prepare object to pass as 'config' to every callback
                        // first prepare every super call and recusively insert these into each other
                        // so you can go config._super (and config._super._super) inside each
                        var superCalls = immutableConfig.getIn(['_super', 'callbacks', key], (0, _immutable.List)());
                        var _super = superCalls.reduce(function (reduction, _super) {
                            return _super(callbackArgsWithSuper(_super));
                        });

                        // partially apply the callbacks so they have knowledge of the full set of callbacks and any other config they're allowed to receive
                        var partialCallback = callback(callbackArgsWithSuper(_super));

                        // if not a function then this callback hasnt been set up correctly, error out
                        if (typeof partialCallback != "function") {
                            throw 'Entity Editor: callback "' + key + ' must be a function that returns a \'callback\' function, such as (config) => (callbackProps) => { /* return null, promise or false */ }"';
                        }

                        // wrap partialCallback in a function that forces the callback to always return a promise
                        callbacks[key] = function () {
                            return (0, _Utils.returnPromise)(partialCallback.apply(undefined, arguments));
                        };
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
                key: 'renderPrompt',
                value: function renderPrompt(config) {
                    var _state3 = this.state,
                        prompt = _state3.prompt,
                        promptOpen = _state3.promptOpen;


                    var promptAsProps = prompt && prompt.asProps;
                    var Message = prompt && prompt.message;
                    var Prompt = config.components.prompt;
                    var PromptContent = config.components.promptContent;

                    return _react2.default.createElement(
                        Prompt,
                        _extends({}, prompt, {
                            open: promptOpen && !promptAsProps,
                            onRequestClose: this.closePrompt.bind(this)
                        }),
                        prompt && _react2.default.createElement(
                            PromptContent,
                            prompt,
                            _react2.default.createElement(Message, prompt.item)
                        )
                    );
                }
            }, {
                key: 'render',
                value: function render() {
                    var _extends2;

                    var config = (0, _Config.mergeWithBaseConfig)(this.context.entityEditorRoutes, userConfig);
                    var props = _extends({}, this.props, (_extends2 = {}, _defineProperty(_extends2, entityEditorProp, this.entityEditorProps(config)), _defineProperty(_extends2, entityEditorRoutesProp, this.context.entityEditorRoutes), _extends2));

                    return _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement(ComposedComponent, props),
                        this.renderPrompt(config)
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