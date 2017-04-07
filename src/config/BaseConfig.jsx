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
                    style: "modal",
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
                    style: "modal",
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
                task: "operate",
                next: {
                    onSuccess: {
                        task: "success"
                    },
                    onError: {
                        task: "error"
                    }
                }
            },
            tasks: {
                operate: {
                    type: "operate",
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
                    }
                },
                success: {
                    type: "prompt",
                    style: "modal",
                    prompt: ({Item}) => ({
                        title: "Saved",
                        message: <span>{Item} saved.</span>,
                        yes: "Okay"
                    })
                },
                error: {
                    type: "prompt",
                    style: "modal",
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
                    task: "operate",
                    next: {
                        onSuccess: {
                            task: "success"
                        },
                        onError: {
                            task: "error"
                        }
                    }
                }
            },
            tasks: {
                operate: {
                    type: "operate",
                    operate: ({operations}) => (actionProps: {id: ?string, payload: Object}): Promiseable => {
                        if(!actionProps.payload) {
                            throw `EntityEditor: config.actions.saveNew: actionProps.payload is not defined`;
                        }
                        return operations
                            .onCreate(actionProps)
                            .then(() => operations.onDirty({dirty: false}));
                    }
                },
                confirm: {
                    type: "prompt",
                    style: "modal",
                    prompt: ({item}) => ({
                        title: "Confirm",
                        message: <span>Are you sure you want to save this as a new {item}?</span>,
                        yes: `Save as new`,
                        no: `Cancel`
                    })
                },
                success: {
                    type: "prompt",
                    style: "modal",
                    prompt: ({item}) => ({
                        title: "Saved",
                        message: <span>New {item} saved.</span>,
                        yes: "Okay"
                    })
                },
                error: {
                    type: "prompt",
                    style: "modal",
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
                next: {
                    onYes: {
                        task: "operate",
                        next: {
                            onSuccess: {
                                task: "success"
                            },
                            onError: {
                                task: "error"
                            }
                        }
                    }
                }
            },
            tasks: {
                operate: {
                    type: "operate",
                    operate: ({operations}) => (actionProps: {id: string}): Promiseable => {
                        if(!actionProps.id) {
                            throw `EntityEditor: config.actions.delete: actionProps.id is not defined`;
                        }
                        return operations
                            .onDelete(actionProps)
                            .then(() => operations.onDirty({dirty: false}));
                    }
                },
                confirm: {
                    type: "prompt",
                    style: "modal",
                    prompt: ({item}) => ({
                        title: "Confirm",
                        message: <span>Are you sure you want to delete this {item}?</span>,
                        yes: `Delete`,
                        no: `Cancel`
                    })
                },
                success: {
                    type: "prompt",
                    style: "modal",
                    prompt: ({Item}) => ({
                        title: "Deleted",
                        message: <span>{Item} deleted.</span>,
                        yes: "Okay"
                    })
                },
                error: {
                    type: "prompt",
                    style: "modal",
                    prompt: ({item}) => ({
                        title: "Error",
                        message: <span>An error has occurred, this {item} could not be deleted right now.</span>,
                        yes: "Okay"
                    })
                }
            }
        },
        go: {
            description: "Navigates to another page",
            workflow: {
                task: "confirm",
                next: {
                    onYes: {
                        task: "operate"
                    }
                }
            },
            tasks: {
                operate: {
                    type: "operate",
                    operate: ({operations}) => (actionProps: Object) => {
                        return operations
                            .onGo(actionProps)
                            .then(() => operations.onDirty({dirty: false}));
                    }
                },
                confirm: {
                    type: "prompt",
                    style: "modal",
                    skip: ({editorState}) => editorState.dirty ? null : "onYes",
                    prompt: () => ({
                        title: "Unsaved changes",
                        message: <span>You have unsaved changes. What would you like to do?</span>,
                        yes: "Discard changes",
                        no: "Keep editing"
                    })
                }
            }
        },
        dirty: {
            description: "Sets the 'dirty' state of the editor. The editor is dirty when there are unsaved changes.",
            workflow: {
                task: "operate"
            },
            tasks: {
                operate: {
                    type: "operate",
                    operate: ({operations}) => (actionProps: {dirty: Boolean}): Promiseable => {
                        return operations.onDirty({dirty: actionProps.dirty});
                    }
                }
            }
        }
    },
    operations: {
        onDirty: ({setEditorState}) => (actionProps: {dirty: boolean}): Promiseable => {
            setEditorState.dirty(actionProps.dirty);
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
