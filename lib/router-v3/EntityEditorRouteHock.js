'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _immutable = require('immutable');

var _EntityEditorConfig = require('../config/EntityEditorConfig');

var _EntityEditorConfig2 = _interopRequireDefault(_EntityEditorConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var entityEditorRoutePatterns = _immutable.List.of(/^new$/, /\/edit$/);

var EntityEditorRouteHock = function (_Component) {
    _inherits(EntityEditorRouteHock, _Component);

    function EntityEditorRouteHock(props) {
        _classCallCheck(this, EntityEditorRouteHock);

        var _this = _possibleConstructorReturn(this, (EntityEditorRouteHock.__proto__ || Object.getPrototypeOf(EntityEditorRouteHock)).call(this, props));

        _this.leaveHookSet = false;
        return _this;
    }

    _createClass(EntityEditorRouteHock, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            var _this2 = this;

            this.onLeaveHook = function (callback) {
                if (_this2.leaveHookSet) {
                    return;
                }
                _this2.props.router.setRouteLeaveHook(_this2.props.route, callback);
                _this2.leaveHookSet = true;
            };
        }
    }, {
        key: 'inferBasePath',
        value: function inferBasePath(routes) {
            return "/" + (0, _immutable.fromJS)(routes).filter(function (ii) {
                return !!ii.get('path') && ii.get('path') != "/";
            }) // remove routes that don't add to the path
            .map(function (ii) {
                return ii.get('path');
            }) // get path for each route
            .takeWhile(function (path) {
                // only keep routes not made by entity editor
                return !entityEditorRoutePatterns.some(function (test) {
                    return test.test(path);
                });
            }).join("/");
        }

        // have one specifically for context?
        // also, how do we let this be defined outside of react?

    }, {
        key: 'getRouteProps',
        value: function getRouteProps() {
            var _props = this.props,
                router = _props.router,
                routes = _props.routes;


            var base = this.inferBasePath(routes);
            var paths = function paths(id) {
                return {
                    base: base,
                    list: base,
                    new: base + '/new',
                    edit: base + '/' + id + '/edit'
                };
            };

            var confirmLeave = {
                confirm: {
                    showWhen: function showWhen(_ref) {
                        var dirty = _ref.dirty;
                        return dirty;
                    },
                    title: 'Unsaved changes',
                    message: function message() {
                        return React.createElement(
                            'span',
                            null,
                            'You have unsaved changes. What would you like to do?'
                        );
                    },
                    yes: 'Discard changes',
                    no: 'Keep editing'
                }
            };

            var config = (0, _EntityEditorConfig2.default)({
                operations: {
                    onGoList: function onGoList() {
                        return function () {
                            router.push(paths().list);
                        };
                    },
                    onGoNew: function onGoNew() {
                        return function () {
                            router.push(paths().new);
                        };
                    },
                    onGoEdit: function onGoEdit() {
                        return function (props) {
                            router.push(paths(props.id).edit);
                        };
                    }
                },
                actions: {
                    goList: function goList(_ref2) {
                        var operations = _ref2.operations;
                        return function (actionProps) {
                            return operations.onGoList().then(function (result) {
                                return { result: result, actionProps: actionProps, called: 'onGoList' };
                            });
                        };
                    },
                    goNew: function goNew(_ref3) {
                        var operations = _ref3.operations;
                        return function (actionProps) {
                            return operations.onGoNew().then(function (result) {
                                return { result: result, actionProps: actionProps, called: 'onGoNew' };
                            });
                        };
                    },
                    goEdit: function goEdit(_ref4) {
                        var operations = _ref4.operations;
                        return function (actionProps) {
                            if (!actionProps.id) {
                                throw 'EntityEditor: config.actions.goEdit: actionProps.id is not defined';
                            }
                            return operations.onGoEdit({ id: actionProps.id }).then(function (result) {
                                return { result: result, actionProps: actionProps, called: 'onGoEdit' };
                            });
                        };
                    }
                },
                prompts: {
                    goList: confirmLeave,
                    goNew: confirmLeave,
                    goEdit: confirmLeave
                },
                excludePending: {
                    goList: true,
                    goNew: true,
                    goEdit: true
                }
            });

            return {
                props: {
                    paths: paths
                },
                config: config
            };
        }
    }]);

    return EntityEditorRouteHock;
}(_react.Component);

exports.default = EntityEditorRouteHock;