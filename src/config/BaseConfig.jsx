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
        save: ({operations}: ActionConfig) => (actionProps: {id: ?string, payload: Object}): Promiseable => {
            if(!actionProps.payload) {
                throw `EntityEditor: config.actions.save: actionProps.payload is not defined`;
            }

            if(actionProps.id) {
                return operations
                    .onUpdate(actionProps)
                    .then((result): AfterActionProps => ({result, actionProps, called: 'onUpdate'}));
            }
            return operations
                .onCreate(actionProps)
                .then((result): AfterActionProps => ({result, actionProps, called: 'onCreate'}));
        },
        saveNew: ({operations}: ActionConfig) => (actionProps: {id: ?string, payload: Object}): Promiseable => {
            if(!actionProps.payload) {
                throw `EntityEditor: config.actions.saveNew: actionProps.payload is not defined`;
            }
            return operations
                .onCreate(actionProps)
                .then((result): AfterActionProps => ({result, actionProps, called: 'onCreate'}));
        },
        delete: ({operations}: ActionConfig) => (actionProps: {id: string}): Promiseable => {
            if(!actionProps.id) {
                throw `EntityEditor: config.actions.delete: actionProps.id is not defined`;
            }
            return operations
                .onDelete(actionProps)
                .then((result): AfterActionProps => ({result, actionProps, called: 'onDelete'}));
        },
        dirty: ({operations}: ActionConfig) => (actionProps: {dirty: Boolean}): Promiseable => {
            return operations
                .onDirty({dirty: actionProps.dirty})
                .then((result): AfterActionProps => ({result, actionProps, called: 'onDirty'}));
        }
    },
    operations: {
        onDirty: ({setEditorState}: OperationConfig) => (callbackProps: {dirty: boolean}): Promiseable => {
            setEditorState.dirty(callbackProps.dirty);
        },
        afterCreate: ({operations}: OperationConfig) => (successActionProps: AfterActionProps): Promiseable => {
            return operations.onGoList();
        },
        afterUpdate: ({operations}: OperationConfig) => (successActionProps: AfterActionProps): Promiseable => {
        },
        afterDelete: ({operations}: OperationConfig) => (successActionProps: AfterActionProps): Promiseable => {
            return operations.onGoList();
        }
    },
    successActions: {
        save: ({operations}: OperationConfig) => (successActionProps: AfterActionProps): Promiseable => {
            const {called} = successActionProps;
            if(called == 'onUpdate') {
                return operations.afterUpdate(successActionProps);
            }
            return operations.afterCreate(successActionProps);
        }
    },
    prompts: {
        get: {
            // get can only have an error message
            error: {
                message: ({item}) => <span>An error has occurred, this {item} could not be loaded right now.</span>
            }
        },
        list: {
            // list can only have an error message
            error: {
                message: ({items}) => <span>An error has occurred, these {items} could not be loaded right now.</span>
            }
        },
        save: {
            success: {
                message: ({Item}) => <span>{Item} saved.</span>
            },
            error: {
                message: ({item}) => <span>An error has occurred, this {item} could not be saved right now.</span>
            }
        },
        saveNew: {
            confirm: {
                message: ({item}) => <span>Are you sure you want to save this as a new {item}?</span>,
                yes: `Save as new`,
                no: `Cancel`
            },
            success: {
                message: ({Item}) => <span>{Item} saved.</span>
            },
            error: {
                message: ({item}) => <span>An error has occurred, this {item} could not be saved right now.</span>
            }
        },
        delete: {
            confirm: {
                message: ({item}) => <span>Are you sure you want to delete this {item}?</span>,
                yes: `Delete`,
                no: `Cancel`
            },
            success: {
                message: ({Item}) => <span>{Item} deleted.</span>
            },
            error: {
                message: ({item}) => <span>An error has occurred, this {item} could not be deleted right now.</span>
            }
        }
    },
    promptDefaults: {
        title: {
            confirm: `Confirm`,
            success: `Success`,
            error: `Error`
        },
        yes: `Okay`,
        asProps: false
    },
    components: {
        loader: (props) => <p>Loading...</p>,
        error: ({title, Message, item}) => {
            return <div>
                <p><strong>{title}</strong></p>
                <Message {...item} />
            </div>;
        },
        prompt: (props) => <Modal {...props} />,
        promptContent: (props) => <ModalContent {...props} />
    }
});

export default BaseConfig;
