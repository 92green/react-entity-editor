'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EntityEditorConfig = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

var _immutable = require('immutable');

var _Utils = require('../Utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EntityEditorConfig = function () {
    function EntityEditorConfig(config) {
        _classCallCheck(this, EntityEditorConfig);

        this._config = (0, _immutable.fromJS)(config);
    }

    _createClass(EntityEditorConfig, [{
        key: 'get',
        value: function get(key, notSetValue) {
            return this._config.get(key, notSetValue);
        }
    }, {
        key: 'getIn',
        value: function getIn(searchKeyPath, notSetValue) {
            return this._config.getIn(searchKeyPath, notSetValue);
        }
    }, {
        key: 'merge',
        value: function merge(nextConfig) {
            var toMerge = EntityEditorConfig.isEntityEditorConfig(nextConfig) ? nextConfig._config : (0, _immutable.fromJS)(nextConfig);

            var superableKeys = (0, _immutable.List)(EntityEditorConfig.superableKeys());
            //var _super: Map<string, any> = Map();

            // merge configs together
            var merged = this._config.mergeWith(function (prev, next, key) {
                //if(!superableKeys.includes(key)) {
                return prev.mergeDeep(next);
                //}
                //return prev.mergeWith((prev, next, subKey) => {
                // keep overridden versions of operations and actions so they can each call super
                //    _super = _super.updateIn([key, subKey], List(), ii => ii.push(prev));
                //     return next;
                //}, next);
            }, toMerge)
            //.set('_super', _super)
            .toJS();

            return new EntityEditorConfig(merged);
        }
    }, {
        key: 'data',
        value: function data() {
            return this._config;
        }
    }, {
        key: 'partiallyApplyOperations',
        value: function partiallyApplyOperations() {
            var additionalFunctionsForActions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            return this._config.get('operations').reduce(function (operations, operation, key) {

                // partially apply the operations so they have knowledge of the full set of operations and any other config they're allowed to receive
                var partiallyAppliedOperation = operation(_extends({
                    operations: operations
                }, additionalFunctionsForActions));

                // if not a function then this operation hasnt been set up correctly, error out
                if (typeof partiallyAppliedOperation != "function") {
                    throw 'Entity Editor: operation "' + key + ' must be a function that returns a \'operation\' function, such as (config) => (operationProps) => { /* return null, promise or false */ }"';
                }

                // wrap partiallyAppliedOperation in a function that forces the operation to always return a promise
                var fn = function fn() {
                    return (0, _Utils.returnPromise)(partiallyAppliedOperation.apply(undefined, arguments));
                };

                // add to the map to return
                return operations.set(key, fn);
            }, (0, _immutable.Map)()).toObject();
        }
    }, {
        key: 'prompt',
        value: function prompt(action, type) {
            var editorData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            var prompt = this._config.getIn(['prompts', action, type]);

            if (!prompt || prompt.has('showWhen') && !prompt.get('showWhen')(editorData)) {
                return null;
            }

            if (!this._config.has('promptDefaults')) {
                return prompt;
            }

            var base = this._config.get('promptDefaults').map(function (ii) {
                return ii.get ? ii.get(type) : ii;
            });

            return base.merge(prompt).set('item', this.itemNames()).set('type', type).toJS();
        }
    }, {
        key: 'itemNames',
        value: function itemNames() {
            var ucfirst = function ucfirst(str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            };
            var item = this._config.get('single', 'item');
            var items = this._config.get('plural', item + 's');
            return {
                item: item,
                items: items,
                Item: ucfirst(item),
                Items: ucfirst(items)
            };
        }
    }], [{
        key: 'isEntityEditorConfig',
        value: function isEntityEditorConfig(obj) {
            return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) == "object" && obj instanceof EntityEditorConfig;
        }
    }, {
        key: 'validate',
        value: function validate(obj) {
            if (!EntityEditorConfig.isEntityEditorConfig(obj)) {
                throw new Error('Expected object of type EntityEditorConfig, got ' + obj);
            }
        }
    }, {
        key: 'superableKeys',
        value: function superableKeys() {
            return ['actions', 'operations', 'successActions'];
        }
    }]);

    return EntityEditorConfig;
}();

function EntityEditorConfigFactory(config) {
    if (EntityEditorConfig.isEntityEditorConfig(config)) {
        return config;
    }
    return new EntityEditorConfig(config);
}

// add static methods to factory
EntityEditorConfigFactory.isEntityEditorConfig = EntityEditorConfig.isEntityEditorConfig;
EntityEditorConfigFactory.validate = EntityEditorConfig.validate;
EntityEditorConfigFactory.superableKeys = EntityEditorConfig.superableKeys;

exports.default = EntityEditorConfigFactory;
exports.EntityEditorConfig = EntityEditorConfig;