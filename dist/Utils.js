"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

exports.returnPromise = returnPromise;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// returnPromise

// if passed a promise, this returns the promise
// if passed anything else, this returns a resolved promise

function returnPromise(item) {
    if ((typeof item === "undefined" ? "undefined" : (0, _typeof3.default)(item)) == "object" && typeof item.then != "undefined") {
        return item;
    }
    return new _promise2.default(function (resolve) {
        return resolve(item);
    });
}