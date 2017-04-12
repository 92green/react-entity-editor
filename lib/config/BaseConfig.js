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
        get: {
            description: "Gets a single item based on an id. Data about items is received via props, so this object exists just so we can provide an error message.",
            workflow: {
                task: "getOperate",
                next: {
                    onError: {
                        task: "getError"
                    }
                }
            }
        },
        list: {
            description: "Lists all items. Data about lists of items is received via props, so this object exists just so we can provide an error message.",
            workflow: {
                task: "listOperate",
                next: {
                    onError: {
                        task: "listError"
                    }
                }
            }
        },
        save: {
            description: "If the item already exists this calls the onUpdate operation, or calls onCreate for new items.",
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
            description: "Always calls onCreate to make a new item, regardless of whether the data was loaded from an existing item.",
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
            description: "Confirms if the user wants to delete, and calls the onDelete operation for an item.",
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
        },
        dirty: {
            description: "Sets the 'dirty' state of the editor. The editor is dirty when there are unsaved changes.",
            workflow: {
                task: "dirtyOperate"
            }
        }
    },
    tasks: {
        getOperate: {
            operate: function operate(_ref) {
                var operations = _ref.operations;
                return function (actionProps) {
                    if (!actionProps.id) {
                        throw 'EntityEditor: config.actions.get: actionProps.id is not defined';
                    }
                    return operations.onGet(actionProps);
                };
            },
            status: function status(_ref2) {
                var item = _ref2.item;
                return {
                    title: "Loading",
                    message: _react2.default.createElement(
                        'span',
                        null,
                        'Loading ',
                        item,
                        '...'
                    )
                };
            },
            statusOutput: "prompt"
        },
        getError: {
            status: function status(_ref3) {
                var item = _ref3.item;
                return {
                    title: "Error",
                    message: _react2.default.createElement(
                        'span',
                        null,
                        'An error has occurred, this ',
                        item,
                        ' could not be loaded right now.'
                    ),
                    yes: "Okay"
                };
            },
            statusOutput: "prompt"
        },
        listOperate: {
            operate: function operate(_ref4) {
                var operations = _ref4.operations;
                return function (actionProps) {
                    return operations.onList(actionProps);
                };
            },
            status: function status(_ref5) {
                var items = _ref5.items;
                return {
                    title: "Loading",
                    message: _react2.default.createElement(
                        'span',
                        null,
                        'Loading ',
                        items,
                        '...'
                    )
                };
            },
            statusOutput: "prompt"
        },
        listError: {
            status: function status(_ref6) {
                var items = _ref6.items;
                return {
                    title: "Error",
                    message: _react2.default.createElement(
                        'span',
                        null,
                        'An error has occurred, these ',
                        items,
                        ' could not be loaded right now.'
                    ),
                    yes: "Okay"
                };
            },
            statusOutput: "prompt"
        },
        saveOperate: {
            operate: function operate(_ref7) {
                var operations = _ref7.operations;
                return function (actionProps) {
                    if (!actionProps.payload) {
                        throw 'EntityEditor: config.actions.save: actionProps.payload is not defined';
                    }
                    if (actionProps.id) {
                        return operations.onUpdate(actionProps).then(function () {
                            return operations.onDirty({ dirty: false });
                        });
                    }
                    return operations.onCreate(actionProps).then(function () {
                        return operations.onDirty({ dirty: false });
                    });
                };
            },
            status: function status(_ref8) {
                var item = _ref8.item;
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
            status: function status(_ref9) {
                var Item = _ref9.Item;
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
            status: function status(_ref10) {
                var item = _ref10.item;
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
            status: function status(_ref11) {
                var item = _ref11.item;
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
            operate: function operate(_ref12) {
                var operations = _ref12.operations;
                return function (actionProps) {
                    if (!actionProps.payload) {
                        throw 'EntityEditor: config.actions.saveNew: actionProps.payload is not defined';
                    }
                    return operations.onCreate(actionProps).then(function () {
                        return operations.onDirty({ dirty: false });
                    });
                };
            },
            status: function status(_ref13) {
                var item = _ref13.item;
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
            status: function status(_ref14) {
                var item = _ref14.item;
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
            status: function status(_ref15) {
                var item = _ref15.item;
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
            operate: function operate(_ref16) {
                var operations = _ref16.operations;
                return function (actionProps) {
                    if (!actionProps.id) {
                        throw 'EntityEditor: config.actions.delete: actionProps.id is not defined';
                    }
                    return operations.onDelete(actionProps).then(function () {
                        return operations.onDirty({ dirty: false });
                    });
                };
            },
            status: function status(_ref17) {
                var item = _ref17.item;
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
            status: function status(_ref18) {
                var Item = _ref18.Item;
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
            status: function status(_ref19) {
                var item = _ref19.item;
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
            skip: function skip(_ref20) {
                var editorState = _ref20.editorState;
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
            operate: function operate(_ref21) {
                var operations = _ref21.operations;
                return function (actionProps) {
                    return operations.onGo(actionProps).then(function () {
                        return operations.onDirty({ dirty: false });
                    });
                };
            },
            blocking: false
        },
        dirtyOperate: {
            operate: function operate(_ref22) {
                var operations = _ref22.operations;
                return function (actionProps) {
                    return operations.onDirty({ dirty: actionProps.dirty });
                };
            }
        }
    },
    operations: {
        onDirty: function onDirty(_ref23) {
            var setEditorState = _ref23.setEditorState;
            return function (actionProps) {
                setEditorState.dirty(actionProps.dirty);
            };
        }
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