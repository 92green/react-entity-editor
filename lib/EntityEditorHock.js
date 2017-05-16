'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _immutable = require('immutable');

var _WorkflowHock = require('./workflow/WorkflowHock');

var _WorkflowHock2 = _interopRequireDefault(_WorkflowHock);

var _PromptContainer = require('./prompt/PromptContainer');

var _PromptContainer2 = _interopRequireDefault(_PromptContainer);

var _EntityEditorConfig = require('./config/EntityEditorConfig');

var _Utils = require('./utils/Utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

exports.default = function (config) {
    var selectedOperationProps = config.get('operationProps');

    return function (ComposedComponent) {
        var EntityEditorHock = function (_Component) {
            _inherits(EntityEditorHock, _Component);

            function EntityEditorHock(props) {
                _classCallCheck(this, EntityEditorHock);

                var _this = _possibleConstructorReturn(this, (EntityEditorHock.__proto__ || Object.getPrototypeOf(EntityEditorHock)).call(this, props));

                _initialiseProps.call(_this);

                _this.componentIsMounted = false;
                _this.nextProps = props;
                _this.state = config.get('initialEditorState').toObject();
                return _this;
            }

            /*
             * React lifecycle
             */

            _createClass(EntityEditorHock, [{
                key: 'componentWillMount',
                value: function componentWillMount() {
                    var _this2 = this;

                    this.componentIsMounted = true;
                    this.nextProps = this.props;
                    config.getIn(['lifecycleMethods', 'componentWillMount'], (0, _immutable.Map)()).forEach(function (fn) {
                        return fn(_this2, config);
                    });
                }
            }, {
                key: 'componentDidMount',
                value: function componentDidMount() {
                    var _this3 = this;

                    config.getIn(['lifecycleMethods', 'componentDidMount'], (0, _immutable.Map)()).forEach(function (fn) {
                        return fn(_this3, config);
                    });
                }
            }, {
                key: 'componentWillReceiveProps',
                value: function componentWillReceiveProps(nextProps) {
                    var _this4 = this;

                    this.nextProps = nextProps;
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
                        var operationName = currentTask.get('operation');
                        if (operationName) {
                            this.operate(operationName, nextProps);
                        }
                    }

                    config.getIn(['lifecycleMethods', 'componentWillReceiveProps'], (0, _immutable.Map)()).forEach(function (fn) {
                        return fn(_this4, config, nextProps);
                    });
                }
            }, {
                key: 'componentWillUnmount',
                value: function componentWillUnmount() {
                    var _this5 = this;

                    this.componentIsMounted = false;
                    config.getIn(['lifecycleMethods', 'componentWillUnmount'], (0, _immutable.Map)()).forEach(function (fn) {
                        return fn(_this5, config);
                    });
                }

                /*
                 * editor state
                 */

                /*
                 * operate
                 */

                /*
                 * workflow
                 */

            }, {
                key: 'entityEditorProps',


                /*
                 * prop calculation
                 */

                value: function entityEditorProps(statusProps) {
                    var _this6 = this;

                    // actions

                    var actions = config.get('actions', (0, _immutable.Map)()).map(function (actionConfig, actionName) {
                        return function (actionProps) {
                            _this6.workflowStart(actionName, actionConfig, actionProps);
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
                    var _props = this.props,
                        workflow = _props.workflow,
                        passConfig = _props.passConfig,
                        filteredProps = _objectWithoutProperties(_props, ['workflow', 'passConfig']);

                    var editorState = this.getEditorState();
                    var statusProps = _extends({
                        editorState: editorState
                    }, config.itemNames());

                    if (passConfig) {
                        filteredProps.config = config;
                    }

                    return _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement(ComposedComponent, _extends({}, filteredProps, {
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

        var _initialiseProps = function _initialiseProps() {
            var _this7 = this;

            this.getEditorState = function () {
                return _this7.state;
            };

            this.setEditorState = function (newState) {
                _this7.setState(newState);
            };

            this.operate = function (operationName, props) {

                var nextWorkflow = props.workflow;
                var actionProps = nextWorkflow.meta.actionProps;


                var operations = _this7.partiallyApplyOperations(config.get('operations'), props);

                if (!operations.hasOwnProperty(operationName)) {
                    throw new Error('Entity Editor: config.operations."' + operationName + '" does not exist');
                }

                var partiallyAppliedOperation = operations[operationName];
                if (typeof partiallyAppliedOperation != "function") {
                    throw new Error('Entity Editor: "task.operate" must return a function');
                }

                var result = partiallyAppliedOperation(actionProps);
                (0, _Utils.returnPromise)(result).then(_this7.onOperationSuccess(actionProps, nextWorkflow), _this7.onOperationError(actionProps, nextWorkflow));
            };

            this.partiallyApplyOperations = function (operations, props) {
                // TOD MEMOIZE THIS ON PROP CHANGE

                var mutableOperations = {};

                // get operation props passed through config, and make any functions return promises\
                var entityEditorProps = (0, _immutable.Map)(selectedOperationProps(props)).map(function (ii) {
                    if (typeof ii !== "function") {
                        return ii;
                    }
                    return function () {
                        return (0, _Utils.returnPromise)(ii.apply(undefined, arguments));
                    };
                }).toObject();

                operations.forEach(function (operation, key) {

                    // create operationsProps object to be passed into the first operation function
                    var operationProps = {
                        props: entityEditorProps,
                        operations: mutableOperations,
                        setEditorState: _this7.setEditorState
                    };

                    // partially apply the callbacks so they have knowledge of the full set of callbacks and any other config they're allowed to receive
                    var partialOperation = operation(operationProps);

                    // if not a function then this callback hasn't been set up correctly, error out
                    if (typeof partialOperation != "function") {
                        throw new Error('Entity Editor: callback "' + key + ' must be a function that returns a \'callback\' function"');
                    }

                    // wrap partialOperation in a function that forces the callback to always return a promise
                    mutableOperations[key] = function () {
                        return (0, _Utils.returnPromise)(partialOperation.apply(undefined, arguments));
                    };
                });

                return mutableOperations;
            };

            this.onOperationSuccess = function (_ref, nextWorkflow) {
                var onSuccess = _ref.onSuccess;

                return function (result) {
                    if (!_this7.componentIsMounted || _this7.props.workflow.name != nextWorkflow.name) {
                        return;
                    }
                    onSuccess && onSuccess(result);
                    _this7.props.workflow.next("onSuccess", _this7.props.workflow.end);
                };
            };

            this.onOperationError = function (_ref2, nextWorkflow) {
                var onError = _ref2.onError;

                return function (result) {
                    if (!_this7.componentIsMounted || _this7.props.workflow.name != nextWorkflow.name) {
                        return;
                    }
                    onError && onError(result);
                    _this7.props.workflow.next("onError", _this7.props.workflow.end);
                };
            };

            this.workflowStart = function (actionName, actionConfig) {
                var actionProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

                if (_this7.isCurrentTaskBlocking()) {
                    var _props$workflow = _this7.props.workflow,
                        name = _props$workflow.name,
                        task = _props$workflow.task;

                    console.warn('Entity Editor: cannot start new "' + actionName + '" action while "' + name + '" action is blocking with task "' + task + '".');
                    return;
                }

                var workflow = actionConfig.get('workflow');
                if (!workflow) {
                    throw new Error('Entity Editor: A workflow must be defined on the config object for ' + actionName);
                }
                _this7.props.workflow.start(workflow.toJS(), actionName, { actionProps: actionProps });
            };

            this.getCurrentTask = function (props) {
                if (!props) {
                    props = _this7.props;
                }
                return config.getIn(['tasks', props.workflow.task]);
            };

            this.isCurrentTaskBlocking = function (props) {
                if (!props) {
                    props = _this7.props;
                }
                var currentTask = _this7.getCurrentTask(props);
                if (!currentTask) {
                    return false;
                }
                return currentTask.get('blocking', !!currentTask.get('operation'));
            };
        };

        EntityEditorHock.propTypes = {
            workflow: _propTypes2.default.object.isRequired, // always provided by WorkflowHock
            passConfig: _propTypes2.default.bool
        };

        var withWorkflowHock = (0, _WorkflowHock2.default)();
        return withWorkflowHock(EntityEditorHock);
    };
};