'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _EntityEditorConfig = require('../config/EntityEditorConfig');

var _EntityEditorConfig2 = _interopRequireDefault(_EntityEditorConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var unsavedChanges = function unsavedChanges(_ref) {
    var editorState = _ref.editorState,
        onYes = _ref.onYes;

    if (!editorState.dirty) {
        return onYes();
    }
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
};
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

function RouterConfigCreator(_ref2) {
    var router = _ref2.router,
        paths = _ref2.paths;

    return (0, _EntityEditorConfig2.default)({
        actions: {
            goList: {
                description: "Navigates to the list page.",
                workflow: {
                    task: "confirm",
                    next: {
                        onYes: {
                            task: "operate"
                        }
                    }
                },
                tasks: {
                    operate: {
                        type: "operate",
                        operate: function operate(_ref3) {
                            var operations = _ref3.operations;
                            return function (actionProps) {
                                return operations.onGoList();
                            };
                        }
                    },
                    confirm: {
                        type: "prompt",
                        prompt: unsavedChanges
                    }
                }
            },
            goItem: {
                description: "Navigates to the item page.",
                workflow: {
                    task: "confirm",
                    next: {
                        onYes: {
                            task: "operate"
                        }
                    }
                },
                tasks: {
                    operate: {
                        type: "operate",
                        operate: function operate(_ref4) {
                            var operations = _ref4.operations;
                            return function (actionProps) {
                                if (!actionProps.id) {
                                    throw 'EntityEditorRouter: goItem actionProps.id is not defined';
                                }
                                return operations.onGoItem({ id: actionProps.id });
                            };
                        }
                    },
                    confirm: {
                        type: "prompt",
                        prompt: unsavedChanges
                    }
                }
            },
            goNew: {
                description: "Navigates to the new item page.",
                workflow: {
                    task: "confirm",
                    next: {
                        onYes: {
                            task: "operate"
                        }
                    }
                },
                tasks: {
                    operate: {
                        type: "operate",
                        operate: function operate(_ref5) {
                            var operations = _ref5.operations;
                            return function (actionProps) {
                                return operations.onGoNew();
                            };
                        }
                    },
                    confirm: {
                        type: "prompt",
                        prompt: unsavedChanges
                    }
                }
            }
        },
        operations: {
            onGoList: function onGoList() {
                return function () {
                    console.log("on go list");
                    router.push(paths().list);
                };
            },
            onGoNew: function onGoNew() {
                return function () {
                    console.log("on go new");
                    router.push(paths().new);
                };
            },
            onGoItem: function onGoItem() {
                return function (props) {
                    console.log("on go edit");
                    router.push(paths(props.id).edit);
                };
            }
        }
    });
}

exports.default = RouterConfigCreator;