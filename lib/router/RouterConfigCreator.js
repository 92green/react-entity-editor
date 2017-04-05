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

// title: `Unsaved changes`,
//                 message: () => <span>You have unsaved changes. What would you like to do?</span>,
//                 yes: `Discard changes`,
//                 no: `Keep editing`

function RouterConfigCreator() {
    return (0, _EntityEditorConfig2.default)({
        item: {
            single: "item"
        },
        actions: {
            goList: {
                description: "Navigates to the list page.",
                workflow: {
                    task: "confirm",
                    onYes: {
                        task: "operation"
                    }
                },
                tasks: {
                    operation: function operation(_ref) {
                        var operations = _ref.operations;
                        return function (actionProps) {
                            return operations.onGoList();
                        };
                    },
                    confirm: {
                        type: "prompt",
                        prompt: function prompt(_ref2) {
                            var item = _ref2.item;
                            return {
                                title: "Confirm",
                                message: _react2.default.createElement(
                                    'span',
                                    null,
                                    'Ready set go.'
                                ),
                                yes: "Yes",
                                no: "Cancel"
                            };
                        }
                    }
                }
            },
            goItem: {
                description: "Navigates to the item page.",
                workflow: {
                    task: "confirm",
                    onYes: {
                        task: "operation"
                    }
                },
                tasks: {
                    operation: function operation(_ref3) {
                        var operations = _ref3.operations;
                        return function (actionProps) {
                            if (!actionProps.id) {
                                throw 'EntityEditorRouter: goItem actionProps.id is not defined';
                            }
                            return operations.onGoItem({ id: actionProps.id });
                        };
                    },
                    confirm: {
                        type: "prompt",
                        prompt: function prompt(_ref4) {
                            var item = _ref4.item;
                            return {
                                title: "Confirm",
                                message: _react2.default.createElement(
                                    'span',
                                    null,
                                    'Ready set go.'
                                ),
                                yes: "Yes",
                                no: "Cancel"
                            };
                        }
                    }
                }
            },
            goNew: {
                description: "Navigates to the new item page.",
                workflow: {
                    task: "confirm",
                    onYes: {
                        task: "operation"
                    }
                },
                tasks: {
                    operation: function operation(_ref5) {
                        var operations = _ref5.operations;
                        return function (actionProps) {
                            return operations.onGoNew();
                        };
                    },
                    confirm: {
                        type: "prompt",
                        prompt: function prompt(_ref6) {
                            var item = _ref6.item;
                            return {
                                title: "Confirm",
                                message: _react2.default.createElement(
                                    'span',
                                    null,
                                    'Ready set go.'
                                ),
                                yes: "Yes",
                                no: "Cancel"
                            };
                        }
                    }
                }
            }
        },
        operations: {
            onGoList: function onGoList() {
                return function () {
                    console.log("on go list");
                    //router.push(paths().list);
                };
            },
            onGoNew: function onGoNew() {
                return function () {
                    console.log("on go new");
                    //router.push(paths().new);
                };
            },
            onGoItem: function onGoItem() {
                return function (props) {
                    console.log("on go edit");
                    //router.push(paths(props.id).edit);
                };
            }
        }
    });
}
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

exports.default = RouterConfigCreator;