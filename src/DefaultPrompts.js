export default {
    createSuccess: ({onYes, entity}) => ({
        type: "success",
        title: "Success",
        message: `${entity('first')} created.`,
        yes: "Okay",
        onYes
    }),

    updateSuccess: ({onYes, entity}) => ({
        type: "success",
        title: "Success",
        message: `${entity('first')} saved.`,
        yes: "Okay",
        onYes
    }),

    deleteSuccess: ({onYes, entity}) => ({
        type: "success",
        title: "Success",
        message: `${entity('first')} deleted.`,
        yes: "Okay",
        onYes
    }),
    
    deleteConfirm: ({onYes, onNo, entity}) => ({
        type: "confirm",
        title: "Warning",
        message: `Are you sure you want to delete this ${entity()}? This action cannot be undone.`,
        yes: "Delete",
        no: "Cancel",
        onYes,
        onNo
    }),

    closeConfirm: ({onYes, onNo, entity}) => ({
        type: "confirm",
        title: "Unsaved changes",
        message: `You have unsaved changes on this ${entity()}. What would you like to do?`,
        yes: "Discard changes",
        no: "Keep editing",
        onYes,
        onNo
    }),

    resetConfirm: ({onYes, onNo, entity}) => ({
        type: "confirm",
        title: "Warning",
        message: `Are you sure you want to reset this ${entity()}? You will lose any changes since your last save.`,
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