/* @flow */

import {fromJS, Map} from 'immutable';

export const baseConfig = {
    actions: {
        save: ({callbacks}: {callbacks: Object}) => (actionProps: {id: string, payload: Object}): void => {
            if(!actionProps.payload) {
                throw `EntityEditor: config.actions.save: actionProps.payload is not defined`;
            }
            return actionProps.id
                ? callbacks.onUpdate(actionProps)
                : callbacks.onCreate(actionProps);
        },
        saveNew: ({callbacks} : {callbacks: Object}) => (actionProps: {id: string, payload: Object}): void => {
            if(!actionProps.payload) {
                throw `EntityEditor: config.actions.saveNew: actionProps.payload is not defined`;
            }
            return callbacks.onCreate(actionProps);
        },
        delete: ({callbacks} : {callbacks: Object}) => (actionProps: {id: string}): void => {
            if(!actionProps.id) {
                throw `EntityEditor: config.actions.delete: actionProps.id is not defined`;
            }
            return callbacks.onDelete(actionProps);
        },
        dirty: ({callbacks} : {callbacks: Object}) => (actionProps: {dirty: Boolean}): void => {
            return callbacks.onDirty({dirty: actionProps.dirty});
        },
        goList: ({callbacks} : {callbacks: Object}) => (): void => {
            return callbacks.onGoList();
        },
        goNew: ({callbacks} : {callbacks: Object}) => (): void => {
            return callbacks.onGoNew();
        },
        goEdit: ({callbacks} : {callbacks: Object}) => (actionProps: {id: string}): void => {
            if(!actionProps.id) {
                throw `EntityEditor: config.actions.saveNew: actionProps.id is not defined`;
            }
            return callbacks.onGoEdit({id: actionProps.id});
        }
    },
    callbacks: {
        onCreate: (props: {payload: Object}) => {
            console.warn(`Entity Editor: please define config.callbacks.onCreate({payload: Object}) before using it`);
            return false;
        },
        onUpdate: (props: {id: string, payload: Object}) => {
            console.warn(`Entity Editor: please define config.callbacks.onUpdate({id: string, payload: Object}) before using it`);
            return false;
        },
        onDelete: (props: {id: string}) => {
            console.warn(`Entity Editor: please define config.callbacks.onDelete({id: string}) before using it`);
            return false;
        },
        onGoList: () => {
            console.warn(`Entity Editor: please define config.callbacks.onGoList() before using it`);
            return false;
        },
        onGoNew: () => {
            console.warn(`Entity Editor: please define config.callbacks.onGoNew() before using it`);
            return false;
        },
        onGoEdit: (props: {id: string}) => {
            console.warn(`Entity Editor: please define config.callbacks.onGoEdit({id: string}) before using it`);
            return false;
        },
        onDirty: null // onDirty is a special callback that is added by EntityEditorHock. Do not override it unless you like strife.
    },
    confirmPrompts: {
        saveNew: {
            message: `Are you sure you want to save a new copy of this item?`,
            yes: `Save as new`,
            no: `Cancel`
        },
        delete: {
            message: `Are you sure you want to delete this item?`,
            yes: `Delete`,
            no: `Cancel`
        },
        go: {
            showWhen: ({dirty}: {dirty: Boolean}) => dirty,
            title: `Unsaved changes`,
            message: `You have unsaved changes. What would you like to do?`,
            yes: `Discard changes`,
            no: `Keep editing`
        }
    },
    successPrompts: {
        save: {
            message: `Item saved.`
        },
        saveNew: {
            message: `Item saved.`
        },
        delete: {
            message: `Item deleted.`
        }
    },
    errorPrompts: {
        save: {
            message: `An error has occured, your item could not be saved right now.`
        },
        saveNew: {
            message: `An error has occured, your item could not be saved right now.`
        },
        delete: {
            message: `An error has occured, your item could not be deleted right now.`
        }
    },
    promptDefaults: {
        title: {
            confirm: `Confirm`,
            success: `Success`,
            error: `Error`
        },
        yes: `Okay`
    }
};

export function mergeConfig(...mergeConfigs: Array<Object>): Object {
    return fromJS(mergeConfigs)
        .filter(ii => ii)
        .reduce((config, ii) => {
            return config.mergeDeep(ii);
        }, Map())
        .toJS();
}

export function mergeWithBaseConfig(...mergeConfigs: Array<Object>): Object {
    return mergeConfig(baseConfig, ...mergeConfigs);
}

export function promptWithDefaults(configObject: Object, type: string, action: string, editorData: Object): ?Object {
    const config: Map<string, Map<string,*>> = fromJS(configObject);
    const prompt: ?Map<string, *> = config.getIn([`${type}Prompts`, action]);

    if(!prompt || (prompt.has('showWhen') && !prompt.get('showWhen')(editorData))) {
        return null;
    }
    if(!config.has(`promptDefaults`)) {
        return prompt;
    }

    const base: Map<string, *> = config
        .get('promptDefaults')
        .map(ii => typeof ii == "string" ? ii : ii.get(type));

    return base
        .merge(prompt)
        .toJS();
}

