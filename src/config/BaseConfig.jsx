/* @flow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

import React from 'react';

import EntityEditorConfig from './EntityEditorConfig';
import EntityEditorHock from '../EntityEditorHock';
import EntityEditorState from '../EntityEditorState';
import Modal from '../modal/Modal';
import ModalContent from '../modal/ModalContent';

const BaseConfig: EntityEditorConfig = EntityEditorConfig({
    item: {
        single: "item"
    },
    actions: {
        create: {
            description: "Calls the create operation.",
            workflow: {
                task: "createOperate",
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
        update: {
            description: "Calls the update operation.",
            workflow: {
                task: "updateOperate",
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
                    task: "createOperate",
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
        go: {
            description: "Navigates to another route or view",
            workflow: {
                task: "goConfirm",
                next: {
                    onYes: {
                        task: "cleanOperate",
                        next: {
                            onSuccess: {
                                task: "goOperate"
                            }
                        }
                    }
                }
            }
        }
    },
    tasks: {
        createOperate: {
            operation: "create",
            status: ({item}) => ({
                title: "Saving",
                message: <span>Saving {item}...</span>
            })
        },
        updateOperate: {
            operation: "update",
            status: ({item}) => ({
                title: "Saving",
                message: <span>Saving {item}...</span>
            })
        },
        saveOperate: {
            operation: "save",
            status: ({item}) => ({
                title: "Saving",
                message: <span>Saving {item}...</span>
            })
        },
        saveSuccess: {
            status: ({Item}) => ({
                title: "Saved",
                message: <span>{Item} saved.</span>,
                yes: "Okay"
            })
        },
        saveError: {
            status: ({item}) => ({
                title: "Error",
                message: <span>An error has occurred, this {item} could not be saved right now.</span>,
                yes: "Okay"
            })
        },
        saveNewConfirm: {
            status: ({item}) => ({
                title: "Confirm",
                message: <span>Are you sure you want to save this as a new {item}?</span>,
                yes: `Save as new`,
                no: `Cancel`
            })
        },
        saveNewSuccess: {
            status: ({item}) => ({
                title: "Saved",
                message: <span>New {item} saved.</span>,
                yes: "Okay"
            })
        },
        deleteConfirm: {
            status: ({item}) => ({
                title: "Confirm",
                message: <span>Are you sure you want to delete this {item}?</span>,
                yes: `Delete`,
                no: `Cancel`
            })
        },
        deleteOperate: {
            operation: "delete",
            status: ({item}) => ({
                title: "Deleting",
                message: <span>Deleting {item}...</span>
            })
        },
        deleteSuccess: {
            status: ({Item}) => ({
                title: "Deleted",
                message: <span>{Item} deleted.</span>,
                yes: "Okay"
            })
        },
        deleteError: {
            status: ({item}) => ({
                title: "Error",
                message: <span>An error has occurred, this {item} could not be deleted right now.</span>,
                yes: "Okay"
            })
        },
        goConfirm: {
            skip: ({editorState}) => editorState.dirty ? null : "onYes",
            status: () => ({
                title: "Unsaved changes",
                message: <span>You have unsaved changes. What would you like to do?</span>,
                yes: "Discard changes",
                no: "Keep editing"
            })
        },
        goOperate: {
            operation: "go",
            preSuccess: true // progress to next success step just before firing operation
        },
        cleanOperate: {
            operation: "clean"
        }
    },
    operations: {
        create: ({operations, props, setEditorState}: Object) => (actionProps: Object): Promiseable => {
            console.warn(`"create" operation not defined, set this in your config`);
        },
        update: ({operations, props, setEditorState}: Object) => (actionProps: Object): Promiseable => {
            console.warn(`"update" operation not defined, set this in your config`);
        },
        delete: ({operations, props, setEditorState}: Object) => (actionProps: Object): Promiseable => {
            console.warn(`"delete" operation not defined, set this in your config`);
        },
        go: ({operations, props, setEditorState}: Object) => (actionProps: Object): Promiseable => {
            console.warn(`"go" operation not defined, set this in your config`);
        },
        save: ({operations}: Object) => (actionProps: {id: ?string, payload: Object}): Promiseable => {
            if(!actionProps.payload) {
                return Promise.reject(`EntityEditor: config.operations.save: actionProps.payload is not defined`);
            }
            if(actionProps.id) {
                return operations.update(actionProps);
            }
            return operations.create(actionProps);
        },
        dirty: ({setEditorState}: Object) => (): Promiseable => {
            setEditorState({dirty: true});
        },
        clean: ({setEditorState}: Object) => (): Promiseable => {
            setEditorState({dirty: false});
        }
    },
    initialEditorState: {
        dirty: false
    },
    composeComponents: (config) => [
        EntityEditorState(config),
        EntityEditorHock(config)
    ],
    operationProps: ii => ii,
    lifecycleMethods: {
        componentWillMount: {},
        componentDidMount: {},
        componentWillReceiveProps: {},
        componentWillUnmount: {}
    }
});

export default BaseConfig;
