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

var _Workflow = require('./Workflow');

var _Workflow2 = _interopRequireDefault(_Workflow);

var _EntityEditorConfig = require('./config/EntityEditorConfig');

var _Utils = require('./utils/Utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

exports.default = function (config) {
    var selectedOperationProps = config.get('operationProps');

    return function (Component) {
        var _class, _temp, _initialiseProps;

        return _temp = _class = function (_React$Component) {
            _inherits(EntityEditorHock, _React$Component);

            function EntityEditorHock(props) {
                _classCallCheck(this, EntityEditorHock);

                var _this = _possibleConstructorReturn(this, (EntityEditorHock.__proto__ || Object.getPrototypeOf(EntityEditorHock)).call(this, props));

                _initialiseProps.call(_this);

                _this.componentIsMounted = false;
                _this.nextProps = props;
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

                    var thisWorkflow = this.getWorkflow(this.props);
                    var nextWorkflow = this.getWorkflow(nextProps);

                    // if changing to a new task...
                    if (currentTask && thisWorkflow.get('task') !== nextWorkflow.get('task')) {

                        // if skip() exists for this task and returns a string, then go there
                        var skip = currentTask.get('skip');
                        if (skip) {
                            var skipProps = {
                                editorState: this.getState(nextProps).editor
                            };
                            var skipTo = skip(skipProps);
                            if (skipTo && typeof skipTo == "string") {
                                nextWorkflow.next(skipTo);
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

                /*
                 * prop calculation
                 */

            }, {
                key: 'render',


                /*
                 * render
                 */

                value: function render() {
                    var _props = this.props,
                        entityEditorState = _props.entityEditorState,
                        rest = _objectWithoutProperties(_props, ['entityEditorState']);

                    return _react2.default.createElement(Component, _extends({}, rest, {
                        entityEditor: this.entityEditorProps()
                    }));
                }
            }]);

            return EntityEditorHock;
        }(_react2.default.Component), _class.propTypes = {
            entityEditorState: _propTypes2.default.object.isRequired
        }, _initialiseProps = function _initialiseProps() {
            var _this6 = this;

            this.getState = function (props) {
                return props.entityEditorState;
            };

            this.setState = function (newState) {
                _this6.props.entityEditorStateChange(newState);
            };

            this.setEditorState = function (newState) {
                _this6.props.entityEditorStateChange({
                    editor: newState
                });
            };

            this.operate = function (operationName, props) {
                var _ref = _this6.getWorkflow(props).get('meta') || {},
                    actionProps = _ref.actionProps;

                var operations = _this6.partiallyApplyOperations(config.get('operations'), props);

                if (!operations.hasOwnProperty(operationName)) {
                    throw new Error('Entity Editor: config.operations."' + operationName + '" does not exist');
                }

                var partiallyAppliedOperation = operations[operationName];
                if (typeof partiallyAppliedOperation != "function") {
                    throw new Error('Entity Editor: "task.operate" must return a function');
                }

                var result = partiallyAppliedOperation(actionProps);
                (0, _Utils.returnPromise)(result).then(_this6.onOperationSuccess(actionProps, props), _this6.onOperationError(actionProps, props));
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
                        setEditorState: _this6.setEditorState
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

            this.onOperationSuccess = function (_ref2, props) {
                var onSuccess = _ref2.onSuccess;

                return function (result) {
                    var prevWorkflow = _this6.getWorkflow(props);
                    var thisWorkflow = _this6.getWorkflow(_this6.props);

                    if (!_this6.componentIsMounted || thisWorkflow.get('name') !== prevWorkflow.get('name')) {
                        return;
                    }

                    onSuccess && onSuccess(result);
                    thisWorkflow.next("onSuccess", function (meta) {
                        return _extends({}, meta, { result: result });
                    });
                };
            };

            this.onOperationError = function (_ref3, props) {
                var onError = _ref3.onError;

                return function (result) {
                    var prevWorkflow = _this6.getWorkflow(props);
                    var thisWorkflow = _this6.getWorkflow(_this6.props);

                    if (!_this6.componentIsMounted || thisWorkflow.get('name') !== prevWorkflow.get('name')) {
                        return;
                    }

                    onError && onError(result);
                    thisWorkflow.next("onError", function (meta) {
                        return _extends({}, meta, { result: result });
                    });
                };
            };

            this.getWorkflow = function (props) {
                return (0, _Workflow2.default)(_this6.getState(props).workflow, function (workflow) {
                    return _this6.setState({ workflow: workflow });
                });
            };

            this.workflowStart = function (actionName, actionConfig) {
                var actionProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

                var workflow = _this6.getWorkflow(_this6.props);

                if (_this6.isCurrentTaskBlocking()) {
                    var _workflow$get = workflow.get(),
                        name = _workflow$get.name,
                        task = _workflow$get.task;

                    console.warn('Entity Editor: cannot start new "' + actionName + '" action while "' + name + '" action is blocking with task "' + task + '".');
                    return;
                }

                var workflowData = actionConfig.get('workflow');
                if (!workflowData) {
                    throw new Error('Entity Editor: A workflow must be defined on the config object for ' + actionName);
                }

                workflow.start(workflowData.toJS(), actionName, { actionProps: actionProps });
            };

            this.getCurrentTask = function (props) {
                return config.getIn(['tasks', _this6.getWorkflow(props).get('task')]);
            };

            this.getNextSteps = function (props) {
                var workflow = _this6.getWorkflow(props);
                var nextSteps = workflow.get('nextSteps') || [];

                var onYes = nextSteps.includes('onYes') ? function () {
                    var metaUpdater = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (ii) {
                        return ii;
                    };
                    return workflow.next('onYes', metaUpdater);
                } : function () {
                    return workflow.end();
                };

                var onNo = nextSteps.includes('onNo') ? function () {
                    var metaUpdater = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (ii) {
                        return ii;
                    };
                    return workflow.next('onNo', metaUpdater);
                } : function () {
                    return workflow.end();
                };

                return {
                    onYes: onYes,
                    onNo: onNo
                };
            };

            this.isCurrentTaskBlocking = function (props) {
                if (!props) {
                    props = _this6.props;
                }
                var currentTask = _this6.getCurrentTask(props);
                if (!currentTask) {
                    return false;
                }
                return currentTask.get('blocking', !!currentTask.get('operation'));
            };

            this.entityEditorProps = function () {

                var actions = config.get('actions', (0, _immutable.Map)()).map(function (actionConfig, actionName) {
                    return function (actionProps) {
                        _this6.workflowStart(actionName, actionConfig, actionProps);
                    };
                }).toObject();

                var actionable = !_this6.isCurrentTaskBlocking();
                var currentTask = _this6.getCurrentTask(_this6.props);
                var names = config.itemNames();
                var nextSteps = _this6.getNextSteps(_this6.props);
                var operations = _this6.partiallyApplyOperations(config.get('operations'), _this6.props);

                var _ref4 = _this6.getWorkflow(_this6.props).get('meta') || {},
                    result = _ref4.result;

                var state = _this6.getState(_this6.props).editor;
                var status = currentTask && currentTask.get('status') ? currentTask.get('status')(_extends({}, names, {
                    nextSteps: nextSteps,
                    result: result,
                    state: state
                })) : null;

                return {
                    actions: actions,
                    actionable: actionable,
                    names: names,
                    nextSteps: nextSteps,
                    operations: operations,
                    state: state,
                    status: status
                };
            };
        }, _temp;
    };
};