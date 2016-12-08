'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mergeWithBaseConfig = exports.mergeConfig = exports.baseConfig = undefined;

var _immutable = require('immutable');

var baseConfig = exports.baseConfig = {
    actions: {
        save: function save(id, data) {
            console.log('save', data);
        },
        saveNew: function saveNew(id, data) {
            console.log('save new', data);
        },
        savePartial: function savePartial(id, partialData) {
            console.log('save partial', partialData);
        },
        delete: function _delete(id) {
            console.log('delete', id);
        },
        goList: function goList() {
            console.log('go list');
        },
        goNew: function goNew() {
            console.log('go new');
        },
        goEdit: function goEdit(id) {
            console.log('go edit', id);
        }
    },
    callbacks: {
        /*onCreate: (data: Object) => {
            console.warn(`Entity Editor: please define config.callbacks.onCreate(data: Object) before using it`);
        },
        onUpdate: (id: string, data: Object) => {
            console.warn(`Entity Editor: please define config.callbacks.onUpdate(id: string, data: Object) before using it`);
        },
        onDelete: (id: string) => {
            console.warn(`Entity Editor: please define config.callbacks.onDelete(id: string) before using it`);
        },
        onGoList: () => {
            console.warn(`Entity Editor: please define config.callbacks.onGoList() before using it`);
        },
        onGoNew: () => {
            console.warn(`Entity Editor: please define config.callbacks.onGoNew() before using it`);
        },
        onGoEdit: (id: string) => {
            console.warn(`Entity Editor: please define config.callbacks.onGoEdit(id: string) before using it`);
        }*/
    }
};

var mergeConfig = exports.mergeConfig = function mergeConfig() {
    for (var _len = arguments.length, mergeConfigs = Array(_len), _key = 0; _key < _len; _key++) {
        mergeConfigs[_key] = arguments[_key];
    }

    return (0, _immutable.fromJS)(mergeConfigs).filter(function (ii) {
        return ii;
    }).reduce(function (config, ii) {
        return config.mergeDeep(ii);
    }, (0, _immutable.Map)()).toJS();
};

var mergeWithBaseConfig = exports.mergeWithBaseConfig = function mergeWithBaseConfig() {
    for (var _len2 = arguments.length, mergeConfigs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        mergeConfigs[_key2] = arguments[_key2];
    }

    return mergeConfig.apply(undefined, [baseConfig].concat(mergeConfigs));
};