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
        /*get: {
            description: "Gets a single item based on an id. Data about items is received via props, so this object exists just so we can provide an error message.",
            tasks: {
                error: {
                    type: "prompt",
                    style: "modal",
                    status: ({item}) => ({
                        title: "Error",
                        message: <span>An error has occurred, this {item} could not be loaded right now.</span>
                    })
                }
            }
        },
        list: {
            description: "Lists all items. Data about lists of items is received via props, so this object exists just so we can provide an error message.",
            tasks: {
                error: {
                    type: "prompt",
                    style: "modal",
                    status: ({item}) => ({
                        title: "Error",
                        message: ({items}) => <span>An error has occurred, these {items} could not be loaded right now.</span>
                    })
                }
            }
        },*/
        save: {
            description: "If the item already exists this calls the onUpdate operation, or calls onCreate for new items.",
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
            description: "Always calls onCreate to make a new item, regardless of whether the data was loaded from an existing item.",
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
            description: "Confirms if the user wants to delete, and calls the onDelete operation for an item.",
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
        },
        dirty: {
            description: "Sets the 'dirty' state of the editor. The editor is dirty when there are unsaved changes.",
            workflow: {
                task: "dirtyOperate"
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
                        .onUpdate(actionProps)
                        .then(() => operations.onDirty({dirty: false}));
                }
                return operations
                    .onCreate(actionProps)
                    .then(() => operations.onDirty({dirty: false}));
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
                    .onCreate(actionProps)
                    .then(() => operations.onDirty({dirty: false}));
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
                    .onDelete(actionProps)
                    .then(() => operations.onDirty({dirty: false}));
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
            operate: ({operations}) => (actionProps: Object) => {
                return operations
                    .onGo(actionProps)
                    .then(() => operations.onDirty({dirty: false}));
            }
        },
        dirtyOperate: {
            operate: ({operations}) => (actionProps: {dirty: Boolean}): Promiseable => {
                return operations.onDirty({dirty: actionProps.dirty});
            }
        }
    },
    operations: {
        onDirty: ({setEditorState}) => (actionProps: {dirty: boolean}): Promiseable => {
            setEditorState.dirty(actionProps.dirty);
        }
    },
    // add different statuses in here with components inside
    components: {
        prompt: (props) => <Modal {...props} />,
        promptContent: (props) => <ModalContent {...props} />
    }
});

export default BaseConfig;
