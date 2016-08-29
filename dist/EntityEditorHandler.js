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

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _PropChangeListener = require('./PropChangeListener');

var _PropChangeListener2 = _interopRequireDefault(_PropChangeListener);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
// EntityEditorHandler higher order component
// Base entity editor functionality and UI flow without UI elements
//

// define 'then' which will use a Promise .then() if it exists,
// or otherwise calls the callback synchronously

function then(item, callback) {
    if ((typeof item === 'undefined' ? 'undefined' : (0, _typeof3.default)(item)) == "object" && typeof item.then != "undefined") {
        item.then(callback);
    } else {
        callback(item);
    }
}

exports.default = function (config) {
    return function (ComposedComponent) {
        var EntityEditorHandler = function (_Component) {
            (0, _inherits3.default)(EntityEditorHandler, _Component);

            function EntityEditorHandler(props) {
                (0, _classCallCheck3.default)(this, EntityEditorHandler);

                var _this = (0, _possibleConstructorReturn3.default)(this, (EntityEditorHandler.__proto__ || (0, _getPrototypeOf2.default)(EntityEditorHandler)).call(this, props));

                _this.state = {
                    prompt: null
                };
                return _this;
            }

            //
            // helpers - these are inferred from this.props, and passed down as props to child elements
            //

            (0, _createClass3.default)(EntityEditorHandler, [{
                key: 'isNew',
                value: function isNew() {
                    var props = arguments.length <= 0 || arguments[0] === undefined ? this.props : arguments[0];

                    return !props.id;
                }
            }, {
                key: 'createsOnSave',
                value: function createsOnSave() {
                    var props = arguments.length <= 0 || arguments[0] === undefined ? this.props : arguments[0];

                    return this.isNew(props) || props.willCopy;
                }

                //
                // permissions
                //

            }, {
                key: 'permitCreate',
                value: function permitCreate() {
                    return this.props.permitCreate && typeof this.props.onCreate == "function";
                }
            }, {
                key: 'permitUpdate',
                value: function permitUpdate() {
                    return this.props.permitUpdate && typeof this.props.onUpdate == "function";
                }
            }, {
                key: 'permitDelete',
                value: function permitDelete() {
                    return this.props.permitDelete && typeof this.props.onDelete == "function";
                }

                //
                // naming / text labels
                //
                // child elements will receive a entityName and actionName prop
                // both are functions that can optionally accept an array of strings to set which text trransforms to perform
                // so if the current entityName="dog" and child.props.entityName(['first','plural']), then the string "Dogs" will be returned
                // 

            }, {
                key: 'entityName',
                value: function entityName(modifications) {
                    var name = this.props.entityName;
                    if (!modifications) {
                        return name;
                    }
                    if (modifications.includes('plural')) {
                        name = this.props.entityNamePlural || name + "s";
                    }
                    return this.genericNameTransform(name, modifications);
                }
            }, {
                key: 'actionName',
                value: function actionName(modifications) {
                    var name = "edit";
                    if (this.isNew()) {
                        name = "add new";
                    } else if (this.props.willCopy) {
                        name = "copy";
                    }
                    return this.genericNameTransform(name, modifications);
                }
            }, {
                key: 'genericNameTransform',
                value: function genericNameTransform(name, modifications) {
                    if (modifications.includes('first')) {
                        name = name.charAt(0).toUpperCase() + name.slice(1);
                    }
                    if (modifications.includes('titleCase')) {
                        name = name.split(" ").map(function (word) {
                            return word.charAt(0).toUpperCase() + word.slice(1);
                        }).join(" ");
                    }
                    return name;
                }

                //
                // handlers
                //

            }, {
                key: 'requestSave',
                value: function requestSave(values) {
                    var _this2 = this;

                    if (this.createsOnSave()) {
                        // if we need to create but can't do it, reject
                        if (!this.permitCreate()) {
                            return _promise2.default.reject();
                        }

                        // create, then show prompts on success
                        return this.props.onCreate(values).then(function (data) {
                            return new _promise2.default(function (resolve, reject) {
                                if (_this2.props.willCopy) {
                                    _this2.openPromptCreateSuccess(function () {
                                        return resolve(data);
                                    }, reject, data.newId, "copied");
                                } else {
                                    _this2.openPromptCreateSuccess(function () {
                                        return resolve(data);
                                    }, reject, data.newId, "created");
                                }
                            });
                        }, function (error) {
                            return new _promise2.default(function (resolve, reject) {
                                _this2.openPromptWriteError(resolve, reject, _this2.props.writeError);
                            });
                        }).then(this.props.afterCreate);
                    }

                    // if we need to update but can't do it, reject
                    if (!this.permitUpdate()) {
                        return _promise2.default.reject();
                    }

                    // update, then show prompts on success
                    return this.props.onUpdate(this.props.id, values).then(function (data) {
                        return new _promise2.default(function (resolve, reject) {
                            _this2.openPromptUpdateSuccess(function () {
                                return resolve(data);
                            }, reject);
                        });
                    }, function (error) {
                        return new _promise2.default(function (resolve, reject) {
                            _this2.openPromptWriteError(resolve, reject, _this2.props.writeError);
                        });
                    }).then(this.props.afterUpdate);
                }
            }, {
                key: 'requestDelete',
                value: function requestDelete() {
                    var _this3 = this;

                    // if we need to delete but can't do it, reject
                    if (!this.permitDelete()) {
                        return _promise2.default.reject();
                    }

                    return new _promise2.default(function (resolve, reject) {
                        _this3.openPromptDeleteConfirm(resolve, reject);
                    }).then(function () {
                        return _this3.props.onDelete(_this3.props.id).then(function (data) {
                            return new _promise2.default(function (resolve, reject) {
                                _this3.openPromptDeleteSuccess(function () {
                                    return resolve(data);
                                }, reject);
                            });
                        }).then(_this3.props.afterDelete);
                    });
                }
            }, {
                key: 'requestClose',
                value: function requestClose(dirty) {
                    var _this4 = this;

                    return new _promise2.default(function (resolve, reject) {
                        if (dirty) {
                            _this4.openPromptCloseConfirm(resolve, reject);
                        } else {
                            _this4.props.onClose();
                            resolve();
                        }
                    });
                }
            }, {
                key: 'requestReset',
                value: function requestReset() {
                    var _this5 = this;

                    return new _promise2.default(function (resolve, reject) {
                        _this5.openPromptResetConfirm(resolve, reject);
                    });
                }

                //
                // prompts
                //

            }, {
                key: 'openPrompt',
                value: function openPrompt(prompt) {
                    this.setState({
                        prompt: prompt
                    });
                }
            }, {
                key: 'closePrompt',
                value: function closePrompt() {
                    this.setState({
                        prompt: null
                    });
                }
            }, {
                key: 'openPromptCreateSuccess',
                value: function openPromptCreateSuccess(resolve, reject, newId, action) {
                    var _this6 = this;

                    var close = function close() {
                        if (_this6.props.onGotoEdit && _this6.props.permitUpdate) {
                            _this6.props.onGotoEdit(newId);
                        } else {
                            _this6.props.onClose();
                        }
                        resolve();
                    };

                    this.openPrompt({
                        title: "Success",
                        message: this.entityName(['first']) + ' ' + action + '.',
                        type: "success",
                        yes: "Okay",
                        onYes: close,
                        onNo: close
                    });
                }
            }, {
                key: 'openPromptUpdateSuccess',
                value: function openPromptUpdateSuccess(resolve, reject) {
                    this.openPrompt({
                        title: "Success",
                        message: this.entityName(['first']) + ' saved.',
                        type: "success",
                        yes: "Okay",
                        onYes: resolve
                    });
                }
            }, {
                key: 'openPromptDeleteConfirm',
                value: function openPromptDeleteConfirm(resolve, reject) {
                    this.openPrompt({
                        title: "Warning",
                        message: 'Are you sure you want to delete this ' + this.entityName() + '? This action cannot be undone.',
                        type: "confirm",
                        yes: "Delete",
                        no: "Cancel",
                        onYes: resolve,
                        onNo: reject
                    });
                }
            }, {
                key: 'openPromptDeleteSuccess',
                value: function openPromptDeleteSuccess(resolve, reject) {
                    var _this7 = this;

                    var close = function close() {
                        _this7.props.onClose();
                        resolve();
                    };

                    this.openPrompt({
                        title: "Success",
                        message: this.entityName(['first']) + ' deleted.',
                        type: "success",
                        yes: "Okay",
                        onYes: close,
                        onNo: close
                    });
                }
            }, {
                key: 'openPromptCloseConfirm',
                value: function openPromptCloseConfirm(resolve, reject) {
                    var _this8 = this;

                    this.openPrompt({
                        title: "Unsaved changes",
                        message: 'You have unsaved changes on this ' + this.entityName() + '. What would you like to do?',
                        type: "confirm",
                        yes: "Discard changes",
                        no: "Keep editing",
                        onYes: function onYes() {
                            _this8.props.onClose();
                            resolve();
                        },
                        onNo: reject
                    });
                }
            }, {
                key: 'openPromptResetConfirm',
                value: function openPromptResetConfirm(resolve, reject) {
                    this.openPrompt({
                        title: "Warning",
                        message: 'Are you sure you want to revert this ' + this.entityName() + '? You will lose any changes since your last save.',
                        type: "confirm",
                        yes: "Revert",
                        no: "Cancel",
                        onYes: resolve,
                        onNo: reject
                    });
                }
            }, {
                key: 'openPromptWriteError',
                value: function openPromptWriteError(resolve, reject, error) {
                    var _error$toJS = error.toJS();

                    var status = _error$toJS.status;
                    var message = _error$toJS.message;


                    this.openPrompt({
                        title: "Error",
                        status: status,
                        message: message,
                        type: "error",
                        yes: "Okay",
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
                    var willCopy = _props.willCopy;
                    var reading = _props.reading;
                    var creating = _props.creating;
                    var updating = _props.updating;
                    var deleting = _props.deleting;
                    var readError = _props.readError;
                    var writeError = _props.writeError;


                    var isNew = this.isNew();

                    // inferred data transaction states
                    var saving = creating || updating;
                    var fetching = reading || creating || updating || deleting;

                    // inferred abilities
                    var canSave = !fetching;

                    var canDelete = this.permitDelete() && !fetching && !isNew;

                    if (isNew && !this.permitCreate()) {
                        // prohibit creating if onCreate is undefined
                        console.log("EntityEditorHandler: Can't save form; permitCreate is false, you don't have permission to create, or an onCreate function is not defined.");
                        canSave = false;
                    }

                    if (!isNew && !this.permitUpdate()) {
                        // prohibit updating if onUpdate is undefined
                        console.log("EntityEditorHandler: Can't save form; permitUpdate is false, you don't have permission to update, or an onUpdate function is not defined.");
                        canSave = false;
                    }

                    var propsToRemove = _immutable.List.of(
                    // prompts
                    'prompt', 'closePrompt',
                    // data transaction states
                    'reading', 'creating', 'updating', 'deleting',
                    // errors
                    'readError', 'writeError',
                    // permissions
                    'permitCreate', 'permitUpdate', 'permitDelete',
                    // callbacks
                    'onRead', 'onCreate', 'onUpdate', 'onDelete', 'onClose', 'onGotoEdit',
                    // after callbacks fired on success
                    'afterRead', 'afterCreate', 'afterUpdate', 'afterDelete', 'afterClose',
                    // naming
                    'entityName', 'entityNamePlural');

                    var filteredProps = propsToRemove.reduce(function (filteredProps, propToRemove) {
                        return filteredProps.delete(propToRemove);
                    }, (0, _immutable.fromJS)(this.props)).toJS();

                    console.log("f", filteredProps);

                    return _react2.default.createElement(ComposedComponent, (0, _extends3.default)({}, filteredProps, {

                        id: id,
                        willCopy: willCopy,
                        isNew: isNew,
                        canSave: canSave,
                        canDelete: canDelete,

                        prompt: this.state.prompt,
                        closePrompt: this.closePrompt.bind(this),

                        reading: reading,
                        creating: creating,
                        updating: updating,
                        deleting: deleting,
                        saving: saving,
                        fetching: fetching,

                        readError: !isNew && readError,
                        writeError: writeError,

                        onSave: this.requestSave.bind(this),
                        onClose: this.requestClose.bind(this),
                        onDelete: this.requestDelete.bind(this),
                        onReset: this.requestReset.bind(this),

                        entityName: this.entityName.bind(this),
                        actionName: this.actionName.bind(this)
                    }));
                }
            }]);
            return EntityEditorHandler;
        }(_react.Component);

        EntityEditorHandler.propTypes = {
            // id and abilites
            id: _react.PropTypes.any, // (editor will edit item if this is set, or create new if this is not set)
            willCopy: _react.PropTypes.bool,
            // prompts
            prompt: _react.PropTypes.string,
            closePrompt: _react.PropTypes.func,
            // data transaction states
            reading: _react.PropTypes.bool,
            creating: _react.PropTypes.bool,
            updating: _react.PropTypes.bool,
            deleting: _react.PropTypes.bool,
            // errors
            readError: _react.PropTypes.any,
            writeError: _react.PropTypes.any,
            // permissions
            permitCreate: _react.PropTypes.bool,
            permitUpdate: _react.PropTypes.bool,
            permitDelete: _react.PropTypes.bool,
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

        EntityEditorHandler.defaultProps = {
            willCopy: false,
            entityName: "item",
            entityNamePlural: "items",
            // permissions
            permitCreate: true,
            permitUpdate: true,
            permitDelete: true,
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
            }
        };

        var propChangeListener = (0, _PropChangeListener2.default)(['id'], function (props) {
            if (props.id && props.onRead) {
                var readResults = props.onRead(props.id);
                if (props.afterRead) {
                    then(readResults, props.afterRead);
                }
            }
        });

        return propChangeListener(EntityEditorHandler);
    };
};