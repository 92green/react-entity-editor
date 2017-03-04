'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.baseConfig = undefined;
exports.mergeConfig = mergeConfig;
exports.mergeWithBaseConfig = mergeWithBaseConfig;
exports.promptWithDefaults = promptWithDefaults;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _Modal = require('./modal/Modal');

var _Modal2 = _interopRequireDefault(_Modal);

var _ModalContent = require('./modal/ModalContent');

var _ModalContent2 = _interopRequireDefault(_ModalContent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

var baseConfig = exports.baseConfig = {
    item: {
        single: "item"
    },
    actions: {
        save: function save(_ref) {
            var callbacks = _ref.callbacks;
            return function (actionProps) {
                if (!actionProps.payload) {
                    throw 'EntityEditor: config.actions.save: actionProps.payload is not defined';
                }

                if (actionProps.id) {
                    return callbacks.onUpdate(actionProps).then(function (result) {
                        return { result: result, actionProps: actionProps, called: 'onUpdate' };
                    });
                }
                return callbacks.onCreate(actionProps).then(function (result) {
                    return { result: result, actionProps: actionProps, called: 'onCreate' };
                });
            };
        },
        saveNew: function saveNew(_ref2) {
            var callbacks = _ref2.callbacks;
            return function (actionProps) {
                if (!actionProps.payload) {
                    throw 'EntityEditor: config.actions.saveNew: actionProps.payload is not defined';
                }
                return callbacks.onCreate(actionProps).then(function (result) {
                    return { result: result, actionProps: actionProps, called: 'onCreate' };
                });
            };
        },
        delete: function _delete(_ref3) {
            var callbacks = _ref3.callbacks;
            return function (actionProps) {
                if (!actionProps.id) {
                    throw 'EntityEditor: config.actions.delete: actionProps.id is not defined';
                }
                return callbacks.onDelete(actionProps).then(function (result) {
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
            var callbacks = _ref4.callbacks;
            return function (actionProps) {
                return callbacks.onDirty({ dirty: actionProps.dirty }).then(function (result) {
                    return { result: result, actionProps: actionProps, called: 'onDirty' };
                });
            };
        }),
        goList: function goList(_ref5) {
            var callbacks = _ref5.callbacks;
            return function (actionProps) {
                return callbacks.onGoList().then(function (result) {
                    return { result: result, actionProps: actionProps, called: 'onGoList' };
                });
            };
        },
        goNew: function goNew(_ref6) {
            var callbacks = _ref6.callbacks;
            return function (actionProps) {
                return callbacks.onGoNew().then(function (result) {
                    return { result: result, actionProps: actionProps, called: 'onGoNew' };
                });
            };
        },
        goEdit: function goEdit(_ref7) {
            var callbacks = _ref7.callbacks;
            return function (actionProps) {
                if (!actionProps.id) {
                    throw 'EntityEditor: config.actions.goEdit: actionProps.id is not defined';
                }
                return callbacks.onGoEdit({ id: actionProps.id }).then(function (result) {
                    return { result: result, actionProps: actionProps, called: 'onGoEdit' };
                });
            };
        }
    },
    callbacks: {
        onCreate: function onCreate(callbackConfig) {
            return function () {
                console.warn('Entity Editor: please define config.callbacks.onCreate(config: Object) => ({payload: Object}) before using it');
                return false;
            };
        },
        onUpdate: function onUpdate(callbackConfig) {
            return function () {
                console.warn('Entity Editor: please define config.callbacks.onUpdate(config: Object) => ({id: string, payload: Object}) before using it');
                return false;
            };
        },
        onDelete: function onDelete(callbackConfig) {
            return function () {
                console.warn('Entity Editor: please define config.callbacks.onDelete(config: Object) => ({id: string}) before using it');
                return false;
            };
        },
        onGoList: function onGoList(callbackConfig) {
            return function () {
                console.warn('Entity Editor: please define config.callbacks.onGoList(config: Object) => () before using it');
                return false;
            };
        },
        onGoNew: function onGoNew(callbackConfig) {
            return function () {
                console.warn('Entity Editor: please define config.callbacks.onGoNew(config: Object) => () before using it');
                return false;
            };
        },
        onGoEdit: function onGoEdit(callbackConfig) {
            return function () {
                console.warn('Entity Editor: please define config.callbacks.onGoEdit(config: Object) => ({id: string}) before using it');
                return false;
            };
        },
        onDirty: function onDirty(_ref8) {
            var setEditorState = _ref8.setEditorState;
            return function (callbackProps) {
                setEditorState.dirty(callbackProps.dirty);
            };
        },

        //
        // callbacks called after success of an action
        //

        afterCreate: function afterCreate(_ref9) {
            var callbacks = _ref9.callbacks;
            return function (successActionProps) {
                return callbacks.onGoList();
            };
        },
        afterUpdate: function afterUpdate(_ref10) {
            var callbacks = _ref10.callbacks;
            return function (successActionProps) {};
        },
        afterDelete: function afterDelete(_ref11) {
            var callbacks = _ref11.callbacks;
            return function (successActionProps) {
                return callbacks.onGoList();
            };
        }
    },
    successActions: {
        save: function save(_ref12) {
            var callbacks = _ref12.callbacks;
            return function (successActionProps) {
                var called = successActionProps.called;

                if (called == 'onUpdate') {
                    return callbacks.afterUpdate(successActionProps);
                }
                return callbacks.afterCreate(successActionProps);
            };
        }
    },
    prompts: {
        get: {
            // get can only have an error message
            error: {
                message: function message(_ref13) {
                    var item = _ref13.item;
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
                message: function message(_ref14) {
                    var items = _ref14.items;
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
        saveNew: {
            confirm: {
                message: function message(_ref17) {
                    var item = _ref17.item;
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
                message: function message(_ref18) {
                    var Item = _ref18.Item;
                    return _react2.default.createElement(
                        'span',
                        null,
                        Item,
                        ' saved.'
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
                        ' could not be saved right now.'
                    );
                }
            }
        },
        delete: {
            confirm: {
                message: function message(_ref20) {
                    var item = _ref20.item;
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
                message: function message(_ref21) {
                    var Item = _ref21.Item;
                    return _react2.default.createElement(
                        'span',
                        null,
                        Item,
                        ' deleted.'
                    );
                }
            },
            error: {
                message: function message(_ref22) {
                    var item = _ref22.item;
                    return _react2.default.createElement(
                        'span',
                        null,
                        'An error has occurred, this ',
                        item,
                        ' could not be deleted right now.'
                    );
                }
            }
        },
        go: {
            confirm: {
                showWhen: function showWhen(_ref23) {
                    var dirty = _ref23.dirty;
                    return dirty;
                },
                title: 'Unsaved changes',
                message: function message() {
                    return _react2.default.createElement(
                        'span',
                        null,
                        'You have unsaved changes. What would you like to do?'
                    );
                },
                yes: 'Discard changes',
                no: 'Keep editing'
            }
        },
        goList: {},
        goNew: {},
        goEdit: {}
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
        error: function error(_ref24) {
            var title = _ref24.title,
                Message = _ref24.Message,
                item = _ref24.item;

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
};

function mergeConfig() {
    var superableKeys = (0, _immutable.fromJS)(['actions', 'callbacks', 'successActions']);

    var _super = (0, _immutable.fromJS)({});

    // merge configs together

    for (var _len = arguments.length, mergeConfigs = Array(_len), _key = 0; _key < _len; _key++) {
        mergeConfigs[_key] = arguments[_key];
    }

    return (0, _immutable.fromJS)(mergeConfigs).filter(function (ii) {
        return ii;
    }).reduce(function (config, ii) {
        // merge each config with the next and deal with conflicts
        return config.mergeWith(function (prev, next, key) {
            return !superableKeys.includes(key) ? prev.mergeDeep(next) : prev.mergeWith(function (prev, next, subKey) {
                // keep overriden versions of callbacks and actions so they can each call super
                _super = _super.updateIn([key, subKey], (0, _immutable.List)(), function (ii) {
                    return ii.push(prev);
                });
                return next;
            }, next);
        }, ii);
    }, (0, _immutable.Map)()).set('_super', _super).toJS();
}

function mergeWithBaseConfig() {
    for (var _len2 = arguments.length, mergeConfigs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        mergeConfigs[_key2] = arguments[_key2];
    }

    return mergeConfig.apply(undefined, [baseConfig].concat(mergeConfigs));
}

function promptWithDefaults(configObject, type, action) {
    var editorData = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    var config = (0, _immutable.fromJS)(configObject);
    var prompt = config.getIn(['prompts', action, type]);

    if (!prompt || prompt.has('showWhen') && !prompt.get('showWhen')(editorData)) {
        return null;
    }
    if (!config.has('promptDefaults')) {
        return prompt;
    }

    var base = config.get('promptDefaults').map(function (ii) {
        return ii.get ? ii.get(type) : ii;
    });

    return base.merge(prompt).set('item', itemNames(config.get('item'))).set('type', type).toJS();
}

function itemNames(configItem) {
    var ucfirst = function ucfirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
    var item = configItem.get('single', 'item');
    var items = configItem.get('plural', item + 's');

    return (0, _immutable.Map)({
        item: item,
        items: items,
        Item: ucfirst(item),
        Items: ucfirst(items)
    });
}