'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _PropChangeListener = require('./PropChangeListener');

var _PropChangeListener2 = _interopRequireDefault(_PropChangeListener);

var _Utils = require('./Utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
// EntityEditor higher order component
// Base entity editor functionality and UI flow without UI elements
//

exports.default = function (config) {
    return function (ComposedComponent) {

        var prompts = config && config.prompts || {};

        var EntityEditor = function (_Component) {
            (0, _inherits3.default)(EntityEditor, _Component);

            function EntityEditor(props) {
                (0, _classCallCheck3.default)(this, EntityEditor);

                var _this = (0, _possibleConstructorReturn3.default)(this, (EntityEditor.__proto__ || (0, _getPrototypeOf2.default)(EntityEditor)).call(this, props));

                _this.state = {
                    dirty: false,
                    prompt: null
                };
                return _this;
            }

            (0, _createClass3.default)(EntityEditor, [{
                key: 'componentWillUnmount',
                value: function componentWillUnmount() {
                    this.closePrompt();
                }

                //
                // helpers - these are inferred from this.props, and passed down as props to child elements
                //

            }, {
                key: 'isNew',
                value: function isNew() {
                    var props = arguments.length <= 0 || arguments[0] === undefined ? this.props : arguments[0];

                    return !props.id;
                }

                //
                // naming / text labels
                //
                // child elements will receive a entityName and actionName prop
                // both are functions that can optionally accept a bunch of strings as arguments
                // to set which text transforms to perform
                // so if the current entityName="dog" and child.props.entityName('first','plural'),
                // then the string "Dogs" will be returned
                // 

            }, {
                key: 'entityName',
                value: function entityName() {

                    return "NOUN";

                    /*console.log(modifications);
                    var name = this.props.entityName;
                    if(!modifications) {
                        return name;
                    }
                    if(modifications.includes('plural')) {
                        name = this.props.entityNamePlural || name+"s";
                    }
                    return this.genericNameTransform(name, modifications);*/
                }
            }, {
                key: 'actionName',
                value: function actionName() {
                    return "ACTION";

                    /*
                    var name = "edit";
                    if(this.isNew()) {
                        name = "add new";
                    }
                    return this.genericNameTransform(name, modifications);*/
                }
            }, {
                key: 'genericNameTransform',
                value: function genericNameTransform(name, modifications) {
                    /*if(modifications.includes('first')) {
                        name = name
                            .charAt(0)
                            .toUpperCase() + name.slice(1);
                    }
                    if(modifications.includes('titleCase')) {
                        name = name
                            .split(" ")
                            .map(word => word
                                .charAt(0)
                                .toUpperCase() + word.slice(1)
                            )
                            .join(" ");
                    }*/
                    return name;
                }

                //
                // handlers
                //

            }, {
                key: 'requestSave',
                value: function requestSave(values) {
                    return this.isNew() ? this.requestCreate(values) : this.requestUpdate(values);
                }
            }, {
                key: 'requestCreate',
                value: function requestCreate(values) {
                    var _this2 = this;

                    // if we need to create but can't do it, reject
                    if (!(0, _Utils.returnBoolean)(this.props.allowCreate)) {
                        return _promise2.default.reject();
                    }

                    // create, then show prompts on success or error
                    return new _promise2.default(function (resolve, reject) {
                        _this2.openPromptCreateConfirm(resolve, reject);
                    }).then(function () {
                        return (0, _Utils.returnPromise)(_this2.props.onCreate(values)).then(function (data) {
                            return new _promise2.default(function (resolve, reject) {
                                _this2.openPromptCreateSuccess(function () {
                                    return resolve(data);
                                }, reject, data.newId);
                            });
                        }, function (error) {
                            return new _promise2.default(function (resolve, reject) {
                                _this2.openPromptErrorOnCreate(resolve, reject, _this2.props.errorCreating);
                            });
                        }).then(_this2.props.afterCreate);
                    }, function () {});
                }
            }, {
                key: 'requestUpdate',
                value: function requestUpdate(values) {
                    var _this3 = this;

                    // if we need to update but can't do it, reject
                    if (!(0, _Utils.returnBoolean)(this.props.allowUpdate, this.props.id)) {
                        return _promise2.default.reject();
                    }

                    // update, then show prompts on success or error
                    return new _promise2.default(function (resolve, reject) {
                        _this3.openPromptUpdateConfirm(resolve, reject);
                    }).then(function () {
                        return (0, _Utils.returnPromise)(_this3.props.onUpdate(_this3.props.id, values)).then(function (data) {
                            return new _promise2.default(function (resolve, reject) {
                                _this3.openPromptUpdateSuccess(function () {
                                    return resolve(data);
                                }, reject);
                            });
                        }, function (error) {
                            return new _promise2.default(function (resolve, reject) {
                                _this3.openPromptErrorOnUpdate(resolve, reject, _this3.props.errorUpdating);
                            });
                        }).then(function () {
                            return _this3.setDirty(false);
                        }).then(_this3.props.afterUpdate);
                    }, function () {});
                }
            }, {
                key: 'requestDelete',
                value: function requestDelete() {
                    var _this4 = this;

                    // if we need to delete but can't do it, reject
                    if (!(0, _Utils.returnBoolean)(this.props.allowDelete, this.props.id)) {
                        return _promise2.default.reject();
                    }

                    return new _promise2.default(function (resolve, reject) {
                        _this4.openPromptDeleteConfirm(resolve, reject);
                    }).then(function () {
                        return (0, _Utils.returnPromise)(_this4.props.onDelete(_this4.props.id)).then(function (data) {
                            return new _promise2.default(function (resolve, reject) {
                                _this4.openPromptDeleteSuccess(function () {
                                    return resolve(data);
                                }, reject);
                            });
                        }, function (error) {
                            return new _promise2.default(function (resolve, reject) {
                                _this4.openPromptErrorOnDelete(resolve, reject, _this4.props.errorDeleting);
                            });
                        }).then(_this4.props.afterDelete);
                    }, function () {});
                }
            }, {
                key: 'requestClose',
                value: function requestClose() {
                    var _this5 = this;

                    return new _promise2.default(function (resolve, reject) {
                        if (_this5.state.dirty) {
                            _this5.openPromptCloseConfirm(resolve, reject);
                        } else {
                            resolve();
                            _this5.props.onClose();
                        }
                    });
                }
            }, {
                key: 'requestResetConfirm',
                value: function requestResetConfirm() {
                    var _this6 = this;

                    return new _promise2.default(function (resolve, reject) {
                        if (_this6.state.dirty) {
                            _this6.openPromptResetConfirm(resolve, reject);
                        } else {
                            reject();
                        }
                    }).then(function () {
                        return _this6.setDirty(false);
                    });
                }
            }, {
                key: 'setDirty',
                value: function setDirty() {
                    var dirty = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

                    this.setState({ dirty: dirty });
                }

                //
                // prompts
                //

            }, {
                key: 'openPrompt',
                value: function openPrompt(name, props) {
                    var chosenName = typeof name == "string" ? name : (0, _immutable.fromJS)(name).find(function (nn) {
                        return prompts.hasOwnProperty(nn);
                    });

                    if (!prompts[chosenName]) {
                        props.onYes();
                        return;
                    }

                    var prompt = prompts[chosenName]((0, _extends3.default)({}, props, {
                        entity: this.entityName,
                        action: this.actionName
                    }));

                    this.setState({ prompt: prompt });
                }
            }, {
                key: 'closePrompt',
                value: function closePrompt() {
                    this.setState({ prompt: null });
                }
            }, {
                key: 'openPromptCreateSuccess',
                value: function openPromptCreateSuccess(resolve, reject, newId) {
                    var _this7 = this;

                    this.openPrompt(["createSuccess", "saveSuccess", "writeSuccess"], {
                        onYes: function onYes() {
                            if (_this7.props.onGotoEdit && (0, _Utils.returnBoolean)(_this7.props.allowUpdate, newId)) {
                                _this7.props.onGotoEdit(newId);
                            } else {
                                resolve();
                                _this7.props.onClose();
                            }
                        }
                    });
                }
            }, {
                key: 'openPromptUpdateSuccess',
                value: function openPromptUpdateSuccess(resolve, reject) {
                    this.openPrompt(["updateSuccess", "saveSuccess", "writeSuccess"], {
                        onYes: resolve
                    });
                }
            }, {
                key: 'openPromptDeleteSuccess',
                value: function openPromptDeleteSuccess(resolve, reject) {
                    var _this8 = this;

                    this.openPrompt(["deleteSuccess", "writeSuccess"], {
                        onYes: function onYes() {
                            resolve();
                            _this8.props.onClose();
                        }
                    });
                }
            }, {
                key: 'openPromptCreateConfirm',
                value: function openPromptCreateConfirm(resolve, reject) {
                    this.openPrompt(["createConfirm", "saveConfirm", "writeConfirm"], {
                        onYes: resolve,
                        onNo: reject
                    });
                }
            }, {
                key: 'openPromptUpdateConfirm',
                value: function openPromptUpdateConfirm(resolve, reject) {
                    this.openPrompt(["updateConfirm", "saveConfirm", "writeConfirm"], {
                        onYes: resolve,
                        onNo: reject
                    });
                }
            }, {
                key: 'openPromptDeleteConfirm',
                value: function openPromptDeleteConfirm(resolve, reject) {
                    this.openPrompt(["deleteConfirm", "writeConfirm"], {
                        onYes: resolve,
                        onNo: reject
                    });
                }
            }, {
                key: 'openPromptCloseConfirm',
                value: function openPromptCloseConfirm(resolve, reject) {
                    var _this9 = this;

                    this.openPrompt("closeConfirm", {
                        onYes: function onYes() {
                            resolve();
                            _this9.props.onClose();
                        },
                        onNo: reject()
                    });
                }
            }, {
                key: 'openPromptResetConfirm',
                value: function openPromptResetConfirm(resolve, reject) {
                    this.openPrompt("resetConfirm", {
                        onYes: resolve,
                        onNo: reject
                    });
                }
            }, {
                key: 'openPromptErrorOnRead',
                value: function openPromptErrorOnRead(resolve, reject, error) {
                    this.openPrompt(["errorOnCreate", "errorOnWrite"], {
                        error: error,
                        onYes: resolve
                    });
                }
            }, {
                key: 'openPromptErrorOnCreate',
                value: function openPromptErrorOnCreate(resolve, reject, error) {
                    this.openPrompt(["errorOnCreate", "errorOnWrite"], {
                        error: error,
                        onYes: resolve
                    });
                }
            }, {
                key: 'openPromptErrorOnUpdate',
                value: function openPromptErrorOnUpdate(resolve, reject, error) {
                    this.openPrompt(["errorOnUpdate", "errorOnWrite"], {
                        error: error,
                        onYes: resolve
                    });
                }
            }, {
                key: 'openPromptErrorOnDelete',
                value: function openPromptErrorOnDelete(resolve, reject, error) {
                    this.openPrompt(["errorOnDelete", "errorOnWrite"], {
                        error: error,
                        onYes: resolve
                    });
                }

                //
                // render
                //

            }, {
                key: 'render',
                value: function render() {
                    var _props = this.props;
                    var children = _props.children;
                    var id = _props.id;
                    var isReading = _props.isReading;
                    var isCreating = _props.isCreating;
                    var isUpdating = _props.isUpdating;
                    var isDeleting = _props.isDeleting;
                    var errorReading = _props.errorReading;
                    var errorCreating = _props.errorCreating;
                    var errorUpdating = _props.errorUpdating;
                    var errorDeleting = _props.errorDeleting;


                    var isNew = this.isNew();

                    // inferred data transaction states
                    var saving = isCreating || isUpdating;
                    var fetching = isReading || isCreating || isUpdating || isDeleting;

                    // inferred abilities
                    var canDelete = !fetching && !isNew && (0, _Utils.returnBoolean)(this.props.allowDelete, id);
                    var canReset = !isNew && this.state.dirty;
                    var canSaveNew = !fetching && !isNew && (0, _Utils.returnBoolean)(this.props.allowCreate);
                    var canSave = !fetching && (isNew ? (0, _Utils.returnBoolean)(this.props.allowCreate) : (0, _Utils.returnBoolean)(this.props.allowUpdate, id));

                    console.log(canSave);

                    var propsToRemove = _immutable.List.of('id',
                    // prompts
                    'prompt', 'closePrompt',
                    // data transaction states
                    'isReading', 'isCreating', 'isUpdating', 'isDeleting',
                    // errors
                    'errorReading', 'errorCreating', 'errorUpdating', 'errorDeleting',
                    // allowances
                    'allowCreate', 'allowUpdate', 'allowDelete',
                    // callbacks
                    'onRead', 'onCreate', 'onUpdate', 'onDelete', 'onClose', 'onGotoEdit',
                    // after callbacks
                    'afterRead', 'afterCreate', 'afterUpdate', 'afterDelete', 'afterClose',
                    // naming
                    'entityName', 'entityNamePlural');

                    var filteredProps = propsToRemove.reduce(function (filteredProps, propToRemove) {
                        return filteredProps.delete(propToRemove);
                    }, (0, _immutable.fromJS)(this.props)).toJS();

                    return _react2.default.createElement(ComposedComponent, (0, _extends3.default)({}, filteredProps, {

                        id: id,
                        isNew: isNew,

                        canDelete: canDelete,
                        canReset: canReset,
                        canSave: canSave,
                        canSaveNew: canSaveNew,

                        prompt: this.state.prompt,
                        closePrompt: this.closePrompt.bind(this),

                        isReading: isReading,
                        isCreating: isCreating,
                        isUpdating: isUpdating,
                        isDeleting: isDeleting,
                        saving: saving,
                        fetching: fetching,

                        errorReading: !isNew && errorReading,
                        errorCreating: errorCreating,
                        errorUpdating: errorUpdating,
                        errorDeleting: errorDeleting,

                        onSave: this.requestSave.bind(this),
                        onSaveNew: this.requestCreate.bind(this),
                        onClose: this.requestClose.bind(this),
                        onDelete: this.requestDelete.bind(this),
                        onResetConfirm: this.requestResetConfirm.bind(this),
                        onDirty: this.setDirty.bind(this),

                        entityName: this.entityName.bind(this),
                        actionName: this.actionName.bind(this)
                    }));
                }
            }]);
            return EntityEditor;
        }(_react.Component);

        EntityEditor.propTypes = {
            // id and values: editor will edit item if id is set, or create new if this is not set
            id: _react.PropTypes.any,
            // prompts
            prompt: _react.PropTypes.string,
            closePrompt: _react.PropTypes.func,
            // data transaction states
            isReading: _react.PropTypes.bool,
            isCreating: _react.PropTypes.bool,
            isUpdating: _react.PropTypes.bool,
            isDeleting: _react.PropTypes.bool,
            // errors
            errorReading: _react.PropTypes.any,
            errorCreating: _react.PropTypes.any,
            errorUpdating: _react.PropTypes.any,
            errorDeleting: _react.PropTypes.any,
            // allowances
            allowRead: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.func // is passed (id)
            ]),
            allowCreate: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.func // is passed nothing
            ]),
            allowUpdate: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.func // is passed (id)
            ]),
            allowDelete: _react.PropTypes.oneOfType([_react.PropTypes.bool, // is passed (id)
            _react.PropTypes.func]),
            // callbacks
            onRead: _react.PropTypes.func,
            onCreate: _react.PropTypes.func,
            onUpdate: _react.PropTypes.func,
            onDelete: _react.PropTypes.func,
            onClose: _react.PropTypes.func.isRequired,
            onGotoEdit: _react.PropTypes.func,
            // after callbacks fired on success (must each return a resolved promise)
            afterRead: _react.PropTypes.func,
            afterCreate: _react.PropTypes.func,
            afterUpdate: _react.PropTypes.func,
            afterDelete: _react.PropTypes.func,
            afterClose: _react.PropTypes.func,
            // naming
            entityName: _react.PropTypes.string,
            entityNamePlural: _react.PropTypes.string
        };

        EntityEditor.defaultProps = {
            // data transaction states
            isReading: false,
            isCreating: false,
            isUpdating: false,
            isDeleting: false,
            // allowances
            allowRead: true,
            allowCreate: true,
            allowUpdate: true,
            allowDelete: true,
            // after callbacks
            afterRead: function afterRead(data) {
                return _promise2.default.resolve(data);
            },
            afterCreate: function afterCreate(data) {
                return _promise2.default.resolve(data);
            },
            afterUpdate: function afterUpdate(data) {
                return _promise2.default.resolve(data);
            },
            afterDelete: function afterDelete(data) {
                return _promise2.default.resolve(data);
            },
            afterClose: function afterClose(data) {
                return _promise2.default.resolve(data);
            },
            // naming
            entityName: "item",
            entityNamePlural: "items"
        };

        var propChangeListener = (0, _PropChangeListener2.default)(['id'], function (props) {
            var allowRead = typeof props.allowRead == "undefined" ? true : props.allowRead;

            if (props.id && props.onRead && (0, _Utils.returnBoolean)(allowRead, props.id)) {
                var readResults = props.onRead(props.id);
                if (props.afterRead) {
                    (0, _Utils.returnPromise)(readResult).then(props.afterRead);
                }
            }
        });

        return propChangeListener(EntityEditor);
    };
};