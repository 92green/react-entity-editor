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
                return actionProps.id ? callbacks.onUpdate(actionProps) : callbacks.onCreate(actionProps);
            };
        },
        saveNew: function saveNew(_ref2) {
            var callbacks = _ref2.callbacks;
            return function (actionProps) {
                if (!actionProps.payload) {
                    throw 'EntityEditor: config.actions.saveNew: actionProps.payload is not defined';
                }
                return callbacks.onCreate(actionProps);
            };
        },
        delete: function _delete(_ref3) {
            var callbacks = _ref3.callbacks;
            return function (actionProps) {
                if (!actionProps.id) {
                    throw 'EntityEditor: config.actions.delete: actionProps.id is not defined';
                }
                return callbacks.onDelete(actionProps);
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
                return callbacks.onDirty({ dirty: actionProps.dirty });
            };
        }),
        goList: function goList(_ref5) {
            var callbacks = _ref5.callbacks;
            return function () {
                return callbacks.onGoList();
            };
        },
        goNew: function goNew(_ref6) {
            var callbacks = _ref6.callbacks;
            return function () {
                return callbacks.onGoNew();
            };
        },
        goEdit: function goEdit(_ref7) {
            var callbacks = _ref7.callbacks;
            return function (actionProps) {
                if (!actionProps.id) {
                    throw 'EntityEditor: config.actions.saveNew: actionProps.id is not defined';
                }
                return callbacks.onGoEdit({ id: actionProps.id });
            };
        }
    },
    callbacks: {
        onCreate: function onCreate(props) {
            console.warn('Entity Editor: please define config.callbacks.onCreate({payload: Object}) before using it');
            return false;
        },
        onUpdate: function onUpdate(props) {
            console.warn('Entity Editor: please define config.callbacks.onUpdate({id: string, payload: Object}) before using it');
            return false;
        },
        onDelete: function onDelete(props) {
            console.warn('Entity Editor: please define config.callbacks.onDelete({id: string}) before using it');
            return false;
        },
        onGoList: function onGoList() {
            console.warn('Entity Editor: please define config.callbacks.onGoList() before using it');
            return false;
        },
        onGoNew: function onGoNew() {
            console.warn('Entity Editor: please define config.callbacks.onGoNew() before using it');
            return false;
        },
        onGoEdit: function onGoEdit(props) {
            console.warn('Entity Editor: please define config.callbacks.onGoEdit({id: string}) before using it');
            return false;
        },
        onDirty: null // onDirty is a special callback that is added by EntityEditorHock. Do not override it unless you like strife.
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
            showWhen: function showWhen(_ref8) {
                var dirty = _ref8.dirty;
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
        yes: 'Okay'
    }
};

function mergeConfig() {
    for (var _len = arguments.length, mergeConfigs = Array(_len), _key = 0; _key < _len; _key++) {
        mergeConfigs[_key] = arguments[_key];
    }

    return (0, _immutable.fromJS)(mergeConfigs).filter(function (ii) {
        return ii;
    }).reduce(function (config, ii) {
        return config.mergeDeep(ii);
    }, (0, _immutable.Map)()).toJS();
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
        return typeof ii == "string" ? ii : ii.get(type);
    });

    return base.merge(prompt).toJS();
}