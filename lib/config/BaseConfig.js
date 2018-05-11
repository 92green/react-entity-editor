'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _EntityEditorConfig = require('./EntityEditorConfig');

var _EntityEditorConfig2 = _interopRequireDefault(_EntityEditorConfig);

var _EntityEditorHock = require('../EntityEditorHock');

var _EntityEditorHock2 = _interopRequireDefault(_EntityEditorHock);

var _EntityEditorState = require('../EntityEditorState');

var _EntityEditorState2 = _interopRequireDefault(_EntityEditorState);

var _Modal = require('../modal/Modal');

var _Modal2 = _interopRequireDefault(_Modal);

var _ModalContent = require('../modal/ModalContent');

var _ModalContent2 = _interopRequireDefault(_ModalContent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

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
                        task: "cleanOperate",
                        next: {
                            onSuccess: {
                                task: "goOperate"
                            }
                        }
                    }
                }
            }
        }
    },
    tasks: {
        createOperate: {
            operation: "create",
            status: function status(_ref) {
                var item = _ref.item;
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
            }
        },
        updateOperate: {
            operation: "update",
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
            }
        },
        saveOperate: {
            operation: "save",
            status: function status(_ref3) {
                var item = _ref3.item;
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
            }
        },
        saveSuccess: {
            status: function status(_ref4) {
                var Item = _ref4.Item;
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
            }
        },
        saveError: {
            status: function status(_ref5) {
                var item = _ref5.item;
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
            }
        },
        saveNewConfirm: {
            status: function status(_ref6) {
                var item = _ref6.item;
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
            }
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
            }
        },
        deleteOperate: {
            operation: "delete",
            status: function status(_ref9) {
                var item = _ref9.item;
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
            }
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
            }
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
            }
        },
        goOperate: {
            operation: "go",
            preSuccess: true // progress to next success step just before firing operation
        },
        cleanOperate: {
            operation: "clean"
        }
    },
    operations: {
        create: function create(_ref13) {
            var operations = _ref13.operations,
                props = _ref13.props,
                setEditorState = _ref13.setEditorState;
            return function (actionProps) {
                console.warn('"create" operation not defined, set this in your config');
            };
        },
        update: function update(_ref14) {
            var operations = _ref14.operations,
                props = _ref14.props,
                setEditorState = _ref14.setEditorState;
            return function (actionProps) {
                console.warn('"update" operation not defined, set this in your config');
            };
        },
        delete: function _delete(_ref15) {
            var operations = _ref15.operations,
                props = _ref15.props,
                setEditorState = _ref15.setEditorState;
            return function (actionProps) {
                console.warn('"delete" operation not defined, set this in your config');
            };
        },
        go: function go(_ref16) {
            var operations = _ref16.operations,
                props = _ref16.props,
                setEditorState = _ref16.setEditorState;
            return function (actionProps) {
                console.warn('"go" operation not defined, set this in your config');
            };
        },
        save: function save(_ref17) {
            var operations = _ref17.operations;
            return function (actionProps) {
                if (!actionProps.payload) {
                    return Promise.reject('EntityEditor: config.operations.save: actionProps.payload is not defined');
                }
                if (actionProps.id) {
                    return operations.update(actionProps);
                }
                return operations.create(actionProps);
            };
        },
        dirty: function dirty(_ref18) {
            var setEditorState = _ref18.setEditorState;
            return function () {
                setEditorState({ dirty: true });
            };
        },
        clean: function clean(_ref19) {
            var setEditorState = _ref19.setEditorState;
            return function () {
                setEditorState({ dirty: false });
            };
        }
    },
    initialEditorState: {
        dirty: false
    },
    composeComponents: function composeComponents(config) {
        return [(0, _EntityEditorState2.default)(config), (0, _EntityEditorHock2.default)(config)];
    },
    operationProps: function operationProps(ii) {
        return ii;
    },
    lifecycleMethods: {
        componentWillMount: {},
        componentDidMount: {},
        componentWillReceiveProps: {},
        componentWillUnmount: {}
    }
});

exports.default = BaseConfig;