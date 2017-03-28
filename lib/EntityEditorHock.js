'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _WorkflowHock = require('./workflow/WorkflowHock');

var _WorkflowHock2 = _interopRequireDefault(_WorkflowHock);

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
                    /*prompt: null,
                    promptOpen: false,*/
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
                value: function componentWillUnmount() {}
                //this.closePrompt();


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

                /*openPrompt(prompt: Object): void {
                    this.setState({
                        prompt,
                        promptOpen: true
                    });
                }
                 closePrompt() {
                    const{
                        prompt,
                        promptOpen
                    } = this.state;
                     if(!prompt || !promptOpen) {
                        return;
                    }
                     this.setState({
                        promptOpen: false
                    });
                }*/

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
                key: 'pendingProps',
                value: function pendingProps(config) {
                    var _this5 = this;

                    return function (id) {
                        return config.get('actions').map(function (action, actionName) {
                            return _this5.getPending(id, actionName);
                        }).toObject();
                    };
                }
            }, {
                key: 'setWorkflow',
                value: function setWorkflow(actionName, actionConfig) {
                    var workflow = actionConfig.get('workflow');
                    if (!workflow) {
                        throw new Error('EntityEditor error: A workflow must be defined on the config object for ' + actionName);
                    }

                    var nextSteps = workflow.filter(function (value, key) {
                        return key != "task";
                    }).toJS();

                    this.props.setWorkflow({
                        workflow: actionName,
                        step: workflow.get("task"),
                        nextSteps: nextSteps
                    });
                }
            }, {
                key: 'entityEditorProps',
                value: function entityEditorProps(config) {
                    var _this6 = this;

                    var preloadedActionId = preloadActionIds && preloadActionIds(this.props);

                    // wrap each of the actions in prompts so they can handle confirmation, success and error
                    // also preload action props with their ids if required (such as with EntityEditorItem)


                    var actions = config.get('actions', (0, _immutable.Map)()).map(function (actionConfig, actionName) {
                        return function (actionProps) {
                            if (preloadActionIds) {
                                actionProps.id = preloadedActionId;
                            }

                            _this6.setWorkflow(actionName, actionConfig);
                            /*
                             return (...args) => {
                                console.log(actionName, "!!!", args);
                            };
                             /*
                            return this.wrapActionWithPrompts(
                                config,
                                action,
                                actionName,
                                actionProps
                            );*/
                        };
                    }).toJS();

                    // pending actions
                    var props = {
                        actions: actions,
                        //state,
                        pending: this.pendingProps(config)
                    };

                    if (preloadActionIds) {
                        props.pending = props.pending(preloadedActionId);
                    }

                    var _state = this.state,
                        prompt = _state.prompt,
                        promptOpen = _state.promptOpen;


                    if (promptOpen && prompt && prompt.asProps) {
                        props.prompt = Object.assign({}, prompt);
                    }

                    return props;
                }
            }, {
                key: 'renderPrompt',
                value: function renderPrompt(config) {
                    var _props = this.props,
                        workflow = _props.workflow,
                        step = _props.step,
                        nextSteps = _props.nextSteps;


                    var task = config.getIn(['actions', workflow, 'tasks', step]);
                    var promptOpen = task && task.get('type') == "prompt";
                    var prompt = promptOpen && task.get('prompt');
                    var promptDetails = null;

                    if (prompt) {
                        promptDetails = prompt({ item: "???", Item: "???" });
                    }

                    var Prompt = config.getIn(['components', 'prompt']);
                    var PromptContent = config.getIn(['components', 'promptContent']);

                    console.log("nextSteps", nextSteps);
                    // TODO: setWorkflow


                    return _react2.default.createElement(
                        Prompt,
                        _extends({}, promptDetails, {
                            open: promptOpen,
                            onRequestClose: function onRequestClose(ii) {
                                return console.log("...");
                            },
                            onYes: null,
                            onNo: null
                        }),
                        prompt && _react2.default.createElement(
                            PromptContent,
                            promptDetails,
                            promptDetails && promptDetails.message
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

        var withWorkflowHock = (0, _WorkflowHock2.default)();
        return withWorkflowHock(EntityEditorHock);
    };
};