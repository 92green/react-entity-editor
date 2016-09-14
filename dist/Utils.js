"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

exports.returnPromise = returnPromise;
exports.returnBoolean = returnBoolean;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// returnPromise

// if passed a promise, this returns the promise
// if passed anything else, this returns a resolved promise

function returnPromise(item) {
    return (typeof item === "undefined" ? "undefined" : (0, _typeof3.default)(item)) == "object" && typeof item.then != "undefined" ? item : new _promise2.default(function (resolve) {
        return resolve(item);
    });
}

// returnBoolean

// if passed a function, this calls the function and returns its result cast to a boolean
// if passed anything else, this return the item cast to a boolean

function returnBoolean(item) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    return typeof item == "function" ? !!item.apply(undefined, args) : !!item;
}