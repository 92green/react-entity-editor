'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _EntityEditorConfig = require('./EntityEditorConfig');

var _EntityEditorConfig2 = _interopRequireDefault(_EntityEditorConfig);

var _Modal = require('../modal/Modal');

var _Modal2 = _interopRequireDefault(_Modal);

var _ModalContent = require('../modal/ModalContent');

var _ModalContent2 = _interopRequireDefault(_ModalContent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BaseConfig = (0, _EntityEditorConfig2.default)({
    item: {
        single: "item"
    },
    actions: {
        save: {
            description: "If the item already exists this calls the update operation, or calls create for new items.",
            workflow: {
                task: "saveOperate",
                next: {
                    onSuccess: {
                        task: "saveSuccess"
                    },
                    onError: {
                        task: "saveError"
                    }
                }
            }
        },
        saveNew: {
            description: "Always calls create to make a new item, regardless of whether the data was loaded from an existing item.",
            workflow: {
                task: "saveNewConfirm",
                onYes: {
                    task: "saveNewOperate",
                    next: {
                        onSuccess: {
                            task: "saveNewSuccess"
                        },
                        onError: {
                            task: "saveError"
                        }
                    }
                }
            }
        },
        delete: {
            description: "Confirms if the user wants to delete, and calls the delete operation for an item.",
            workflow: {
                task: "deleteConfirm",
                next: {
                    onYes: {
                        task: "deleteOperate",
                        next: {
                            onSuccess: {
                                task: "deleteSuccess"
                            },
                            onError: {
                                task: "deleteError"
                            }
                        }
                    }
                }
            }
        },
        go: {
            description: "Navigates to another route or view",
            workflow: {
                task: "goConfirm",
                next: {
                    onYes: {
                        task: "goOperate"
                    }
                }
            }
        }
    },
    tasks: {
        saveOperate: {
            operate: function operate(_ref) {
                var operations = _ref.operations;
                return function (actionProps) {
                    if (!actionProps.payload) {
                        throw 'EntityEditor: config.actions.save: actionProps.payload is not defined';
                    }
                    if (actionProps.id) {
                        return operations.update(actionProps).then(function () {
                            return operations.dirty({ dirty: false });
                        });
                    }
                    return operations.create(actionProps).then(function () {
                        return operations.dirty({ dirty: false });
                    });
                };
            },
            status: function status(_ref2) {
                var item = _ref2.item;
                return {
                    title: "Saving",
                    message: _react2.default.createElement(
                        'span',
                        null,
                        'Saving ',
                        item,
                        '...'
                    )
                };
            },
            statusOutput: "prompt"
        },
        saveSuccess: {
            status: function status(_ref3) {
                var Item = _ref3.Item;
                return {
                    title: "Saved",
                    message: _react2.default.createElement(
                        'span',
                        null,
                        Item,
                        ' saved.'
                    ),
                    yes: "Okay"
                };
            },
            statusOutput: "prompt"
        },
        saveError: {
            status: function status(_ref4) {
                var item = _ref4.item;
                return {
                    title: "Error",
                    message: _react2.default.createElement(
                        'span',
                        null,
                        'An error has occurred, this ',
                        item,
                        ' could not be saved right now.'
                    ),
                    yes: "Okay"
                };
            },
            statusOutput: "prompt"
        },
        saveNewConfirm: {
            status: function status(_ref5) {
                var item = _ref5.item;
                return {
                    title: "Confirm",
                    message: _react2.default.createElement(
                        'span',
                        null,
                        'Are you sure you want to save this as a new ',
                        item,
                        '?'
                    ),
                    yes: 'Save as new',
                    no: 'Cancel'
                };
            },
            statusOutput: "prompt"
        },
        saveNewOperate: {
            operate: function operate(_ref6) {
                var operations = _ref6.operations;
                return function (actionProps) {
                    if (!actionProps.payload) {
                        throw 'EntityEditor: config.actions.saveNew: actionProps.payload is not defined';
                    }
                    return operations.create(actionProps).then(function () {
                        return operations.dirty({ dirty: false });
                    });
                };
            },
            status: function status(_ref7) {
                var item = _ref7.item;
                return {
                    title: "Saving",
                    message: _react2.default.createElement(
                        'span',
                        null,
                        'Saving ',
                        item,
                        '...'
                    )
                };
            },
            statusOutput: "prompt"
        },
        saveNewSuccess: {
            status: function status(_ref8) {
                var item = _ref8.item;
                return {
                    title: "Saved",
                    message: _react2.default.createElement(
                        'span',
                        null,
                        'New ',
                        item,
                        ' saved.'
                    ),
                    yes: "Okay"
                };
            },
            statusOutput: "prompt"
        },
        deleteConfirm: {
            status: function status(_ref9) {
                var item = _ref9.item;
                return {
                    title: "Confirm",
                    message: _react2.default.createElement(
                        'span',
                        null,
                        'Are you sure you want to delete this ',
                        item,
                        '?'
                    ),
                    yes: 'Delete',
                    no: 'Cancel'
                };
            },
            statusOutput: "prompt"
        },
        deleteOperate: {
            operate: function operate(_ref10) {
                var operations = _ref10.operations;
                return function (actionProps) {
                    if (!actionProps.id) {
                        throw 'EntityEditor: config.actions.delete: actionProps.id is not defined';
                    }
                    return operations.delete(actionProps).then(function () {
                        return operations.dirty({ dirty: false });
                    });
                };
            },
            status: function status(_ref11) {
                var item = _ref11.item;
                return {
                    title: "Deleting",
                    message: _react2.default.createElement(
                        'span',
                        null,
                        'Deleting ',
                        item,
                        '...'
                    )
                };
            },
            statusOutput: "prompt"
        },
        deleteSuccess: {
            status: function status(_ref12) {
                var Item = _ref12.Item;
                return {
                    title: "Deleted",
                    message: _react2.default.createElement(
                        'span',
                        null,
                        Item,
                        ' deleted.'
                    ),
                    yes: "Okay"
                };
            },
            statusOutput: "prompt"
        },
        deleteError: {
            status: function status(_ref13) {
                var item = _ref13.item;
                return {
                    title: "Error",
                    message: _react2.default.createElement(
                        'span',
                        null,
                        'An error has occurred, this ',
                        item,
                        ' could not be deleted right now.'
                    ),
                    yes: "Okay"
                };
            },
            statusOutput: "prompt"
        },
        goConfirm: {
            skip: function skip(_ref14) {
                var editorState = _ref14.editorState;
                return editorState.dirty ? null : "onYes";
            },
            status: function status() {
                return {
                    title: "Unsaved changes",
                    message: _react2.default.createElement(
                        'span',
                        null,
                        'You have unsaved changes. What would you like to do?'
                    ),
                    yes: "Discard changes",
                    no: "Keep editing"
                };
            },
            statusOutput: "prompt"
        },
        goOperate: {
            operate: function operate(_ref15) {
                var operations = _ref15.operations;
                return function (actionProps) {
                    return operations.go(actionProps);
                };
            }
        }
    },
    operations: {
        dirty: function dirty(_ref16) {
            var setEditorState = _ref16.setEditorState;
            return function (_ref17) {
                var dirty = _ref17.dirty;

                setEditorState({ dirty: dirty });
            };
        }
    },
    initialEditorState: {
        dirty: false
    },
    // add different statuses in here with components inside
    components: {
        prompt: function prompt(props) {
            return _react2.default.createElement(_Modal2.default, props);
        },
        promptContent: function promptContent(props) {
            return _react2.default.createElement(_ModalContent2.default, props);
        }
    }
});
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

exports.default = BaseConfig;