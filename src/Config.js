/* @flow */

import {fromJS, Map} from 'immutable';

export const baseConfig = {
    actions: {
        save: ({callbacks}) => (props: {id: string, data: Object}): void => {
            console.log('save', props.id, props.data);
        },
        saveNew: ({callbacks}) => (props: {id: string, data: Object}): void => {
            console.log('save new', props.data);
        },
        //savePartial: ({callbacks}) => (id: string,  partialData: Object): void => {
        //    console.log('save partial', partialData);
        //},
        delete: ({callbacks}) => (props: {id: string}): void => {
            callbacks.onDelete(props.id);
        },
        goList: ({callbacks}) => (): void => {
            callbacks.onGoList();
        },
        goNew: ({callbacks}) => (): void => {
            callbacks.onGoNew();
        },
        goEdit: ({callbacks}) => (props: {id: string}): void => {
            callbacks.onGoEdit({id: props.id});
        }
    },
    callbacks: {
        onCreate: () => {
            console.warn(`Entity Editor: please define config.callbacks.onCreate({data: Object}) before using it`);
        },
        onUpdate: () => {
            console.warn(`Entity Editor: please define config.callbacks.onUpdate({id: string, data: Object}) before using it`);
        },
        onDelete: () => {
            console.warn(`Entity Editor: please define config.callbacks.onDelete({id: string}) before using it`);
        },
        onGoList: () => {
            console.warn(`Entity Editor: please define config.callbacks.onGoList() before using it`);
        },
        onGoNew: () => {
            console.warn(`Entity Editor: please define config.callbacks.onGoNew() before using it`);
        },
        onGoEdit: () => {
            console.warn(`Entity Editor: please define config.callbacks.onGoEdit({id: string}) before using it`);
        }
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

export function getConfigAsProps(config: Object, options: {preloadActionIds: string}): Object {
    const {preloadActionIds} = options || {};
    const actions: Object = fromJS(config)
        .get('actions', Map())
        .map((fn: Function) => (props: Object) => {
            if(preloadActionIds) {
                props.id = preloadActionIds;
            }
            return fn(config)(props);
        })
        .toJS();

    return {
        actions
    }
}
