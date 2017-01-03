'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _EntityEditorRoute = require('./EntityEditorRoute');

var _EntityEditorRoute2 = _interopRequireDefault(_EntityEditorRoute);

var _EntityEditorItemRoute = require('./EntityEditorItemRoute');

var _EntityEditorItemRoute2 = _interopRequireDefault(_EntityEditorItemRoute);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createEditorRoutes(params) {
    var itemComponent = params.itemComponent,
        listComponent = params.listComponent,
        _params$paramId = params.paramId,
        paramId = _params$paramId === undefined ? 'id' : _params$paramId;


    return _react2.default.createElement(
        _reactRouter.Route,
        null,
        listComponent && _react2.default.createElement(_reactRouter.IndexRoute, { component: (0, _EntityEditorRoute2.default)()(listComponent) }),
        itemComponent && _react2.default.createElement(_reactRouter.Route, { path: 'new', component: (0, _EntityEditorItemRoute2.default)({ paramId: paramId })(itemComponent) }),
        itemComponent && _react2.default.createElement(_reactRouter.Route, { path: ':' + paramId + '/edit', component: (0, _EntityEditorItemRoute2.default)({ paramId: paramId })(itemComponent) })
    );
}

exports.default = createEditorRoutes;