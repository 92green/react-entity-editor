/* @flow */

import {fromJS, Map} from 'immutable';

export const baseConfig = {
    actions: {
        save: ({callbacks}) => (props: {id: string, data: Object}): void => {
            if(!props.data) {
                throw `EntityEditor: config.actions.save: props.data is not defined`;
            }
            return props.id
                ? callbacks.onUpdate(props)
                : callbacks.onCreate(props);
        },
        saveNew: ({callbacks}) => (props: {id: string, data: Object}): void => {
            if(!props.data) {
                throw `EntityEditor: config.actions.saveNew: props.data is not defined`;
            }
            return callbacks.onCreate(props);
        },
        delete: ({callbacks}) => (props: {id: string}): void => {
            if(!props.id) {
                throw `EntityEditor: config.actions.delete: props.id is not defined`;
            }
            return callbacks.onDelete(props);
        },
        dirty: ({callbacks}) => (props: {dirty: Boolean}): void => {
            return callbacks.onDirty({dirty: props.dirty});
        },
        goList: ({callbacks}) => (): void => {
            return callbacks.onGoList();
        },
        goNew: ({callbacks}) => (): void => {
            return callbacks.onGoNew();
        },
        goEdit: ({callbacks}) => (props: {id: string}): void => {
            if(!props.id) {
                throw `EntityEditor: config.actions.saveNew: props.id is not defined`;
            }
            return callbacks.onGoEdit({id: props.id});
        }
    },
    callbacks: {
        onCreate: (props: {data: Object}) => {
            console.warn(`Entity Editor: please define config.callbacks.onCreate({data: Object}) before using it`);
            return false;
        },
        onUpdate: (props: {id: string, data: Object}) => {
            console.warn(`Entity Editor: please define config.callbacks.onUpdate({id: string, data: Object}) before using it`);
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
            showWhen: ({dirty}) => dirty,
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

export function promptWithDefaults(configObject: Object, type: string, action: string, editorData: Object): Object {
    const config: Map<string, Map<string,*>> = fromJS(configObject);
    const prompt: Map<string, *> = config.getIn([`${type}Prompts`, action]);

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

