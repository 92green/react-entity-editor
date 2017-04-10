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
        /*get: {
            description: "Gets a single item based on an id. Data about items is received via props, so this object exists just so we can provide an error message.",
            tasks: {
                error: {
                    type: "prompt",
                    style: "modal",
                    status: ({item}) => ({
                        title: "Error",
                        message: <span>An error has occurred, this {item} could not be loaded right now.</span>
                    })
                }
            }
        },
        list: {
            description: "Lists all items. Data about lists of items is received via props, so this object exists just so we can provide an error message.",
            tasks: {
                error: {
                    type: "prompt",
                    style: "modal",
                    status: ({item}) => ({
                        title: "Error",
                        message: ({items}) => <span>An error has occurred, these {items} could not be loaded right now.</span>
                    })
                }
            }
        },*/
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
        saveOperate: {
            onEnter: function onEnter(_ref) {
                var operations = _ref.operations;
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
            status: function status(_ref2) {
                var Item = _ref2.Item;
                return {
                    title: "Saving",
                    message: _react2.default.createElement(
                        'span',
                        null,
                        'Saving ',
                        item,
                        '...'
                    ),
                    yes: "Remove this button"
                };
            },
            statusStyle: "modal"
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
            statusStyle: "modal"
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
            statusStyle: "modal"
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
            statusStyle: "modal"
        },
        saveNewOperate: {
            onEnter: function onEnter(_ref6) {
                var operations = _ref6.operations;
                return function (actionProps) {
                    if (!actionProps.payload) {
                        throw 'EntityEditor: config.actions.saveNew: actionProps.payload is not defined';
                    }
                    return operations.onCreate(actionProps).then(function () {
                        return operations.onDirty({ dirty: false });
                    });
                };
            }
        },
        saveNewSuccess: {
            status: function status(_ref7) {
                var item = _ref7.item;
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
            statusStyle: "modal"
        },
        deleteConfirm: {
            status: function status(_ref8) {
                var item = _ref8.item;
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
            statusStyle: "modal"
        },
        deleteOperate: {
            onEnter: function onEnter(_ref9) {
                var operations = _ref9.operations;
                return function (actionProps) {
                    if (!actionProps.id) {
                        throw 'EntityEditor: config.actions.delete: actionProps.id is not defined';
                    }
                    return operations.onDelete(actionProps).then(function () {
                        return operations.onDirty({ dirty: false });
                    });
                };
            }
        },
        deleteSuccess: {
            status: function status(_ref10) {
                var Item = _ref10.Item;
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
            statusStyle: "modal"
        },
        deleteError: {
            status: function status(_ref11) {
                var item = _ref11.item;
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
            statusStyle: "modal"
        },
        goConfirm: {
            skip: function skip(_ref12) {
                var editorState = _ref12.editorState;
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
            statusStyle: "modal"
        },
        goOperate: {
            onEnter: function onEnter(_ref13) {
                var operations = _ref13.operations;
                return function (actionProps) {
                    return operations.onGo(actionProps).then(function () {
                        return operations.onDirty({ dirty: false });
                    });
                };
            }
        },
        dirtyOperate: {
            onEnter: function onEnter(_ref14) {
                var operations = _ref14.operations;
                return function (actionProps) {
                    return operations.onDirty({ dirty: actionProps.dirty });
                };
            }
        }
    },
    operations: {
        onDirty: function onDirty(_ref15) {
            var setEditorState = _ref15.setEditorState;
            return function (actionProps) {
                setEditorState.dirty(actionProps.dirty);
            };
        }
    },
    // add different statuses in here with components inside
    components: {
        loader: function loader(props) {
            return _react2.default.createElement(
                'p',
                null,
                'Loading...'
            );
        },
        /*error: ({title, Message, item}) => {
            return <div>
                <p><strong>{title}</strong></p>
                <Message {...item} />
            </div>;
        },*/
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