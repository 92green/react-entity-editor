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

var _PromptContainer = require('./prompt/PromptContainer');

var _PromptContainer2 = _interopRequireDefault(_PromptContainer);

var _EntityEditorConfig = require('./config/EntityEditorConfig');

var _Utils = require('./utils/Utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

exports.default = function (config) {
    var additionalOperationProps = config.get('operationProps', function () {});

    return function (ComposedComponent) {
        var EntityEditorHock = function (_Component) {
            _inherits(EntityEditorHock, _Component);

            function EntityEditorHock(props) {
                _classCallCheck(this, EntityEditorHock);

                var _this = _possibleConstructorReturn(this, (EntityEditorHock.__proto__ || Object.getPrototypeOf(EntityEditorHock)).call(this, props));

                _this.componentIsMounted = false;
                _this.state = config.get('initialEditorState').toObject();
                _this.onOperationSuccess = _this.onOperationSuccess.bind(_this);
                _this.onOperationError = _this.onOperationError.bind(_this);
                _this.setEditorState = _this.setEditorState.bind(_this);
                return _this;
            }

            /*
             * React lifecycle
             */

            _createClass(EntityEditorHock, [{
                key: 'componentWillMount',
                value: function componentWillMount() {
                    this.componentIsMounted = true;
                }
            }, {
                key: 'componentWillReceiveProps',
                value: function componentWillReceiveProps(nextProps) {
                    var currentTask = this.getCurrentTask(nextProps);
                    var end = nextProps.workflow.end;

                    // if changing to a new task...

                    if (currentTask && this.props.workflow.task !== nextProps.workflow.task) {

                        // if skip() exists for this task and returns a string, then go there
                        var skip = currentTask.get('skip');
                        if (skip) {
                            var skipProps = {
                                editorState: this.getEditorState()
                            };
                            var skipTo = skip(skipProps);
                            if (skipTo && typeof skipTo == "string") {
                                this.props.workflow.next(skipTo, end);
                                return;
                            }
                        }

                        // if a task has something to do when new task is entered do it here...
                        var taskFunction = currentTask.get('operate');
                        if (taskFunction) {
                            this.operate(taskFunction, nextProps);
                        }
                    }
                }
            }, {
                key: 'componentWillUnmount',
                value: function componentWillUnmount() {
                    this.componentIsMounted = false;
                }

                /*
                 * editor state
                 */

            }, {
                key: 'getEditorState',
                value: function getEditorState() {
                    return this.state;
                }
            }, {
                key: 'setEditorState',
                value: function setEditorState(newState) {
                    this.setState(newState);
                }

                /*
                 * operate
                 */

            }, {
                key: 'operate',
                value: function operate(operateFunction, props) {
                    if (typeof operateFunction != "function") {
                        throw new Error('Entity Editor: "task.operate" must be a function');
                    }

                    var nextWorkflow = props.workflow;
                    var actionProps = nextWorkflow.meta.actionProps;

                    // create operateProps object to be passed into operate() on a task

                    var operateProps = (0, _immutable.Map)({
                        operations: this.partiallyApplyOperations(config.get('operations'), props)
                    }).filter(function (ii) {
                        return ii;
                    }).toObject();

                    var partiallyAppliedOperateFunction = operateFunction(operateProps);
                    if (typeof partiallyAppliedOperateFunction != "function") {
                        throw new Error('Entity Editor: "task.operate" must return a function');
                    }

                    var result = partiallyAppliedOperateFunction(actionProps);
                    (0, _Utils.returnPromise)(result).then(this.onOperationSuccess(actionProps, nextWorkflow), this.onOperationError(actionProps, nextWorkflow));
                }
            }, {
                key: 'partiallyApplyOperations',
                value: function partiallyApplyOperations(operations, props) {
                    var _this2 = this;

                    // TOD MEMOIZE THIS ON PROP CHANGE

                    var mutableOperations = {};

                    // get additional operations props passed through config, and make them all return promises
                    var additional = (0, _immutable.Map)(additionalOperationProps(props)).map(function (fn) {
                        return function () {
                            return (0, _Utils.returnPromise)(fn.apply(undefined, arguments));
                        };
                    }).toObject();

                    operations.forEach(function (operation, key) {

                        // create operationsProps object to be passed into the first operation function
                        var operationProps = (0, _immutable.Map)(_extends({}, additional, {
                            operations: mutableOperations,
                            setEditorState: _this2.setEditorState
                        })).filter(function (ii) {
                            return ii;
                        }).toObject();

                        // partially apply the callbacks so they have knowledge of the full set of callbacks and any other config they're allowed to receive
                        var partialOperation = operation(operationProps);

                        // if not a function then this callback hasn't been set up correctly, error out
                        if (typeof partialOperation != "function") {
                            throw 'Entity Editor: callback "' + key + ' must be a function that returns a \'callback\' function, such as (config) => (callbackProps) => { /* return null, promise or false */ }"';
                        }

                        // wrap partialOperation in a function that forces the callback to always return a promise
                        mutableOperations[key] = function () {
                            return (0, _Utils.returnPromise)(partialOperation.apply(undefined, arguments));
                        };
                    });

                    return mutableOperations;
                }
            }, {
                key: 'onOperationSuccess',
                value: function onOperationSuccess(_ref, nextWorkflow) {
                    var _this3 = this;

                    var onSuccess = _ref.onSuccess;

                    return function (result) {
                        if (!_this3.componentIsMounted || _this3.props.workflow.name != nextWorkflow.name) {
                            return;
                        }
                        onSuccess && onSuccess(result);
                        _this3.props.workflow.next("onSuccess", _this3.props.workflow.end);
                    };
                }
            }, {
                key: 'onOperationError',
                value: function onOperationError(_ref2, nextWorkflow) {
                    var _this4 = this;

                    var onError = _ref2.onError;

                    return function (result) {
                        if (!_this4.componentIsMounted || _this4.props.workflow.name != nextWorkflow.name) {
                            return;
                        }
                        onError && onError(result);
                        _this4.props.workflow.next("onError", _this4.props.workflow.end);
                    };
                }

                /*
                 * workflow
                 */

            }, {
                key: 'workflowStart',
                value: function workflowStart(actionName, actionConfig) {
                    var actionProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

                    if (this.isCurrentTaskBlocking()) {
                        var _props$workflow = this.props.workflow,
                            name = _props$workflow.name,
                            task = _props$workflow.task;

                        console.warn('Entity Editor: cannot start new "' + actionName + '" action while "' + name + '" action is blocking with task "' + task + '".');
                        return;
                    }

                    var workflow = actionConfig.get('workflow');
                    if (!workflow) {
                        throw new Error('Entity Editor: A workflow must be defined on the config object for ' + actionName);
                    }
                    this.props.workflow.start(workflow.toJS(), actionName, { actionProps: actionProps });
                }
            }, {
                key: 'getCurrentTask',
                value: function getCurrentTask(props) {
                    if (!props) {
                        props = this.props;
                    }
                    return config.getIn(['tasks', props.workflow.task]);
                }
            }, {
                key: 'isCurrentTaskBlocking',
                value: function isCurrentTaskBlocking(props) {
                    if (!props) {
                        props = this.props;
                    }
                    var currentTask = this.getCurrentTask(props);
                    if (!currentTask) {
                        return false;
                    }
                    return currentTask.get('blocking', !!currentTask.get('operate'));
                }

                /*
                 * prop calculation
                 */

            }, {
                key: 'entityEditorProps',
                value: function entityEditorProps(statusProps) {
                    var _this5 = this;

                    // actions

                    var actions = config.get('actions', (0, _immutable.Map)()).map(function (actionConfig, actionName) {
                        return function (actionProps) {
                            _this5.workflowStart(actionName, actionConfig, actionProps);
                        };
                    }).toObject();

                    // operations

                    var operations = this.partiallyApplyOperations(config.get('operations'), this.props);

                    // actionable

                    var actionable = !this.isCurrentTaskBlocking();

                    // status

                    var currentWorkflow = this.getCurrentTask();
                    var statusAsProps = !!currentWorkflow && currentWorkflow.get('status') && currentWorkflow.get('statusOutput') == "props";

                    var status = null;
                    if (statusAsProps && currentWorkflow) {
                        status = currentWorkflow.get('status')(statusProps);
                        status.action = this.props.workflow.name;
                        status.task = this.props.workflow.task;
                    }

                    // names

                    var names = config.itemNames();

                    // editor state

                    var state = statusProps.editorState;

                    return {
                        actions: actions,
                        operations: operations,
                        actionable: actionable,
                        status: status,
                        names: names,
                        state: state
                    };
                }

                /*
                 * render
                 */

            }, {
                key: 'render',
                value: function render() {
                    var workflow = this.props.workflow;

                    var statusProps = _extends({
                        editorState: this.getEditorState()
                    }, config.itemNames());

                    return _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement(ComposedComponent, _extends({}, this.props, {
                            entityEditor: this.entityEditorProps(statusProps)
                        })),
                        _react2.default.createElement(_PromptContainer2.default, {
                            workflow: workflow,
                            config: config,
                            promptProps: statusProps,
                            blocking: this.isCurrentTaskBlocking()
                        })
                    );
                }
            }]);

            return EntityEditorHock;
        }(_react.Component);

        var withWorkflowHock = (0, _WorkflowHock2.default)();
        return withWorkflowHock(EntityEditorHock);
    };
};