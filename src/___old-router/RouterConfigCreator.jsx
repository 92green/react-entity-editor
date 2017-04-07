/* @flow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

import React from 'react';
import {fromJS, Map, List} from 'immutable';
import EntityEditorConfig from '../config/EntityEditorConfig';

const unsavedChanges: Function = ({editorState, onYes}) => {
    if(!editorState.dirty) {
        return onYes();
    }
    return {
        title: "Unsaved changes",
        message: <span>You have unsaved changes. What would you like to do?</span>,
        yes: "Discard changes",
        no: "Keep editing"
    };
};

function RouterConfigCreator({router, paths}: Object): EntityEditorConfig {
    return EntityEditorConfig({
        actions: {
            goList: {
                description: "Navigates to the list page.",
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
                            return operations.onGoList();
                        }
                    },
                    confirm: {
                        type: "prompt",
                        prompt: unsavedChanges
                    }
                }
            },
            goItem: {
                description: "Navigates to the item page.",
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
                        operate: ({operations}) => (actionProps: {id: string}) => {
                            if(!actionProps.id) {
                                throw `EntityEditorRouter: goItem actionProps.id is not defined`;
                            }
                            return operations.onGoItem({id: actionProps.id});
                        }
                    },
                    confirm: {
                        type: "prompt",
                        prompt: unsavedChanges
                    }
                }
            },
            goNew: {
                description: "Navigates to the new item page.",
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
                            return operations.onGoNew();
                        }
                    },
                    confirm: {
                        type: "prompt",
                        prompt: unsavedChanges
                    }
                }
            }
        },
        operations: {
            onGoList: () => () => {
                console.log("on go list");
                router.push(paths().list);
            },
            onGoNew: () => () => {
                console.log("on go new");
                router.push(paths().new);
            },
            onGoItem: () => (props: {id: string}) => {
                console.log("on go edit");
                router.push(paths(props.id).edit);
            }
        }
    });
}

export default RouterConfigCreator;
