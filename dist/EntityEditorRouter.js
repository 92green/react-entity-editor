'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.createEditorRoutes = createEditorRoutes;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
// Function to create a routing pattern for use with this editor
//

function createEditorRoutes(params) {
    params = (0, _assign2.default)({}, {
        paramId: 'id'
    }, params);

    if (!params || !params.path || !params.component) {
        throw "Create editor routes must be passed an object with 'path' and 'component' keys, where the path is a string of the route path, and the component is the editor component to be used in the routes.";
    }

    var routerComponent = CreateEntityEditorRouter(params);

    return _react2.default.createElement(
        _reactRouter.Route,
        { path: params.path },
        _react2.default.createElement(
            _reactRouter.Route,
            { path: 'new', component: routerComponent },
            _react2.default.createElement(_reactRouter.IndexRoute, { component: params.component })
        ),
        _react2.default.createElement(
            _reactRouter.Route,
            { path: ':' + params.paramId + '/edit', component: routerComponent },
            _react2.default.createElement(_reactRouter.IndexRoute, { component: params.component })
        )
    );
};

//
// EntityEditorRouter class
//

function CreateEntityEditorRouter(params) {
    var EntityEditorRouter = function (_Component) {
        (0, _inherits3.default)(EntityEditorRouter, _Component);

        function EntityEditorRouter() {
            (0, _classCallCheck3.default)(this, EntityEditorRouter);
            return (0, _possibleConstructorReturn3.default)(this, (EntityEditorRouter.__proto__ || (0, _getPrototypeOf2.default)(EntityEditorRouter)).apply(this, arguments));
        }

        (0, _createClass3.default)(EntityEditorRouter, [{
            key: 'componentWillMount',
            value: function componentWillMount() {
                var _this2 = this;

                this.onLeaveHook = function (callback) {
                    _this2.props.router.setRouteLeaveHook(_this2.props.route, callback);
                };
            }

            //
            // navigation
            //

        }, {
            key: 'getBaseRoute',
            value: function getBaseRoute() {
                var routesLength = this.props.routes.length;
                return "/" + (0, _immutable.fromJS)(this.props.routes).filter(function (ii) {
                    return !!ii.get('path') && ii.get('path') != "/";
                }) // remove routes that don't add to the path
                .map(function (ii) {
                    return ii.get('path');
                }) // get path for each route
                .pop() // remove last route (the 'new' or 'edit' route) to get base
                .join("/");
            }
        }, {
            key: 'getEditorRoute',
            value: function getEditorRoute(type) {
                var id = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

                var base = this.getBaseRoute();
                if (!id) {
                    id = this.props.params[params.paramId];
                }
                if (type == 'close') {
                    return base;
                }
                if (!id || type == 'new') {
                    return base + '/new';
                }
                if (type == 'edit') {
                    return base + '/' + id + '/' + type;
                }
                return null;
            }
        }, {
            key: 'onClose',
            value: function onClose() {
                this.props.router.push(this.getEditorRoute('close'));
            }
        }, {
            key: 'onGotoEdit',
            value: function onGotoEdit() {
                var id = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

                this.props.router.push(this.getEditorRoute('edit', id));
            }

            //
            // render
            //

        }, {
            key: 'render',
            value: function render() {
                console.log(this.thing);

                var propsToAddToChildren = {
                    id: this.props.params[params.paramId],
                    onClose: this.onClose.bind(this),
                    onLeaveHook: this.onLeaveHook,
                    onGotoEdit: this.onGotoEdit.bind(this),
                    getEditorRoute: this.getEditorRoute.bind(this)
                };

                var childrenWithProps = _react2.default.Children.map(this.props.children, function (child) {
                    return _react2.default.cloneElement(child, propsToAddToChildren);
                });
                return _react2.default.createElement(
                    'div',
                    null,
                    childrenWithProps
                );
            }
        }]);
        return EntityEditorRouter;
    }(_react.Component);

    EntityEditorRouter.propTypes = {
        // routes
        routes: _react.PropTypes.array.isRequired,
        params: _react.PropTypes.object.isRequired,
        router: _react.PropTypes.object
    };

    return (0, _reactRouter.withRouter)(EntityEditorRouter);
}