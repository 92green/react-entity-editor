'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactModal = require('react-modal');

var _reactModal2 = _interopRequireDefault(_reactModal);

var _ModalContent = require('./ModalContent');

var _ModalContent2 = _interopRequireDefault(_ModalContent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

exports.default = function () {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


    // TODO use stampy style Hock()

    var _config$className = config.className,
        className = _config$className === undefined ? "Modal" : _config$className,
        _config$classNameCont = config.classNameContent,
        classNameContent = _config$classNameCont === undefined ? "Modal_content" : _config$classNameCont,
        _config$content = config.content,
        Content = _config$content === undefined ? _ModalContent2.default : _config$content;


    return function (Component) {
        var _class, _temp2;

        return _temp2 = _class = function (_React$Component) {
            _inherits(EntityEditorModalHock, _React$Component);

            function EntityEditorModalHock() {
                var _ref;

                var _temp, _this, _ret;

                _classCallCheck(this, EntityEditorModalHock);

                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = EntityEditorModalHock.__proto__ || Object.getPrototypeOf(EntityEditorModalHock)).call.apply(_ref, [this].concat(args))), _this), _this.onRequestClose = function () {
                    return _this.props.entityEditor.nextSteps.onNo();
                }, _temp), _possibleConstructorReturn(_this, _ret);
            }

            _createClass(EntityEditorModalHock, [{
                key: 'render',
                value: function render() {
                    var _props$entityEditor = this.props.entityEditor,
                        status = _props$entityEditor.status,
                        nextSteps = _props$entityEditor.nextSteps;


                    var contentLabel = status ? status.title || (status.no ? "Confirm" : "Alert") : "";

                    return _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement(Component, this.props),
                        _react2.default.createElement(
                            _reactModal2.default,
                            {
                                isOpen: !!status,
                                onRequestClose: this.onRequestClose,
                                className: classNameContent,
                                overlayClassName: className,
                                contentLabel: contentLabel
                            },
                            _react2.default.createElement(Content, {
                                status: status,
                                nextSteps: nextSteps
                            })
                        )
                    );
                }
            }]);

            return EntityEditorModalHock;
        }(_react2.default.Component), _class.propTypes = {
            entityEditor: _propTypes2.default.object // TODO make a prop types file with one defintion for each
        }, _temp2;
    };
};