'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

exports.default = function () {
    return function (ComposedComponent) {
        var WorkflowDecorator = function (_Component) {
            _inherits(WorkflowDecorator, _Component);

            // keep flow happy by specifying members mentioned in constructor
            function WorkflowDecorator(props) {
                _classCallCheck(this, WorkflowDecorator);

                var _this = _possibleConstructorReturn(this, (WorkflowDecorator.__proto__ || Object.getPrototypeOf(WorkflowDecorator)).call(this, props));

                _this.state = {
                    workflow: null,
                    name: null,
                    meta: null
                };

                _this.workflowStart = _this.workflowStart.bind(_this);
                _this.workflowNext = _this.workflowNext.bind(_this);
                _this.workflowEnd = _this.workflowEnd.bind(_this);
                return _this;
            }

            /*
             * workflow
             */

            _createClass(WorkflowDecorator, [{
                key: 'workflowSet',
                value: function workflowSet(options) {
                    var workflow = options.workflow,
                        name = options.name,
                        meta = options.meta;

                    this.setState({
                        workflow: workflow,
                        name: name,
                        meta: meta
                    });
                }
            }, {
                key: 'workflowStart',
                value: function workflowStart(workflow, name) {
                    var meta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

                    if (this.state.workflow) {
                        return;
                    }
                    this.workflowSet({
                        workflow: workflow,
                        name: name,
                        meta: meta
                    });
                }
            }, {
                key: 'workflowNext',
                value: function workflowNext(nextStep, fallback) {
                    var workflow = this.state.workflow;

                    if (!workflow.next) {
                        if (fallback) {
                            fallback(nextStep);
                            return;
                        }
                        throw new Error('Entity Editor error: cannot go to next step, "' + this.state.name + '" does not have a "next" object.');
                    }

                    if (!workflow.next.hasOwnProperty(nextStep)) {
                        if (fallback) {
                            fallback(nextStep);
                            return;
                        }
                        throw new Error('Entity Editor error: "' + nextStep + '" is not a valid nextStep, and no fallback is provided.');
                    }

                    this.workflowSet({
                        workflow: workflow.next[nextStep],
                        name: this.state.name,
                        meta: this.state.meta
                    });
                }
            }, {
                key: 'workflowEnd',
                value: function workflowEnd() {
                    this.workflowSet({});
                }

                /*
                 * render
                 */

            }, {
                key: 'render',
                value: function render() {
                    var _state = this.state,
                        workflow = _state.workflow,
                        name = _state.name,
                        meta = _state.meta;

                    var task = workflow ? workflow.task : null;

                    var nextSteps = Object.assign({}, workflow);
                    delete nextSteps.task;

                    return _react2.default.createElement(ComposedComponent, _extends({}, this.props, {
                        workflow: {
                            name: name,
                            meta: meta || {},
                            task: task,
                            nextSteps: nextSteps,
                            start: this.workflowStart,
                            next: this.workflowNext,
                            end: this.workflowEnd
                        }
                    }));
                }
            }]);

            return WorkflowDecorator;
        }(_react.Component);

        return WorkflowDecorator;
    };
};