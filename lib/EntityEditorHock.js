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

var _Utils = require('./Utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

exports.default = function (options) {
    var userConfig = options.config;
    var additionalOperationProps = options.operationProps ? options.operationProps : function () {};

    var entityEditorProp = options.propNames && options.propNames.entityEditor || "entityEditor";

    return function (ComposedComponent) {
        var EntityEditorHock = function (_Component) {
            _inherits(EntityEditorHock, _Component);

            function EntityEditorHock(props) {
                _classCallCheck(this, EntityEditorHock);

                var _this = _possibleConstructorReturn(this, (EntityEditorHock.__proto__ || Object.getPrototypeOf(EntityEditorHock)).call(this, props));

                _this.componentIsMounted = false;
                _this.state = {
                    dirty: false
                };
                _this.onOperationSuccess = _this.onOperationSuccess.bind(_this);
                _this.onOperationError = _this.onOperationError.bind(_this);
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
                    var _nextProps$workflow = nextProps.workflow,
                        task = _nextProps$workflow.task,
                        end = _nextProps$workflow.end;

                    var workflowTask = userConfig.getIn(['tasks', task]);

                    // if changing to a new task...
                    if (workflowTask && this.props.workflow.task !== nextProps.workflow.task) {

                        // if skip() exists for this task and returns a string, then go there
                        var skip = workflowTask.get('skip');
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
                        var taskFunction = workflowTask.get('operate');
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

                /*
                 * operate
                 */

            }, {
                key: 'operate',
                value: function operate(operateFunction, props) {
                    if (typeof operateFunction != "function") {
                        throw new Error('Entity Editor: task of type "operate" must be a function');
                    }

                    var originalOperations = userConfig.get('operations');
                    var partiallyAppliedOperations = this.partiallyApplyOperations(originalOperations, props);

                    var nextWorkflow = props.workflow;
                    var actionProps = nextWorkflow.meta.actionProps;

                    // TODO ambigious duplicate function call!

                    var partiallyAppliedOperateFunction = operateFunction({
                        operations: partiallyAppliedOperations.toObject(),
                        editorState: this.getEditorState()
                    });

                    (0, _Utils.returnPromise)(partiallyAppliedOperateFunction(actionProps)).then(this.onOperationSuccess(actionProps), this.onOperationError(actionProps));
                }
            }, {
                key: 'partiallyApplyOperations',
                value: function partiallyApplyOperations(operations, props) {
                    var _this3 = this;

                    // create mutable operations object with the aim of passing a reference to it into each partial application
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
                            setEditorState: _this3.setEditorState()
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

                    return (0, _immutable.Map)(mutableOperations);
                }
            }, {
                key: 'onOperationSuccess',
                value: function onOperationSuccess(_ref) {
                    var _this4 = this;

                    var onSuccess = _ref.onSuccess;

                    return function (result) {
                        if (!_this4.componentIsMounted) {
                            return;
                        }
                        onSuccess && onSuccess(result);
                        return _this4.props.workflow.next("onSuccess", _this4.props.workflow.end);
                    };
                }
            }, {
                key: 'onOperationError',
                value: function onOperationError(_ref2) {
                    var _this5 = this;

                    var onError = _ref2.onError;

                    return function (result) {
                        if (!_this5.componentIsMounted) {
                            return;
                        }
                        onError && onError(result);
                        return _this5.props.workflow.next("onError", _this5.props.workflow.end);
                    };
                }

                /*
                 * workflow
                 */

            }, {
                key: 'workflowStart',
                value: function workflowStart(actionName, actionConfig) {
                    var actionProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

                    var workflow = actionConfig.get('workflow');
                    if (!workflow) {
                        throw new Error('EntityEditor error: A workflow must be defined on the config object for ' + actionName);
                    }
                    this.props.workflow.start(workflow.toJS(), actionName, { actionProps: actionProps });
                }

                /*
                 * prop calculation
                 */

            }, {
                key: 'entityEditorProps',
                value: function entityEditorProps(promptProps) {
                    var _this6 = this;

                    var workflow = this.props.workflow;


                    var actions = userConfig.get('actions', (0, _immutable.Map)()).map(function (actionConfig, actionName) {
                        return function (actionProps) {
                            // TODO get workflow as of right now!
                            _this6.workflowStart(actionName, actionConfig, actionProps);
                        };
                    }).toJS();

                    var workflowTask = userConfig.getIn(['tasks', workflow.task]);
                    var promptAsProps = !!workflowTask && workflowTask.get('status') && workflowTask.get('statusStyle') == "props";

                    var prompt = promptAsProps && workflowTask ? workflowTask.get('status')(promptProps) : null;

                    var props = {
                        actions: actions,
                        prompt: prompt
                    };

                    return props;
                }

                /*
                 * render
                 */

            }, {
                key: 'render',
                value: function render() {
                    var workflow = this.props.workflow;

                    var promptProps = _extends({
                        editorState: this.getEditorState()
                    }, userConfig.itemNames());

                    var props = _extends({}, this.props, _defineProperty({}, entityEditorProp, this.entityEditorProps(promptProps)));

                    return _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement(ComposedComponent, props),
                        _react2.default.createElement(_PromptContainer2.default, {
                            workflow: workflow,
                            userConfig: userConfig,
                            promptProps: promptProps
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