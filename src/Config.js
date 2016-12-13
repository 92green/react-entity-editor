/* @flow */

import {fromJS, Map} from 'immutable';

type Config = {
    actions: Object,
    callbacks: Object,
    confirmPrompts: Object,
    successPrompts: Object,
    errorPrompts: Object,
    promptDefaults: Object
};

type ActionConfig = {
    actions: Object,
    callbacks: Object
};

type CallbackConfig = {
    callbacks: Object,
    setEditorState: Object
};

type PromiseOrBoolean = Promise<*>|boolean;

export const baseConfig: Config = {
    actions: {
        save: ({callbacks}: ActionConfig) => (actionProps: {id: ?string, payload: Object}): PromiseOrBoolean => {
            if(!actionProps.payload) {
                throw `EntityEditor: config.actions.save: actionProps.payload is not defined`;
            }

            if(actionProps.id) {
                return callbacks.onUpdate(actionProps);
            }
            return callbacks.onCreate(actionProps);
        },
        saveNew: ({callbacks}: ActionConfig) => (actionProps: {id: ?string, payload: Object}): PromiseOrBoolean => {
            if(!actionProps.payload) {
                throw `EntityEditor: config.actions.saveNew: actionProps.payload is not defined`;
            }
            return callbacks.onCreate(actionProps);
        },
        delete: ({callbacks}: ActionConfig) => (actionProps: {id: string}): PromiseOrBoolean => {
            if(!actionProps.id) {
                throw `EntityEditor: config.actions.delete: actionProps.id is not defined`;
            }
            return callbacks.onDelete(actionProps);
        },
        dirty: ({callbacks}: ActionConfig) => (actionProps: {dirty: Boolean}): PromiseOrBoolean => {
            return callbacks.onDirty({dirty: actionProps.dirty});
        },
        goList: ({callbacks}: ActionConfig) => (): PromiseOrBoolean => {
            return callbacks.onGoList();
        },
        goNew: ({callbacks}: ActionConfig) => (): PromiseOrBoolean => {
            return callbacks.onGoNew();
        },
        goEdit: ({callbacks}: ActionConfig) => (actionProps: {id: string}): PromiseOrBoolean => {
            if(!actionProps.id) {
                throw `EntityEditor: config.actions.saveNew: actionProps.id is not defined`;
            }
            return callbacks.onGoEdit({id: actionProps.id});
        }
    },
    callbacks: {
        onCreate: (config: CallbackConfig) => (callbackProps: {payload: Object}): PromiseOrBoolean => {
            console.warn(`Entity Editor: please define config.callbacks.onCreate({payload: Object}) before using it`);
            return false;
        },
        onUpdate: (config: CallbackConfig) => (callbackProps: {id: string, payload: Object}): PromiseOrBoolean => {
            console.warn(`Entity Editor: please define config.callbacks.onUpdate({id: string, payload: Object}) before using it`);
            return false;
        },
        onDelete: (config: CallbackConfig) => (callbackProps: {id: string}): PromiseOrBoolean => {
            console.warn(`Entity Editor: please define config.callbacks.onDelete({id: string}) before using it`);
            return false;
        },
        onGoList: (config: CallbackConfig) => (): PromiseOrBoolean => {
            console.warn(`Entity Editor: please define config.callbacks.onGoList() before using it`);
            return false;
        },
        onGoNew: (config: CallbackConfig) => (): PromiseOrBoolean => {
            console.warn(`Entity Editor: please define config.callbacks.onGoNew() before using it`);
            return false;
        },
        onGoEdit: (config: CallbackConfig) => (callbackProps: {id: string}): PromiseOrBoolean => {
            console.warn(`Entity Editor: please define config.callbacks.onGoEdit({id: string}) before using it`);
            return false;
        },
        onDirty: ({setEditorState}: CallbackConfig) => (callbackProps: {dirty: boolean}): PromiseOrBoolean => {
            setEditorState.dirty(callbackProps.dirty);
        },
        afterCreate: ({callbacks}: CallbackConfig) => (callbackProps: {payload: Object}): PromiseOrBoolean => {
            callbacks.onGoList();
        },
        afterUpdate: () => (callbackProps: {payload: Object}): PromiseOrBoolean => {
        },
        afterDelete: ({callbacks}: CallbackConfig) => (callbackProps: {payload: Object}): PromiseOrBoolean => {
            callbacks.onGoList();
        }
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
        yes: `Okay`,
        asProps: false
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
        .map(ii => ii.get ? ii.get(type) : ii);

    return base
        .merge(prompt)
        .toJS();
}

