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
        get: {
            description: "Gets a single item based on an id. Data about items is received via props, so this object exists just so we can provide an error message.",
            tasks: {
                error: {
                    type: "prompt",
                    prompt: ({item}) => ({
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
                    prompt: ({item}) => ({
                        title: "Error",
                        message: ({items}) => <span>An error has occurred, these {items} could not be loaded right now.</span>
                    })
                }
            }
        },
        save: {
            description: "If the item already exists this calls the onUpdate operation, or calls onCreate for new items.",
            workflow: {
                task: "operation",
                onSuccess: {
                    task: "success"
                },
                onError: {
                    task: "error"
                }
            },
            tasks: {
                operation: {
                    type: "operation",
                    operation: ({operations}: ActionConfig) => (actionProps: {id: ?string, payload: Object}): Promiseable => {
                        if(!actionProps.payload) {
                            throw `EntityEditor: config.actions.save: actionProps.payload is not defined`;
                        }

                        if(actionProps.id) {
                            return operations.onUpdate(actionProps);
                        }
                        return operations.onCreate(actionProps);
                    }
                },
                success: {
                    type: "prompt",
                    prompt: ({Item}) => ({
                        title: "Success",
                        message: <span>{Item} saved.</span>,
                        yes: "Okay"
                    })
                },
                error: {
                    type: "prompt",
                    prompt: ({item}) => ({
                        title: "Error",
                        message: <span>An error has occurred, this {item} could not be saved right now.</span>,
                        yes: "Okay"
                    })
                }
            }
        },
        saveNew: {
            description: "Always calls onCreate to make a new item, regardless of whether the data was loaded from an existing item.",
            workflow: {
                task: "confirm",
                onYes: {
                    task: "operation",
                    onSuccess: {
                        task: "success"
                    },
                    onError: {
                        task: "error"
                    }
                }
            },
            tasks: {
                operation: {
                    type: "operation",
                    operation: ({operations}: ActionConfig) => (actionProps: {id: ?string, payload: Object}): Promiseable => {
                        if(!actionProps.payload) {
                            throw `EntityEditor: config.actions.saveNew: actionProps.payload is not defined`;
                        }
                        return operations.onCreate(actionProps);
                    }
                },
                confirm: {
                    type: "prompt",
                    prompt: ({item}) => ({
                        title: "Confirm",
                        message: <span>Are you sure you want to save this as a new {item}?</span>,
                        yes: `Save as new`,
                        no: `Cancel`
                    })
                },
                success: {
                    type: "prompt",
                    prompt: ({item}) => ({
                        title: "Success",
                        message: <span>New {item} saved.</span>,
                        yes: "Okay"
                    })
                },
                error: {
                    type: "prompt",
                    prompt: ({item}) => ({
                        title: "Error",
                        message: <span>An error has occurred, this {item} could not be saved right now.</span>,
                        yes: "Okay"
                    })
                }
            }
        },
        delete: {
            description: "Confirms if the user wants to delete, and calls the onDelete operation for an item.",
            workflow: {
                task: "confirm",
                onYes: {
                    task: "operation",
                    onSuccess: {
                        task: "success"
                    },
                    onError: {
                        task: "error"
                    }
                }
            },
            tasks: {
                operation: {
                    task: "operation",
                    operation: ({operations}: ActionConfig) => (actionProps: {id: string}): Promiseable => {
                        if(!actionProps.id) {
                            throw `EntityEditor: config.actions.delete: actionProps.id is not defined`;
                        }
                        return operations.onDelete(actionProps);
                    }
                },
                confirm: {
                    type: "prompt",
                    prompt: ({item}) => ({
                        title: "Confirm",
                        message: <span>Are you sure you want to delete this {item}?</span>,
                        yes: `Delete`,
                        no: `Cancel`
                    })
                },
                success: {
                    type: "prompt",
                    prompt: ({Item}) => ({
                        title: "Success",
                        message: <span>{Item} deleted.</span>,
                        yes: "Okay"
                    })
                },
                error: {
                    type: "prompt",
                    prompt: ({item}) => ({
                        title: "Error",
                        message: <span>An error has occurred, this {item} could not be deleted right now.</span>,
                        yes: "Okay"
                    })
                }
            }
        },
        dirty: {
            description: "Sets the 'dirty' state of the editor. The editor is dirty when there are unsaved changes.",
            workflow: {
                task: "operation"
            },
            tasks: {
                operation: {
                    task: "operation",
                    operation: ({operations}: ActionConfig) => (actionProps: {dirty: Boolean}): Promiseable => {
                        return operations.onDirty({dirty: actionProps.dirty});
                    }
                }
            }
        }
    },
    operations: {
        onDirty: ({setEditorState}: OperationConfig) => (operationProps: {dirty: boolean}): Promiseable => {
            setEditorState.dirty(operationProps.dirty);
        },
        onCreateSuccess: ({operations}: OperationConfig) => (): Promiseable => {
            return operations.onGoList();
        },
        onDeleteSuccess: ({operations}: OperationConfig) => (): Promiseable => {
            return operations.onGoList();
        }
    },
    components: {
        loader: (props) => <p>Loading...</p>,
        /*error: ({title, Message, item}) => {
            return <div>
                <p><strong>{title}</strong></p>
                <Message {...item} />
            </div>;
        },*/
        prompt: (props) => <Modal {...props} />,
        promptContent: (props) => <ModalContent {...props} />
    }
});

export default BaseConfig;
