"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    createSuccess: function createSuccess(_ref) {
        var onYes = _ref.onYes;
        var entity = _ref.entity;
        return {
            type: "success",
            title: "Success",
            message: entity('first') + " created.",
            yes: "Okay",
            onYes: onYes
        };
    },

    updateSuccess: function updateSuccess(_ref2) {
        var onYes = _ref2.onYes;
        var entity = _ref2.entity;
        return {
            type: "success",
            title: "Success",
            message: entity('first') + " saved.",
            yes: "Okay",
            onYes: onYes
        };
    },

    deleteSuccess: function deleteSuccess(_ref3) {
        var onYes = _ref3.onYes;
        var entity = _ref3.entity;
        return {
            type: "success",
            title: "Success",
            message: entity('first') + " deleted.",
            yes: "Okay",
            onYes: onYes
        };
    },

    deleteConfirm: function deleteConfirm(_ref4) {
        var onYes = _ref4.onYes;
        var onNo = _ref4.onNo;
        var entity = _ref4.entity;
        return {
            type: "confirm",
            title: "Warning",
            message: "Are you sure you want to delete this " + entity() + "? This action cannot be undone.",
            yes: "Delete",
            no: "Cancel",
            onYes: onYes,
            onNo: onNo
        };
    },

    closeConfirm: function closeConfirm(_ref5) {
        var onYes = _ref5.onYes;
        var onNo = _ref5.onNo;
        var entity = _ref5.entity;
        return {
            type: "confirm",
            title: "Unsaved changes",
            message: "You have unsaved changes on this " + entity() + ". What would you like to do?",
            yes: "Discard changes",
            no: "Keep editing",
            onYes: onYes,
            onNo: onNo
        };
    },

    resetConfirm: function resetConfirm(_ref6) {
        var onYes = _ref6.onYes;
        var onNo = _ref6.onNo;
        var entity = _ref6.entity;
        return {
            type: "confirm",
            title: "Warning",
            message: "Are you sure you want to reset this " + entity() + "? You will lose any changes since your last save.",
            yes: "Reset",
            no: "Cancel",
            onYes: onYes,
            onNo: onNo
        };
    },

    errorOnWrite: function errorOnWrite(_ref7) {
        var error = _ref7.error;
        var onYes = _ref7.onYes;
        return {
            type: "error",
            title: "Error",
            yes: "Okay",
            message: error.message,
            status: error.status,
            onYes: onYes
        };
    }
};