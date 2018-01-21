/* @flow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

import assignWith from 'lodash/assignWith';
import get from 'lodash/get';
import isObject from 'lodash/isObject';

class EntityEditorConfig {

    _config: Object;

    constructor(config: Object) {
        this._config = config;
    }

    static isEntityEditorConfig(obj: any): boolean {
        return typeof obj == "object" && obj instanceof EntityEditorConfig;
    }

    static validate(obj: any) {
        if(!EntityEditorConfig.isEntityEditorConfig(obj)) {
            throw new Error(`Expected object of type EntityEditorConfig, got ${obj}`);
        }
    }

    get(key: string, notSetValue: any): any {
        return get(this._config, key, notSetValue);
    }


    getIn(searchKeyPath: Array<string>, notSetValue: any): any {
        return get(this._config, searchKeyPath, notSetValue);
    }

    merge(nextConfig: Object|EntityEditorConfig|Function): EntityEditorConfig {
        if(typeof nextConfig == "function") {
            nextConfig = nextConfig(this);
        }

        const toMerge: Object = EntityEditorConfig.isEntityEditorConfig(nextConfig)
            ? nextConfig._config
            : nextConfig;

        // merge configs together
        // only merge plain objects, and not workflow
        const mergeFunction: Function = (oldVal: *, newVal: *, key: *): * => {
            const doMerge: boolean = isObject(oldVal)
                && isObject(newVal)
                && key !== "workflow";

            return doMerge ? assignWith(oldVal, newVal, mergeFunction) : newVal;
        };

        const merged: Object = assignWith(this._config, toMerge, mergeFunction);
        return new EntityEditorConfig(merged);
    }

    data(): Object {
        return this._config;
    }

    itemNames(): Object {
        const ucfirst: Function = (str) => str.charAt(0).toUpperCase() + str.slice(1);
        const item: string = get(this._config, ['item', 'single'], 'item');
        const items: string = get(this._config, ['item', 'plural'], `${item}s`);
        return {
            item,
            items,
            Item: ucfirst(item),
            Items: ucfirst(items)
        };
    }
}

function EntityEditorConfigFactory(config: Object|EntityEditorConfig): EntityEditorConfig {
    if(EntityEditorConfig.isEntityEditorConfig(config)) {
        return config;
    }
    return new EntityEditorConfig(config);
}

// add static methods to factory
EntityEditorConfigFactory.isEntityEditorConfig = EntityEditorConfig.isEntityEditorConfig;
EntityEditorConfigFactory.validate = EntityEditorConfig.validate;

export default EntityEditorConfigFactory;

export {
    EntityEditorConfig
};

