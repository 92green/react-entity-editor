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
        save: function save(_ref) {
            var operations = _ref.operations;
            return function (actionProps) {
                if (!actionProps.payload) {
                    throw 'EntityEditor: config.actions.save: actionProps.payload is not defined';
                }

                if (actionProps.id) {
                    return operations.onUpdate(actionProps).then(function (result) {
                        return { result: result, actionProps: actionProps, called: 'onUpdate' };
                    });
                }
                return operations.onCreate(actionProps).then(function (result) {
                    return { result: result, actionProps: actionProps, called: 'onCreate' };
                });
            };
        },
        saveNew: function saveNew(_ref2) {
            var operations = _ref2.operations;
            return function (actionProps) {
                if (!actionProps.payload) {
                    throw 'EntityEditor: config.actions.saveNew: actionProps.payload is not defined';
                }
                return operations.onCreate(actionProps).then(function (result) {
                    return { result: result, actionProps: actionProps, called: 'onCreate' };
                });
            };
        },
        delete: function _delete(_ref3) {
            var operations = _ref3.operations;
            return function (actionProps) {
                if (!actionProps.id) {
                    throw 'EntityEditor: config.actions.delete: actionProps.id is not defined';
                }
                return operations.onDelete(actionProps).then(function (result) {
                    return { result: result, actionProps: actionProps, called: 'onDelete' };
                });
            };
        },
        dirty: function (_dirty) {
            function dirty(_x) {
                return _dirty.apply(this, arguments);
            }

            dirty.toString = function () {
                return _dirty.toString();
            };

            return dirty;
        }(function (_ref4) {
            var operations = _ref4.operations;
            return function (actionProps) {
                return operations.onDirty({ dirty: actionProps.dirty }).then(function (result) {
                    return { result: result, actionProps: actionProps, called: 'onDirty' };
                });
            };
        })
    },
    operations: {
        onDirty: function onDirty(_ref5) {
            var setEditorState = _ref5.setEditorState;
            return function (callbackProps) {
                setEditorState.dirty(callbackProps.dirty);
            };
        },
        afterCreate: function afterCreate(_ref6) {
            var operations = _ref6.operations;
            return function (successActionProps) {
                return operations.onGoList();
            };
        },
        afterUpdate: function afterUpdate(_ref7) {
            var operations = _ref7.operations;
            return function (successActionProps) {};
        },
        afterDelete: function afterDelete(_ref8) {
            var operations = _ref8.operations;
            return function (successActionProps) {
                return operations.onGoList();
            };
        }
    },
    successActions: {
        save: function save(_ref9) {
            var operations = _ref9.operations;
            return function (successActionProps) {
                var called = successActionProps.called;

                if (called == 'onUpdate') {
                    return operations.afterUpdate(successActionProps);
                }
                return operations.afterCreate(successActionProps);
            };
        }
    },
    prompts: {
        get: {
            // get can only have an error message
            error: {
                message: function message(_ref10) {
                    var item = _ref10.item;
                    return _react2.default.createElement(
                        'span',
                        null,
                        'An error has occurred, this ',
                        item,
                        ' could not be loaded right now.'
                    );
                }
            }
        },
        list: {
            // list can only have an error message
            error: {
                message: function message(_ref11) {
                    var items = _ref11.items;
                    return _react2.default.createElement(
                        'span',
                        null,
                        'An error has occurred, these ',
                        items,
                        ' could not be loaded right now.'
                    );
                }
            }
        },
        save: {
            success: {
                message: function message(_ref12) {
                    var Item = _ref12.Item;
                    return _react2.default.createElement(
                        'span',
                        null,
                        Item,
                        ' saved.'
                    );
                }
            },
            error: {
                message: function message(_ref13) {
                    var item = _ref13.item;
                    return _react2.default.createElement(
                        'span',
                        null,
                        'An error has occurred, this ',
                        item,
                        ' could not be saved right now.'
                    );
                }
            }
        },
        saveNew: {
            confirm: {
                message: function message(_ref14) {
                    var item = _ref14.item;
                    return _react2.default.createElement(
                        'span',
                        null,
                        'Are you sure you want to save this as a new ',
                        item,
                        '?'
                    );
                },
                yes: 'Save as new',
                no: 'Cancel'
            },
            success: {
                message: function message(_ref15) {
                    var Item = _ref15.Item;
                    return _react2.default.createElement(
                        'span',
                        null,
                        Item,
                        ' saved.'
                    );
                }
            },
            error: {
                message: function message(_ref16) {
                    var item = _ref16.item;
                    return _react2.default.createElement(
                        'span',
                        null,
                        'An error has occurred, this ',
                        item,
                        ' could not be saved right now.'
                    );
                }
            }
        },
        delete: {
            confirm: {
                message: function message(_ref17) {
                    var item = _ref17.item;
                    return _react2.default.createElement(
                        'span',
                        null,
                        'Are you sure you want to delete this ',
                        item,
                        '?'
                    );
                },
                yes: 'Delete',
                no: 'Cancel'
            },
            success: {
                message: function message(_ref18) {
                    var Item = _ref18.Item;
                    return _react2.default.createElement(
                        'span',
                        null,
                        Item,
                        ' deleted.'
                    );
                }
            },
            error: {
                message: function message(_ref19) {
                    var item = _ref19.item;
                    return _react2.default.createElement(
                        'span',
                        null,
                        'An error has occurred, this ',
                        item,
                        ' could not be deleted right now.'
                    );
                }
            }
        }
    },
    promptDefaults: {
        title: {
            confirm: 'Confirm',
            success: 'Success',
            error: 'Error'
        },
        yes: 'Okay',
        asProps: false
    },
    components: {
        loader: function loader(props) {
            return _react2.default.createElement(
                'p',
                null,
                'Loading...'
            );
        },
        error: function error(_ref20) {
            var title = _ref20.title,
                Message = _ref20.Message,
                item = _ref20.item;

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'p',
                    null,
                    _react2.default.createElement(
                        'strong',
                        null,
                        title
                    )
                ),
                _react2.default.createElement(Message, item)
            );
        },
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