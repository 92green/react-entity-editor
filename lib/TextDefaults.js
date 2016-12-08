"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var defaultPrompts = {
    createSuccess: function createSuccess(_ref) {
        var onYes = _ref.onYes,
            entityName = _ref.entityName;
        return {
            type: "success",
            title: "Success",
            message: entityName('first') + " created.",
            yes: "Okay",
            onYes: onYes
        };
    },

    updateSuccess: function updateSuccess(_ref2) {
        var onYes = _ref2.onYes,
            entityName = _ref2.entityName;
        return {
            type: "success",
            title: "Success",
            message: entityName('first') + " saved.",
            yes: "Okay",
            onYes: onYes
        };
    },

    deleteSuccess: function deleteSuccess(_ref3) {
        var onYes = _ref3.onYes,
            entityName = _ref3.entityName;
        return {
            type: "success",
            title: "Success",
            message: entityName('first') + " deleted.",
            yes: "Okay",
            onYes: onYes
        };
    },

    saveNewConfirm: function saveNewConfirm(_ref4) {
        var onYes = _ref4.onYes,
            onNo = _ref4.onNo,
            entityName = _ref4.entityName;
        return {
            type: "confirm",
            title: "Warning",
            message: "Are you sure you want to save a new copy of this " + entityName() + "?",
            yes: "Save as new",
            no: "Cancel",
            onYes: onYes,
            onNo: onNo
        };
    },

    deleteConfirm: function deleteConfirm(_ref5) {
        var onYes = _ref5.onYes,
            onNo = _ref5.onNo,
            entityName = _ref5.entityName;
        return {
            type: "confirm",
            title: "Warning",
            message: "Are you sure you want to delete this " + entityName() + "? This action cannot be undone.",
            yes: "Delete",
            no: "Cancel",
            onYes: onYes,
            onNo: onNo
        };
    },

    closeConfirm: function closeConfirm(_ref6) {
        var onYes = _ref6.onYes,
            onNo = _ref6.onNo,
            entityName = _ref6.entityName;
        return {
            type: "confirm",
            title: "Unsaved changes",
            message: "You have unsaved changes on this " + entityName() + ". What would you like to do?",
            yes: "Discard changes",
            no: "Keep editing",
            onYes: onYes,
            onNo: onNo
        };
    },

    resetConfirm: function resetConfirm(_ref7) {
        var onYes = _ref7.onYes,
            onNo = _ref7.onNo,
            entityName = _ref7.entityName;
        return {
            type: "confirm",
            title: "Warning",
            message: "Are you sure you want to reset this " + entityName() + "? You will lose any changes since your last save.",
            yes: "Reset",
            no: "Cancel",
            onYes: onYes,
            onNo: onNo
        };
    },

    errorOnWrite: function errorOnWrite(_ref8) {
        var error = _ref8.error,
            onYes = _ref8.onYes;
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

var defaultWords = {
    entityName: function entityName(entityProps, modifiers) {
        if (modifiers.includes('plural')) {
            return entityProps.entityNamePlural || entityProps.entityName + "s";
        }
        return entityProps.entityName;
    },
    actionName: function actionName(entityProps, modifiers, isNew) {
        return isNew ? "add new" : "edit";
    },
    modifiers: {
        first: function first(words) {
            return words.charAt(0).toUpperCase() + words.slice(1);
        },
        titleCase: function titleCase(words) {
            return words.split(" ").map(function (word) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            }).join(" ");
        },
        upperCase: function upperCase(words) {
            return woreds.toUpperCase();
        }
    }
};

exports.defaultPrompts = defaultPrompts;
exports.defaultWords = defaultWords;