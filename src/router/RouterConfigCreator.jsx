/* @flow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

import React from 'react';
import {fromJS, Map, List} from 'immutable';
import EntityEditorConfig from '../config/EntityEditorConfig';

// title: `Unsaved changes`,
//                 message: () => <span>You have unsaved changes. What would you like to do?</span>,
//                 yes: `Discard changes`,
//                 no: `Keep editing`

function RouterConfigCreator(): EntityEditorConfig {
    return EntityEditorConfig({
        item: {
            single: "item"
        },
        actions: {
            goList: {
                description: "Navigates to the list page.",
                workflow: {
                    task: "confirm",
                    onYes: {
                        task: "operation"
                    }
                },
                tasks: {
                    operation: ({operations}: ActionConfig) => (actionProps: Object): Promiseable => {
                        return operations.onGoList();
                    },
                    confirm: {
                        type: "prompt",
                        prompt: ({item}) => ({
                            title: "Confirm",
                            message: <span>Ready set go.</span>
                        })
                    }
                }
            },
            goItem: {
                description: "Navigates to the item page.",
                workflow: {
                    task: "confirm",
                    onYes: {
                        task: "operation"
                    }
                },
                tasks: {
                    operation: ({operations}: ActionConfig) => (actionProps: {id: string}): Promiseable => {
                        if(!actionProps.id) {
                            throw `EntityEditorRouter: goItem actionProps.id is not defined`;
                        }
                        return operations.onGoItem({id: actionProps.id});
                    },
                    confirm: {
                        type: "prompt",
                        prompt: ({item}) => ({
                            title: "Confirm",
                            message: <span>Ready set go.</span>
                        })
                    }
                }
            },
            goNew: {
                description: "Navigates to the new item page.",
                workflow: {
                    task: "confirm",
                    onYes: {
                        task: "operation"
                    }
                },
                tasks: {
                    operation: ({operations}: ActionConfig) => (actionProps: Object): Promiseable => {
                        return operations.onGoNew();
                    },
                    confirm: {
                        type: "prompt",
                        prompt: ({item}) => ({
                            title: "Confirm",
                            message: <span>Ready set go.</span>
                        })
                    }
                }
            }
        },
        operations: {
            onGoList: () => () => {
                console.log("on go list");
                //router.push(paths().list);
            },
            onGoNew: () => () => {
                console.log("on go new");
                //router.push(paths().new);
            },
            onGoItem: () => (props: {id: string}) => {
                console.log("on go edit");
                //router.push(paths(props.id).edit);
            }
        }
    });
}

export default RouterConfigCreator;
