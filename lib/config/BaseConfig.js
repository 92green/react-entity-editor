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
        create: {
            description: "Calls the create operation.",
            workflow: {
                task: "createOperate",
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
        update: {
            description: "Calls the update operation.",
            workflow: {
                task: "updateOperate",
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
                    task: "createOperate",
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
        createOperate: {
            operate: function operate(_ref) {
                var operations = _ref.operations;
                return function (actionProps) {
                    if (!actionProps.payload) {
                        throw 'EntityEditor: config.actions.create: actionProps.payload is not defined';
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
        updateOperate: {
            operate: function operate(_ref3) {
                var operations = _ref3.operations;
                return function (actionProps) {
                    if (!actionProps.payload) {
                        throw 'EntityEditor: config.actions.update: actionProps.payload is not defined';
                    }
                    return operations.update(actionProps).then(function () {
                        return operations.dirty({ dirty: false });
                    });
                };
            },
            status: function status(_ref4) {
                var item = _ref4.item;
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
        saveOperate: {
            operate: function operate(_ref5) {
                var operations = _ref5.operations;
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
            status: function status(_ref6) {
                var item = _ref6.item;
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
            status: function status(_ref7) {
                var Item = _ref7.Item;
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
            status: function status(_ref8) {
                var item = _ref8.item;
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
            status: function status(_ref9) {
                var item = _ref9.item;
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
        saveNewSuccess: {
            status: function status(_ref10) {
                var item = _ref10.item;
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
            status: function status(_ref11) {
                var item = _ref11.item;
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
            operate: function operate(_ref12) {
                var operations = _ref12.operations;
                return function (actionProps) {
                    if (!actionProps.id) {
                        throw 'EntityEditor: config.actions.delete: actionProps.id is not defined';
                    }
                    return operations.delete(actionProps).then(function () {
                        return operations.dirty({ dirty: false });
                    });
                };
            },
            status: function status(_ref13) {
                var item = _ref13.item;
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
            status: function status(_ref14) {
                var Item = _ref14.Item;
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
            status: function status(_ref15) {
                var item = _ref15.item;
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
            skip: function skip(_ref16) {
                var editorState = _ref16.editorState;
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
            operate: function operate(_ref17) {
                var operations = _ref17.operations;
                return function (actionProps) {
                    return operations.go(actionProps);
                };
            }
        }
    },
    operations: {
        create: function create() {
            return function () {
                console.warn('"create" operation not defined');
            };
        },
        update: function update() {
            return function () {
                console.warn('"update" operation not defined');
            };
        },
        delete: function _delete() {
            return function () {
                console.warn('"delete" operation not defined');
            };
        },
        go: function go() {
            return function () {
                console.warn('"go" operation not defined');
            };
        },
        dirty: function dirty(_ref18) {
            var setEditorState = _ref18.setEditorState;
            return function (_ref19) {
                var dirty = _ref19.dirty;

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