'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EntityEditorConfig = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

var _assignWith = require('lodash/assignWith');

var _assignWith2 = _interopRequireDefault(_assignWith);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _isObject = require('lodash/isObject');

var _isObject2 = _interopRequireDefault(_isObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EntityEditorConfig = function () {
    function EntityEditorConfig(config) {
        _classCallCheck(this, EntityEditorConfig);

        this._config = config;
    }

    _createClass(EntityEditorConfig, [{
        key: 'get',
        value: function get(key, notSetValue) {
            return (0, _get3.default)(this._config, key, notSetValue);
        }
    }, {
        key: 'getIn',
        value: function getIn(searchKeyPath, notSetValue) {
            return (0, _get3.default)(this._config, searchKeyPath, notSetValue);
        }
    }, {
        key: 'merge',
        value: function merge(nextConfig) {
            if (typeof nextConfig == "function") {
                nextConfig = nextConfig(this);
            }

            var toMerge = EntityEditorConfig.isEntityEditorConfig(nextConfig) ? nextConfig._config : nextConfig;

            // merge configs together
            // only merge plain objects, and not workflow
            var mergeFunction = function mergeFunction(oldVal, newVal, key) {
                var doMerge = (0, _isObject2.default)(oldVal) && (0, _isObject2.default)(newVal) && key !== "workflow";

                return doMerge ? (0, _assignWith2.default)(oldVal, newVal, mergeFunction) : newVal;
            };

            var merged = (0, _assignWith2.default)(this._config, toMerge, mergeFunction);
            return new EntityEditorConfig(merged);
        }
    }, {
        key: 'data',
        value: function data() {
            return this._config;
        }
    }, {
        key: 'itemNames',
        value: function itemNames() {
            var ucfirst = function ucfirst(str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            };
            var item = (0, _get3.default)(this._config, ['item', 'single'], 'item');
            var items = (0, _get3.default)(this._config, ['item', 'plural'], item + 's');
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

exports.default = EntityEditorConfigFactory;
exports.EntityEditorConfig = EntityEditorConfig;