/* @flow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

import {fromJS, Map, List} from 'immutable';

export const baseConfig: Config = {
    actions: {
        save: ({callbacks}: ActionConfig) => (actionProps: {id: ?string, payload: Object}): Promiseable => {
            if(!actionProps.payload) {
                throw `EntityEditor: config.actions.save: actionProps.payload is not defined`;
            }

            if(actionProps.id) {
                return callbacks
                    .onUpdate(actionProps)
                    .then((result): AfterActionProps => ({result, actionProps, called: 'onUpdate'}));
            }
            return callbacks
                .onCreate(actionProps)
                .then((result): AfterActionProps => ({result, actionProps, called: 'onCreate'}));
        },
        saveNew: ({callbacks}: ActionConfig) => (actionProps: {id: ?string, payload: Object}): Promiseable => {
            if(!actionProps.payload) {
                throw `EntityEditor: config.actions.saveNew: actionProps.payload is not defined`;
            }
            return callbacks
                .onCreate(actionProps)
                .then((result): AfterActionProps => ({result, actionProps, called: 'onCreate'}));
        },
        delete: ({callbacks}: ActionConfig) => (actionProps: {id: string}): Promiseable => {
            if(!actionProps.id) {
                throw `EntityEditor: config.actions.delete: actionProps.id is not defined`;
            }
            return callbacks
                .onDelete(actionProps)
                .then((result): AfterActionProps => ({result, actionProps, called: 'onDelete'}));
        },
        dirty: ({callbacks}: ActionConfig) => (actionProps: {dirty: Boolean}): Promiseable => {
            return callbacks
                .onDirty({dirty: actionProps.dirty})
                .then((result): AfterActionProps => ({result, actionProps, called: 'onDirty'}));
        },
        goList: ({callbacks}: ActionConfig) => (actionProps: Object): Promiseable => {
            return callbacks
                .onGoList()
                .then((result): AfterActionProps => ({result, actionProps, called: 'onGoList'}));
        },
        goNew: ({callbacks}: ActionConfig) => (actionProps: Object): Promiseable => {
            return callbacks
                .onGoNew()
                .then((result): AfterActionProps => ({result, actionProps, called: 'onGoNew'}));
        },
        goEdit: ({callbacks}: ActionConfig) => (actionProps: {id: string}): Promiseable => {
            if(!actionProps.id) {
                throw `EntityEditor: config.actions.goEdit: actionProps.id is not defined`;
            }
            return callbacks
                .onGoEdit({id: actionProps.id})
                .then((result): AfterActionProps => ({result, actionProps, called: 'onGoEdit'}));
        }
    },
    callbacks: {
        onCreate: (callbackConfig: CallbackConfig) => (): Promiseable => {
            console.warn(`Entity Editor: please define config.callbacks.onCreate(config: Object) => ({payload: Object}) before using it`);
            return false;
        },
        onUpdate: (callbackConfig: CallbackConfig) => (): Promiseable => {
            console.warn(`Entity Editor: please define config.callbacks.onUpdate(config: Object) => ({id: string, payload: Object}) before using it`);
            return false;
        },
        onDelete: (callbackConfig: CallbackConfig) => (): Promiseable => {
            console.warn(`Entity Editor: please define config.callbacks.onDelete(config: Object) => ({id: string}) before using it`);
            return false;
        },
        onGoList: (callbackConfig: CallbackConfig) => (): Promiseable => {
            console.warn(`Entity Editor: please define config.callbacks.onGoList(config: Object) => () before using it`);
            return false;
        },
        onGoNew: (callbackConfig: CallbackConfig) => (): Promiseable => {
            console.warn(`Entity Editor: please define config.callbacks.onGoNew(config: Object) => () before using it`);
            return false;
        },
        onGoEdit: (callbackConfig: CallbackConfig) => (): Promiseable => {
            console.warn(`Entity Editor: please define config.callbacks.onGoEdit(config: Object) => ({id: string}) before using it`);
            return false;
        },
        onDirty: ({setEditorState}: CallbackConfig) => (callbackProps: {dirty: boolean}): Promiseable => {
            setEditorState.dirty(callbackProps.dirty);
        },

        //
        // callbacks called after success of an action
        //

        afterCreate: ({callbacks}: CallbackConfig) => (successActionProps: AfterActionProps): Promiseable => {
            return callbacks.onGoList();
        },
        afterUpdate: ({callbacks}: CallbackConfig) => (successActionProps: AfterActionProps): Promiseable => {
        },
        afterDelete: ({callbacks}: CallbackConfig) => (successActionProps: AfterActionProps): Promiseable => {
            return callbacks.onGoList();
        }
    },
    successActions: {
        save: ({callbacks}: CallbackConfig) => (successActionProps: AfterActionProps): Promiseable => {
            const {called} = successActionProps;
            if(called == 'onUpdate') {
                return callbacks.afterUpdate(successActionProps);
            }
            return callbacks.afterCreate(successActionProps);
        }
    },
    prompts: {
        save: {
            success: {
                message: `Item saved.`
            },
            error: {
                message: `An error has occured, your item could not be saved right now.`
            }
        },
        saveNew: {
            confirm: {
                message: `Are you sure you want to save this as a new item?`,
                yes: `Save as new`,
                no: `Cancel`
            },
            success: {
                message: `Item saved.`
            },
            error: {
                message: `An error has occured, your item could not be saved right now.`
            }
        },
        delete: {
            confirm: {
                message: `Are you sure you want to delete this item?`,
                yes: `Delete`,
                no: `Cancel`
            },
            success: {
                message: `Item deleted.`
            },
            error: {
                message: `An error has occured, your item could not be deleted right now.`
            }
        },
        go: {
            confirm: {
                showWhen: ({dirty}: {dirty: Boolean}) => dirty,
                title: `Unsaved changes`,
                message: `You have unsaved changes. What would you like to do?`,
                yes: `Discard changes`,
                no: `Keep editing`
            }
        },
        goList: {},
        goNew: {},
        goEdit: {}
    },
    promptDefaults: {
        title: {
            confirm: `Confirm`,
            success: `Success`,
            error: `Error`
        },
        yes: `Okay`,
        asProps: false
    }
};

export function mergeConfig(...mergeConfigs: Array<Object>): Object {
    const superableKeys = fromJS([
        'actions',
        'callbacks',
        'successActions'
    ]);

    var _super = fromJS({});

    return fromJS(mergeConfigs)
        .filter(ii => ii)
        .reduce((config, ii) => {
            return config.mergeWith((prev, next, key) => {
                return !superableKeys.includes(key)
                    ? prev.mergeDeep(next)
                    : prev.mergeWith((prev, next, subKey) => {
                        // keep overrriden versions of callbacks and actions so they can each call super
                        _super = _super.updateIn([key, subKey], List(), ii => ii.push(prev));
                        return next;
                    }, next);
            }, ii);
        }, Map())
        .set('_super', _super)
        .toJS();
}

export function mergeWithBaseConfig(...mergeConfigs: Array<Object>): Object {
    return mergeConfig(baseConfig, ...mergeConfigs);
}

export function promptWithDefaults(configObject: Object, type: string, action: string, editorData: Object): ?Object {
    const config: Map<string, Map<string,*>> = fromJS(configObject);
    const prompt: ?Map<string, *> = config.getIn(['prompts', action, type]);

    if(!prompt || (prompt.has('showWhen') && !prompt.get('showWhen')(editorData))) {
        return null;
    }
    if(!config.has(`promptDefaults`)) {
        return prompt;
    }

    const base: Map<string, *> = config
        .get('promptDefaults')
        .map(ii => ii.get ? ii.get(type) : ii);

    return base
        .merge(prompt)
        .toJS();
}

