"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.returnPromise = returnPromise;
exports.returnBoolean = returnBoolean;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// returnPromise

// if passed a promise, this returns the promise
// if passed anything else, this returns a reject promise if false, or a resolved promise otherwise

function returnPromise(item) {
    if (item && (typeof item === "undefined" ? "undefined" : _typeof(item)) == "object" && typeof item.then != "undefined") {
        return item;
    }
    return item === false ? new Promise(function (resolve, reject) {
        return reject(item);
    }) : new Promise(function (resolve) {
        return resolve(item);
    });
}

// returnBoolean

// if passed a function, this calls the function and returns its result cast to a boolean
// if passed anything else, this return the item cast to a boolean

function returnBoolean(item) {
    if (item && typeof item == "function") {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        return !!item.apply(undefined, _toConsumableArray(args));
    }
    return !!item;
}