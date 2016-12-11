'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.createEditorRoutes = createEditorRoutes;
exports.wrapItemComponent = wrapItemComponent;
exports.wrapListComponent = wrapListComponent;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var entityEditorRoutePatterns = _immutable.List.of(/^new$/, /\/edit$/);

function createEditorRoutes(params) {
    var itemComponent = params.itemComponent,
        listComponent = params.listComponent,
        _params$paramId = params.paramId,
        paramId = _params$paramId === undefined ? 'id' : _params$paramId;


    return _react2.default.createElement(
        _reactRouter.Route,
        null,
        listComponent && _react2.default.createElement(_reactRouter.IndexRoute, { component: wrapListComponent()(listComponent) }),
        itemComponent && _react2.default.createElement(_reactRouter.Route, { path: 'new', component: wrapItemComponent({ paramId: paramId })(itemComponent) }),
        itemComponent && _react2.default.createElement(_reactRouter.Route, { path: ':' + paramId + '/edit', component: wrapItemComponent({ paramId: paramId })(itemComponent) })
    );
}

function getBasePath(routes) {
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

function getRouteProps(props) {
    var router = props.router,
        routes = props.routes;


    var base = getBasePath(routes);
    var paths = function paths(id) {
        return {
            base: base,
            list: base,
            new: base + '/new',
            edit: base + '/' + id + '/edit'
        };
    };

    var callbacks = {
        onGoList: function onGoList() {
            router.push(paths().list);
        },
        onGoNew: function onGoNew() {
            router.push(paths().new);
        },
        onGoEdit: function onGoEdit(props) {
            router.push(paths(props.id).edit);
        }
    };

    return {
        paths: paths,
        callbacks: callbacks
    };
}

var EntityEditorWrapper = function (_Component) {
    _inherits(EntityEditorWrapper, _Component);

    function EntityEditorWrapper() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, EntityEditorWrapper);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = EntityEditorWrapper.__proto__ || Object.getPrototypeOf(EntityEditorWrapper)).call.apply(_ref, [this].concat(args))), _this), _this.leaveHookSet = false, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(EntityEditorWrapper, [{
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
        key: 'getChildContext',
        value: function getChildContext() {
            return {
                entityEditorRoutes: _extends({}, getRouteProps(this.props), {
                    onLeaveHook: this.onLeaveHook
                })
            };
        }
    }]);

    return EntityEditorWrapper;
}(_react.Component);

function wrapItemComponent() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var paramId = config.paramId;


    return function (ComposedComponent) {
        var EntityEditorItemWrapper = function (_EntityEditorWrapper) {
            _inherits(EntityEditorItemWrapper, _EntityEditorWrapper);

            function EntityEditorItemWrapper() {
                _classCallCheck(this, EntityEditorItemWrapper);

                return _possibleConstructorReturn(this, (EntityEditorItemWrapper.__proto__ || Object.getPrototypeOf(EntityEditorItemWrapper)).apply(this, arguments));
            }

            _createClass(EntityEditorItemWrapper, [{
                key: 'render',
                value: function render() {
                    var entityEditorRoutesProps = _extends({}, getRouteProps(this.props), {
                        id: this.props.params[paramId]
                    });

                    return _react2.default.createElement(ComposedComponent, _extends({}, this.props, {
                        entityEditorRoutes: entityEditorRoutesProps
                    }));
                }
            }]);

            return EntityEditorItemWrapper;
        }(EntityEditorWrapper);

        EntityEditorItemWrapper.propTypes = {
            routes: _react.PropTypes.array.isRequired,
            params: _react.PropTypes.object.isRequired,
            router: _react.PropTypes.object
        };

        EntityEditorItemWrapper.childContextTypes = {
            entityEditorRoutes: _react.PropTypes.object
        };

        return (0, _reactRouter.withRouter)(EntityEditorItemWrapper);
    };
}

function wrapListComponent() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


    return function (ComposedComponent) {
        var EntityEditorListWrapper = function (_EntityEditorWrapper2) {
            _inherits(EntityEditorListWrapper, _EntityEditorWrapper2);

            function EntityEditorListWrapper() {
                _classCallCheck(this, EntityEditorListWrapper);

                return _possibleConstructorReturn(this, (EntityEditorListWrapper.__proto__ || Object.getPrototypeOf(EntityEditorListWrapper)).apply(this, arguments));
            }

            _createClass(EntityEditorListWrapper, [{
                key: 'render',
                value: function render() {
                    var entityEditorRoutesProps = _extends({}, getRouteProps(this.props));

                    return _react2.default.createElement(ComposedComponent, _extends({}, this.props, {
                        entityEditorRoutes: entityEditorRoutesProps
                    }));
                }
            }]);

            return EntityEditorListWrapper;
        }(EntityEditorWrapper);

        EntityEditorListWrapper.propTypes = {
            routes: _react.PropTypes.array.isRequired,
            params: _react.PropTypes.object.isRequired,
            router: _react.PropTypes.object
        };

        EntityEditorListWrapper.childContextTypes = {
            entityEditorRoutes: _react.PropTypes.object
        };

        return (0, _reactRouter.withRouter)(EntityEditorListWrapper);
    };
}