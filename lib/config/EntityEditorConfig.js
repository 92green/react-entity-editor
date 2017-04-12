'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EntityEditorConfig = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

var _immutable = require('immutable');

var _Utils = require('../utils/Utils');

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

            // merge configs together
            var merged = this._config.mergeDeep(toMerge).toJS();

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
            var item = this._config.getIn(['item', 'single'], 'item');
            var items = this._config.getIn(['item', 'plural'], item + 's');
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