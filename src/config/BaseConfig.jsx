/* @flow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

import React from 'react';
import {fromJS, Map, List} from 'immutable';

import EntityEditorConfig from './EntityEditorConfig';
import Modal from '../modal/Modal';
import ModalContent from '../modal/ModalContent';

const BaseConfig: EntityEditorConfig = EntityEditorConfig({
    item: {
        single: "item"
    },
    actions: {
        save: {
            description: "If the item already exists this calls the update operation, or calls create for new items.",
            workflow: {
                task: "saveOperate",
                next: {
                    onSuccess: {
                        task: "saveSuccess"
                    },
                    onError: {
                        task: "saveError"
                    }
                }
            }
        },
        saveNew: {
            description: "Always calls create to make a new item, regardless of whether the data was loaded from an existing item.",
            workflow: {
                task: "saveNewConfirm",
                onYes: {
                    task: "saveNewOperate",
                    next: {
                        onSuccess: {
                            task: "saveNewSuccess"
                        },
                        onError: {
                            task: "saveError"
                        }
                    }
                }
            }
        },
        delete: {
            description: "Confirms if the user wants to delete, and calls the delete operation for an item.",
            workflow: {
                task: "deleteConfirm",
                next: {
                    onYes: {
                        task: "deleteOperate",
                        next: {
                            onSuccess: {
                                task: "deleteSuccess"
                            },
                            onError: {
                                task: "deleteError"
                            }
                        }
                    }
                }
            }
        },
        go: {
            description: "Navigates to another route or view",
            workflow: {
                task: "goConfirm",
                next: {
                    onYes: {
                        task: "goOperate"
                    }
                }
            }
        }
    },
    tasks: {
        saveOperate: {
            operate: ({operations}) => (actionProps: {id: ?string, payload: Object}): Promiseable => {
                if(!actionProps.payload) {
                    throw `EntityEditor: config.actions.save: actionProps.payload is not defined`;
                }
                if(actionProps.id) {
                    return operations
                        .update(actionProps)
                        .then(() => operations.dirty({dirty: false}));
                }
                return operations
                    .create(actionProps)
                    .then(() => operations.dirty({dirty: false}));
            },
            status: ({item}) => ({
                title: "Saving",
                message: <span>Saving {item}...</span>
            }),
            statusOutput: "prompt"
        },
        saveSuccess: {
            status: ({Item}) => ({
                title: "Saved",
                message: <span>{Item} saved.</span>,
                yes: "Okay"
            }),
            statusOutput: "prompt"
        },
        saveError: {
            status: ({item}) => ({
                title: "Error",
                message: <span>An error has occurred, this {item} could not be saved right now.</span>,
                yes: "Okay"
            }),
            statusOutput: "prompt"
        },
        saveNewConfirm: {
            status: ({item}) => ({
                title: "Confirm",
                message: <span>Are you sure you want to save this as a new {item}?</span>,
                yes: `Save as new`,
                no: `Cancel`
            }),
            statusOutput: "prompt"
        },
        saveNewOperate: {
            operate: ({operations}) => (actionProps: {id: ?string, payload: Object}): Promiseable => {
                if(!actionProps.payload) {
                    throw `EntityEditor: config.actions.saveNew: actionProps.payload is not defined`;
                }
                return operations
                    .create(actionProps)
                    .then(() => operations.dirty({dirty: false}));
            },
            status: ({item}) => ({
                title: "Saving",
                message: <span>Saving {item}...</span>
            }),
            statusOutput: "prompt"
        },
        saveNewSuccess: {
            status: ({item}) => ({
                title: "Saved",
                message: <span>New {item} saved.</span>,
                yes: "Okay"
            }),
            statusOutput: "prompt"
        },
        deleteConfirm: {
            status: ({item}) => ({
                title: "Confirm",
                message: <span>Are you sure you want to delete this {item}?</span>,
                yes: `Delete`,
                no: `Cancel`
            }),
            statusOutput: "prompt"
        },
        deleteOperate: {
            operate: ({operations}) => (actionProps: {id: string}): Promiseable => {
                if(!actionProps.id) {
                    throw `EntityEditor: config.actions.delete: actionProps.id is not defined`;
                }
                return operations
                    .delete(actionProps)
                    .then(() => operations.dirty({dirty: false}));
            },
            status: ({item}) => ({
                title: "Deleting",
                message: <span>Deleting {item}...</span>
            }),
            statusOutput: "prompt"
        },
        deleteSuccess: {
            status: ({Item}) => ({
                title: "Deleted",
                message: <span>{Item} deleted.</span>,
                yes: "Okay"
            }),
            statusOutput: "prompt"
        },
        deleteError: {
            status: ({item}) => ({
                title: "Error",
                message: <span>An error has occurred, this {item} could not be deleted right now.</span>,
                yes: "Okay"
            }),
            statusOutput: "prompt"
        },
        goConfirm: {
            skip: ({editorState}) => editorState.dirty ? null : "onYes",
            status: () => ({
                title: "Unsaved changes",
                message: <span>You have unsaved changes. What would you like to do?</span>,
                yes: "Discard changes",
                no: "Keep editing"
            }),
            statusOutput: "prompt"
        },
        goOperate: {
            operate: ({operations}) => (actionProps: Object): Promiseable => {
                return operations
                    .go(actionProps);
            }
        }
    },
    operations: {
        dirty: ({setEditorState}) => ({dirty}: {dirty: boolean}): Promiseable => {
            setEditorState({dirty});
        }
    },
    initialEditorState: {
        dirty: false
    },
    // add different statuses in here with components inside
    components: {
        prompt: (props) => <Modal {...props} />,
        promptContent: (props) => <ModalContent {...props} />
    }
});

export default BaseConfig;
