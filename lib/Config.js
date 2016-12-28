'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.baseConfig = undefined;
exports.mergeConfig = mergeConfig;
exports.mergeWithBaseConfig = mergeWithBaseConfig;
exports.promptWithDefaults = promptWithDefaults;

var _immutable = require('immutable');

var baseConfig = exports.baseConfig = {
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
        onCreate: function onCreate() {
            return function () {
                console.warn('Entity Editor: please define config.callbacks.onCreate(config: Object) => ({payload: Object}) before using it');
                return false;
            };
        },
        onUpdate: function onUpdate() {
            return function () {
                console.warn('Entity Editor: please define config.callbacks.onUpdate(config: Object) => ({id: string, payload: Object}) before using it');
                return false;
            };
        },
        onDelete: function onDelete() {
            return function () {
                console.warn('Entity Editor: please define config.callbacks.onDelete(config: Object) => ({id: string}) before using it');
                return false;
            };
        },
        onGoList: function onGoList() {
            return function () {
                console.warn('Entity Editor: please define config.callbacks.onGoList(config: Object) => () before using it');
                return false;
            };
        },
        onGoNew: function onGoNew() {
            return function () {
                console.warn('Entity Editor: please define config.callbacks.onGoNew(config: Object) => () before using it');
                return false;
            };
        },
        onGoEdit: function onGoEdit() {
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
            return function () {
                callbacks.onGoList();
            };
        },
        afterUpdate: function afterUpdate() {
            return function () {
                // do nothing
            };
        },
        afterDelete: function afterDelete(_ref10) {
            var callbacks = _ref10.callbacks;
            return function () {
                console.log('after delete');
                //callbacks.onGoList();
            };
        },
        afterGoList: function afterGoList() {
            return function () {
                // do nothing
            };
        },
        afterGoNew: function afterGoNew() {
            return function () {
                // do nothing
            };
        },
        afterGoEdit: function afterGoEdit() {
            return function () {
                // do nothing
            };
        }
    },
    successActions: {
        save: function save(_ref11) {
            var callbacks = _ref11.callbacks;
            return function (successActionProps) {
                var called = successActionProps.called;

                if (called == 'onUpdate') {
                    return callbacks.afterUpdate(successActionProps);
                }
                return callbacks.afterCreate(successActionProps);
            };
        },
        // remove these and autogenerate them
        saveNew: function saveNew(_ref12) {
            var callbacks = _ref12.callbacks;
            return function (successActionProps) {
                return callbacks.afterCreate(successActionProps);
            };
        },
        delete: function _delete(_ref13) {
            var callbacks = _ref13.callbacks;
            return function (successActionProps) {
                return callbacks.afterDelete(successActionProps);
            };
        },
        goList: function goList(_ref14) {
            var callbacks = _ref14.callbacks;
            return function (successActionProps) {
                return callbacks.afterGoList(successActionProps);
            };
        },
        goNew: function goNew(_ref15) {
            var callbacks = _ref15.callbacks;
            return function (successActionProps) {
                return callbacks.afterGoNew(successActionProps);
            };
        },
        goEdit: function goEdit(_ref16) {
            var callbacks = _ref16.callbacks;
            return function (successActionProps) {
                return callbacks.afterGoEdit(successActionProps);
            };
        }
    },
    confirmPrompts: {
        saveNew: {
            message: 'Are you sure you want to save a new copy of this item?',
            yes: 'Save as new',
            no: 'Cancel'
        },
        delete: {
            message: 'Are you sure you want to delete this item?',
            yes: 'Delete',
            no: 'Cancel'
        },
        go: {
            showWhen: function showWhen(_ref17) {
                var dirty = _ref17.dirty;
                return dirty;
            },
            title: 'Unsaved changes',
            message: 'You have unsaved changes. What would you like to do?',
            yes: 'Discard changes',
            no: 'Keep editing'
        }
    },
    successPrompts: {
        save: {
            message: 'Item saved.'
        },
        saveNew: {
            message: 'Item saved.'
        },
        delete: {
            message: 'Item deleted.'
        }
    },
    errorPrompts: {
        save: {
            message: 'An error has occured, your item could not be saved right now.'
        },
        saveNew: {
            message: 'An error has occured, your item could not be saved right now.'
        },
        delete: {
            message: 'An error has occured, your item could not be deleted right now.'
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
    }
};

function mergeConfig() {
    var superableKeys = (0, _immutable.fromJS)(['actions', 'callbacks', 'successActions']);

    var _super = (0, _immutable.fromJS)({});

    for (var _len = arguments.length, mergeConfigs = Array(_len), _key = 0; _key < _len; _key++) {
        mergeConfigs[_key] = arguments[_key];
    }

    return (0, _immutable.fromJS)(mergeConfigs).filter(function (ii) {
        return ii;
    }).reduce(function (config, ii) {
        return config.mergeWith(function (prev, next, key) {
            return !superableKeys.includes(key) ? prev.mergeDeep(next) : prev.mergeWith(function (prev, next, subKey) {
                // keep overrriden versions of callbacks and actions so they can each call super
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

function promptWithDefaults(configObject, type, action, editorData) {
    var config = (0, _immutable.fromJS)(configObject);
    var prompt = config.getIn([type + 'Prompts', action]);

    if (!prompt || prompt.has('showWhen') && !prompt.get('showWhen')(editorData)) {
        return null;
    }
    if (!config.has('promptDefaults')) {
        return prompt;
    }

    var base = config.get('promptDefaults').map(function (ii) {
        return ii.get ? ii.get(type) : ii;
    });

    return base.merge(prompt).toJS();
}