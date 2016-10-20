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

        var configPrompts = config && config.prompts || {};
        var configWords = config && config.words || {};

        var EntityEditor = function (_Component) {
            (0, _inherits3.default)(EntityEditor, _Component);

            function EntityEditor(props) {
                (0, _classCallCheck3.default)(this, EntityEditor);

                var _this = (0, _possibleConstructorReturn3.default)(this, (EntityEditor.__proto__ || (0, _getPrototypeOf2.default)(EntityEditor)).call(this, props));

                _this.state = {
                    dirty: false,
                    prompt: null
                };
                _this.allowLeave = false;
                return _this;
            }

            (0, _createClass3.default)(EntityEditor, [{
                key: 'componentWillMount',
                value: function componentWillMount() {
                    var _this2 = this;

                    if (this.props.onLeaveHook) {
                        this.props.onLeaveHook(function (a, b) {
                            if (_this2.allowLeave) {
                                return true;
                            }
                            _this2.requestClose();
                            return false;
                        });
                    }
                }
            }, {
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

            }, {
                key: 'entityName',
                value: function entityName() {
                    for (var _len = arguments.length, modifiers = Array(_len), _key = 0; _key < _len; _key++) {
                        modifiers[_key] = arguments[_key];
                    }

                    var entityName = configWords.entityName(this.props, modifiers);
                    return this.applyNameModifiers(entityName, modifiers);
                }
            }, {
                key: 'actionName',
                value: function actionName() {
                    for (var _len2 = arguments.length, modifiers = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                        modifiers[_key2] = arguments[_key2];
                    }

                    var actionName = configWords.actionName(this.props, modifiers, this.isNew());
                    return this.applyNameModifiers(actionName, modifiers);
                }
            }, {
                key: 'applyNameModifiers',
                value: function applyNameModifiers(words, modifiers) {
                    return modifiers.reduce(function (words, modifier) {
                        if (!configWords.modifiers.hasOwnProperty(modifier)) {
                            throw modifier + ' is not a valid modifier. The following are valid modifiers according to the config passed into Entity Editor: {words.modifiers.join(\', \')}';
                        }
                        return configWords.modifiers[modifier](words);
                    }, words);
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
                key: 'requestSaveNew',
                value: function requestSaveNew(values) {
                    var _this3 = this;

                    // if we need to create but can't do it, reject
                    if (!(0, _Utils.returnBoolean)(this.props.allowCreate)) {
                        return _promise2.default.reject();
                    }

                    return new _promise2.default(function (resolve, reject) {
                        _this3.openPromptSaveNewConfirm(resolve, reject);
                    }).then(function () {
                        return _this3.requestCreate(values);
                    }, function () {});
                }
            }, {
                key: 'requestCreate',
                value: function requestCreate(values) {
                    var _this4 = this;

                    // if we need to create but can't do it, reject
                    if (!(0, _Utils.returnBoolean)(this.props.allowCreate)) {
                        return _promise2.default.reject();
                    }

                    return new _promise2.default(function (resolve, reject) {
                        _this4.openPromptCreateConfirm(resolve, reject);
                    }).then(function () {
                        return (0, _Utils.returnPromise)(_this4.props.onCreate(values)).then(function (data) {
                            return new _promise2.default(function (resolve, reject) {
                                _this4.openPromptCreateSuccess(function () {
                                    return resolve(data);
                                }, reject, data.newId);
                            });
                        }, function (error) {
                            return new _promise2.default(function (resolve, reject) {
                                _this4.openPromptErrorOnCreate(resolve, reject, _this4.props.errorOnCreate);
                            });
                        }).then(_this4.props.afterCreate);
                    }, function () {});
                }
            }, {
                key: 'requestUpdate',
                value: function requestUpdate(values) {
                    var _this5 = this;

                    // if we need to update but can't do it, reject
                    if (!(0, _Utils.returnBoolean)(this.props.allowUpdate, this.props.id)) {
                        return _promise2.default.reject();
                    }

                    return new _promise2.default(function (resolve, reject) {
                        _this5.openPromptUpdateConfirm(resolve, reject);
                    }).then(function () {
                        return (0, _Utils.returnPromise)(_this5.props.onUpdate(_this5.props.id, values)).then(function (data) {
                            return new _promise2.default(function (resolve, reject) {
                                _this5.openPromptUpdateSuccess(function () {
                                    return resolve(data);
                                }, reject);
                            });
                        }, function (error) {
                            return new _promise2.default(function (resolve, reject) {
                                _this5.openPromptErrorOnUpdate(resolve, reject, _this5.props.errorOnUpdate);
                            });
                        }).then(function () {
                            return _this5.setDirty(false);
                        }).then(_this5.props.afterUpdate);
                    }, function () {});
                }
            }, {
                key: 'requestDelete',
                value: function requestDelete() {
                    var _this6 = this;

                    // if we need to delete but can't do it, reject
                    if (!(0, _Utils.returnBoolean)(this.props.allowDelete, this.props.id)) {
                        return _promise2.default.reject();
                    }

                    return new _promise2.default(function (resolve, reject) {
                        _this6.openPromptDeleteConfirm(resolve, reject);
                    }).then(function () {
                        return (0, _Utils.returnPromise)(_this6.props.onDelete(_this6.props.id)).then(function (data) {
                            return new _promise2.default(function (resolve, reject) {
                                _this6.openPromptDeleteSuccess(function () {
                                    return resolve(data);
                                }, reject);
                            });
                        }, function (error) {
                            return new _promise2.default(function (resolve, reject) {
                                _this6.openPromptErrorOnDelete(resolve, reject, _this6.props.errorOnDelete);
                            });
                        }).then(_this6.props.afterDelete);
                    }, function () {});
                }
            }, {
                key: 'requestClose',
                value: function requestClose() {
                    var _this7 = this;

                    return new _promise2.default(function (resolve, reject) {
                        if (_this7.state.dirty) {
                            _this7.openPromptCloseConfirm(resolve, reject);
                        } else {
                            resolve();
                            _this7.handleClose();
                        }
                    });
                }
            }, {
                key: 'requestResetConfirm',
                value: function requestResetConfirm() {
                    var _this8 = this;

                    return new _promise2.default(function (resolve, reject) {
                        if (_this8.state.dirty) {
                            _this8.openPromptResetConfirm(resolve, reject);
                        } else {
                            reject();
                        }
                    }).then(function () {
                        return _this8.setDirty(false);
                    });
                }
            }, {
                key: 'requestCustomConfirm',
                value: function requestCustomConfirm(func) {
                    var _this9 = this;

                    return new _promise2.default(function (resolve, reject) {
                        var prompt = (0, _extends3.default)({}, func({
                            entityName: _this9.entityName.bind(_this9),
                            actionName: _this9.actionName.bind(_this9)
                        }), {
                            onYes: resolve,
                            onNo: reject
                        });
                        _this9.setState({ prompt: prompt });
                    });
                }
            }, {
                key: 'setDirty',
                value: function setDirty() {
                    var dirty = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

                    this.setState({ dirty: dirty });
                }
            }, {
                key: 'handleClose',
                value: function handleClose() {
                    this.allowLeave = true;
                    this.props.onClose();
                }

                //
                // prompts
                //

            }, {
                key: 'openPrompt',
                value: function openPrompt(name, props) {
                    var chosenName = typeof name == "string" ? name : (0, _immutable.fromJS)(name).find(function (nn) {
                        return configPrompts.hasOwnProperty(nn);
                    });

                    if (!configPrompts[chosenName]) {
                        props.onYes();
                        return;
                    }

                    var prompt = configPrompts[chosenName]((0, _extends3.default)({}, props, {
                        entityName: this.entityName.bind(this),
                        actionName: this.actionName.bind(this)
                    }));

                    this.setState({
                        prompt: (0, _extends3.default)({}, prompt, {
                            open: true
                        })
                    });
                }
            }, {
                key: 'closePrompt',
                value: function closePrompt() {
                    this.setState({
                        prompt: (0, _extends3.default)({}, this.state.prompt, {
                            open: false
                        })
                    });
                }
            }, {
                key: 'openPromptCreateSuccess',
                value: function openPromptCreateSuccess(resolve, reject, newId) {
                    var _this10 = this;

                    this.openPrompt(["createSuccess", "saveSuccess", "writeSuccess"], {
                        onYes: function onYes() {
                            if (_this10.props.onGotoEdit && (0, _Utils.returnBoolean)(_this10.props.allowUpdate, newId)) {
                                _this10.props.onGotoEdit(newId);
                            } else {
                                resolve();
                                _this10.handleClose();
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
                    var _this11 = this;

                    this.openPrompt(["deleteSuccess", "writeSuccess"], {
                        onYes: function onYes() {
                            console.log("about to close");
                            resolve();
                            _this11.handleClose();
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
                key: 'openPromptSaveNewConfirm',
                value: function openPromptSaveNewConfirm(resolve, reject) {
                    this.openPrompt(["saveNewConfirm", "createConfirm", "saveConfirm", "writeConfirm"], {
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
                    var _this12 = this;

                    this.openPrompt("closeConfirm", {
                        onYes: function onYes() {
                            resolve();
                            _this12.handleClose();
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
                    var errorOnRead = _props.errorOnRead;
                    var errorOnCreate = _props.errorOnCreate;
                    var errorOnUpdate = _props.errorOnUpdate;
                    var errorOnDelete = _props.errorOnDelete;


                    var isNew = this.isNew();

                    // inferred data transaction states
                    var isSaving = isCreating || isUpdating;
                    var isWriting = isCreating || isUpdating || isDeleting;
                    var isWaiting = isReading || isCreating || isUpdating || isDeleting;

                    // inferred abilities
                    var canDelete = !isWaiting && !isNew && (0, _Utils.returnBoolean)(this.props.allowDelete, id);
                    var canReset = !isNew && this.state.dirty;
                    var canSaveNew = !isWaiting && !isNew && (0, _Utils.returnBoolean)(this.props.allowCreate);
                    var canSave = !isWaiting && (isNew ? (0, _Utils.returnBoolean)(this.props.allowCreate) : (0, _Utils.returnBoolean)(this.props.allowUpdate, id));

                    var propsToRemove = _immutable.List.of('id',
                    // prompts
                    'prompt', 'closePrompt',
                    // data transaction states
                    'isReading', 'isCreating', 'isUpdating', 'isDeleting',
                    // errors - experimental
                    'errorOnRead', 'errorOnCreate', 'errorOnUpdate', 'errorOnDelete',
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
                        isSaving: isSaving,
                        isWriting: isWriting,
                        isWaiting: isWaiting,

                        errorOnRead: !isNew && errorOnRead,
                        errorOnCreate: errorOnCreate,
                        errorOnUpdate: errorOnUpdate,
                        errorOnDelete: errorOnDelete,

                        onSave: this.requestSave.bind(this),
                        onSaveNew: this.requestSaveNew.bind(this),
                        onClose: this.requestClose.bind(this),
                        onDelete: this.requestDelete.bind(this),
                        onResetConfirm: this.requestResetConfirm.bind(this),
                        onDirty: this.setDirty.bind(this),
                        onCustomConfirm: this.requestCustomConfirm.bind(this),

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
            // data transaction states
            isReading: _react.PropTypes.bool,
            isCreating: _react.PropTypes.bool,
            isUpdating: _react.PropTypes.bool,
            isDeleting: _react.PropTypes.bool,
            // errors
            errorOnRead: _react.PropTypes.any,
            errorOnCreate: _react.PropTypes.any,
            errorOnUpdate: _react.PropTypes.any,
            errorOnDelete: _react.PropTypes.any,
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
            onLeaveHook: _react.PropTypes.func,
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