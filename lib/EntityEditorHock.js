'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _EntityEditorConfig = require('./config/EntityEditorConfig');

var _Utils = require('./Utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

exports.default = function (options) {
    var userConfig = options.config,
        preloadActionIds = options.preloadActionIds,
        _options$propNames = options.propNames,
        propNames = _options$propNames === undefined ? {} : _options$propNames;


    var entityEditorProp = propNames.entityEditor || "entityEditor";
    var entityEditorRoutesProp = propNames.entityEditorRoutes || "entityEditorRoutes";

    return function (ComposedComponent) {
        var EntityEditorHock = function (_Component) {
            _inherits(EntityEditorHock, _Component);

            function EntityEditorHock(props) {
                _classCallCheck(this, EntityEditorHock);

                var _this = _possibleConstructorReturn(this, (EntityEditorHock.__proto__ || Object.getPrototypeOf(EntityEditorHock)).call(this, props));

                _this.state = {
                    dirty: false,
                    prompt: null,
                    promptOpen: false,
                    pending: {}
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

                /*shouldComponentUpdate(nextProps: Object, nextState: Object): boolean {
                    return fromJS(this.props).equals(fromJS(nextProps))
                        || fromJS(this.state).equals(fromJS(nextState));
                }*/

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
                key: 'getPending',
                value: function getPending(id, actionName) {
                    return !!this.state.pending[id + '|' + actionName];
                }
            }, {
                key: 'setPending',
                value: function setPending(id, actionName, pending) {
                    this.setState({
                        pending: Object.assign({}, this.state.pending, _defineProperty({}, id + '|' + actionName, pending))
                    });
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

                    var prompt = config.prompt(actionName, type, this.getEditorState());
                    if (!prompt) {
                        return new Promise(function (resolve) {
                            return resolve(payload);
                        });
                    }

                    return new Promise(function (resolve, reject) {
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

                    // partially apply actions, giving it a subset of config (at this point only operations are provided)
                    var partialAction = action({
                        operations: config.partiallyApplyOperations({
                            setEditorState: this.setEditorState()
                        })
                    });

                    if (typeof partialAction != "function") {
                        throw 'Entity Editor: action "' + actionName + ' must be a function that returns an action function, such as (config) => (actionProps) => { /* return null, promise or false */ }"';
                    }

                    var getSuccessAction = function getSuccessAction(config, actionName) {
                        return function () {};

                        /*
                        return (result) => {
                            var successAction = config.getIn(['successActions', actionName]);
                             // use default successAction if none explicitly provided
                            // which will call operations.after<ACTIONNAME> if it exists
                            if(!successAction) {
                                successAction = ({operations}) => (successActionProps) => {
                                    const after = `after${actionName.charAt(0).toUpperCase()}${actionName.slice(1)}`;
                                    operations[after] && operations[after](successActionProps);
                                    return successActionProps;
                                };
                            }
                             const partialSuccessAction = successAction(config);
                            if(typeof partialSuccessAction != "function") {
                                throw `Entity Editor: successAction "${actionName} must be a function that returns a successAction function, such as (config) => (successActionProps) => {}"`;
                            }
                            return returnPromise(partialSuccessAction(result));
                        };*/
                    };

                    // create promises for onConfirm, onSuccess and onError, and simply pass through where they don't exist
                    var onConfirm = actionProps.onConfirm,
                        onSuccess = actionProps.onSuccess,
                        onError = actionProps.onError;


                    var callOnConfirm = function callOnConfirm(actionProps) {
                        onConfirm && onConfirm(actionProps);
                        return actionProps;
                    };

                    var beginPending = function beginPending(actionProps) {
                        if (!config.getIn(['excludePending', actionName])) {
                            _this4.setPending(actionProps.id, actionName, true);
                        }
                        return actionProps;
                    };

                    var endPendingSuccess = function endPendingSuccess(result) {
                        if (!config.getIn(['excludePending', actionName])) {
                            _this4.setPending(actionProps.id, actionName, false);
                        }
                        return result;
                    };

                    var endPendingError = function endPendingError(result) {
                        _this4.setPending(actionProps.id, actionName, false);
                        throw result;
                    };

                    var callOnSuccess = function callOnSuccess(result) {
                        onSuccess && onSuccess(result);
                        return result;
                    };

                    var callOnError = function callOnError(result) {
                        onError && onError(result);
                        throw result;
                    };

                    var doNothing = function doNothing() {};

                    var doSuccessAction = getSuccessAction(config, actionName);

                    var showSuccessPrompt = function showSuccessPrompt(result) {
                        return _this4.getPromptPromise(config, 'success', actionName, result).then(doSuccessAction, doSuccessAction);
                    };

                    var showErrorPrompt = function showErrorPrompt(result) {
                        console.error(result);
                        return _this4.getPromptPromise(config, 'error', actionName, result).then(doNothing, doNothing);
                    };

                    // show confirmation prompt (if exists)
                    this.getPromptPromise(config, 'confirm', actionName, actionProps).then(callOnConfirm).then(beginPending).then(function (actionProps) {
                        // perform action and continue promise chain
                        return (0, _Utils.returnPromise)(partialAction(actionProps)).then(endPendingSuccess, endPendingError).then(callOnSuccess, callOnError).then(showSuccessPrompt, showErrorPrompt);
                    }, doNothing);
                }
            }, {
                key: 'entityEditorProps',
                value: function entityEditorProps(config) {
                    var _this5 = this;

                    // wrap each of the actions in prompts so they can handle confirmation, success and error
                    var actions = config.data().get('actions', (0, _immutable.Map)()).map(function (action, actionName) {
                        return function (actionProps) {
                            if (preloadActionIds) {
                                actionProps.id = preloadActionIds(_this5.props);
                            }
                            return _this5.wrapActionWithPrompts(config, action, actionName, actionProps);
                        };
                    }).toJS();

                    // pending actions
                    //const pending: Object = this.getPending;

                    var props = {
                        actions: actions,
                        //state,
                        pending: this.getPending
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
                    var Prompt = config.getIn(['components', 'prompt']);
                    var PromptContent = config.getIn(['components', 'promptContent']);

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

                    var config = userConfig.merge(this.context.entityEditorRoutes.config);

                    var props = _extends({}, this.props, (_extends2 = {}, _defineProperty(_extends2, entityEditorProp, this.entityEditorProps(config)), _defineProperty(_extends2, entityEditorRoutesProp, this.context.entityEditorRoutes.props), _extends2));

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