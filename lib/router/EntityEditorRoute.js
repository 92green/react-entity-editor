'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _EntityEditorRouteHock = require('./EntityEditorRouteHock');

var _EntityEditorRouteHock2 = _interopRequireDefault(_EntityEditorRouteHock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function EntityEditorRoute() {

    return function (ComposedComponent) {
        var EntityEditorRouteWrapper = function (_EntityEditorRouteHoc) {
            _inherits(EntityEditorRouteWrapper, _EntityEditorRouteHoc);

            function EntityEditorRouteWrapper() {
                _classCallCheck(this, EntityEditorRouteWrapper);

                return _possibleConstructorReturn(this, (EntityEditorRouteWrapper.__proto__ || Object.getPrototypeOf(EntityEditorRouteWrapper)).apply(this, arguments));
            }

            _createClass(EntityEditorRouteWrapper, [{
                key: 'render',
                value: function render() {
                    var entityEditorRoutesProps = _extends({}, this.getRouteProps());

                    return _react2.default.createElement(ComposedComponent, _extends({}, this.props, {
                        entityEditorRoutes: entityEditorRoutesProps
                    }));
                }
            }]);

            return EntityEditorRouteWrapper;
        }(_EntityEditorRouteHock2.default);

        EntityEditorRouteWrapper.propTypes = {
            routes: _react.PropTypes.array.isRequired,
            params: _react.PropTypes.object.isRequired,
            router: _react.PropTypes.object
        };

        EntityEditorRouteWrapper.childContextTypes = {
            entityEditorRoutes: _react.PropTypes.object
        };

        return (0, _reactRouter.withRouter)(EntityEditorRouteWrapper);
    };
}

exports.default = EntityEditorRoute;