const defaultPrompts = {
    createSuccess: ({onYes, entityName}) => ({
        type: "success",
        title: "Success",
        message: `${entityName('first')} created.`,
        yes: "Okay",
        onYes
    }),

    updateSuccess: ({onYes, entityName}) => ({
        type: "success",
        title: "Success",
        message: `${entityName('first')} saved.`,
        yes: "Okay",
        onYes
    }),

    deleteSuccess: ({onYes, entityName}) => ({
        type: "success",
        title: "Success",
        message: `${entityName('first')} deleted.`,
        yes: "Okay",
        onYes
    }),
    
    deleteConfirm: ({onYes, onNo, entityName}) => ({
        type: "confirm",
        title: "Warning",
        message: `Are you sure you want to delete this ${entityName()}? This action cannot be undone.`,
        yes: "Delete",
        no: "Cancel",
        onYes,
        onNo
    }),

    closeConfirm: ({onYes, onNo, entityName}) => ({
        type: "confirm",
        title: "Unsaved changes",
        message: `You have unsaved changes on this ${entityName()}. What would you like to do?`,
        yes: "Discard changes",
        no: "Keep editing",
        onYes,
        onNo
    }),

    resetConfirm: ({onYes, onNo, entityName}) => ({
        type: "confirm",
        title: "Warning",
        message: `Are you sure you want to reset this ${entityName()}? You will lose any changes since your last save.`,
        yes: "Reset",
        no: "Cancel",
        onYes,
        onNo
    }),

    errorOnWrite: ({error, onYes}) => ({
        type: "error",
        title: "Error",
        yes: "Okay",
        message: error.message,
        status: error.status,
        onYes
    })
};

const defaultWords = {
    entityName: (entityProps, modifiers) => {
        if(modifiers.includes('plural')) {
            return entityProps.entityNamePlural || entityProps.entityName+"s";
        }
        return entityProps.entityName;
    },
    actionName: (entityProps, modifiers, isNew) => {
        return isNew ? "add new" : "edit";
    },
    modifiers: {
        first: (words) => {
            return words.charAt(0).toUpperCase() + words.slice(1);
        },
        titleCase: (words) => {
            return words.split(" ").map(word => {
                return word.charAt(0).toUpperCase() + word.slice(1);
            }).join(" ");
        },
        upperCase: (words) => {
            return woreds.toUpperCase();
        }
    }
};

export {
    defaultPrompts,
    defaultWords
}