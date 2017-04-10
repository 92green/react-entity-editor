/* @flow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

import {fromJS, List, Map} from 'immutable';
import {returnPromise} from '../Utils';

class EntityEditorConfig {

    _config: Map<string, any>;

    constructor(config: Object) {
        this._config = fromJS(config);
    }

    static isEntityEditorConfig(obj: any): boolean {
        return typeof obj == "object" && obj instanceof EntityEditorConfig;
    }

    static validate(obj: any) {
        if(!EntityEditorConfig.isEntityEditorConfig(obj)) {
            throw new Error(`Expected object of type EntityEditorConfig, got ${obj}`);
        }
    }

    static superableKeys(): Array<string> {
        return [
            'actions',
            'operations',
            'successActions'
        ];
    }

    get(key: string, notSetValue: any): any {
        return this._config.get(key, notSetValue);
    }

    getIn(searchKeyPath: Array<string>, notSetValue: any): any {
        return this._config.getIn(searchKeyPath, notSetValue);
    }

    merge(nextConfig: Object|EntityEditorConfig): EntityEditorConfig {
        const toMerge: Map<string, any> = EntityEditorConfig.isEntityEditorConfig(nextConfig)
            ? nextConfig._config
            : fromJS(nextConfig);

        const superableKeys: List<string> = List(EntityEditorConfig.superableKeys());
        //var _super: Map<string, any> = Map();

        // merge configs together
        const merged: Object = this._config
            .mergeWith((prev, next, key) => {
                //if(!superableKeys.includes(key)) {
                    return prev.mergeDeep(next);
                //}
                //return prev.mergeWith((prev, next, subKey) => {
                    // keep overridden versions of operations and actions so they can each call super
                //    _super = _super.updateIn([key, subKey], List(), ii => ii.push(prev));
                //     return next;
                //}, next);
            }, toMerge)
            //.set('_super', _super)
            .toJS();

        return new EntityEditorConfig(merged);
    }

    data(): Map<string, any> {
        return this._config;
    }

    prompt(action: string, type: string, editorData: Object = {}): ?Object {
        const prompt: ?Map<string, *> = this._config.getIn(['prompts', action, type]);

        if(!prompt || (prompt.has('showWhen') && !prompt.get('showWhen')(editorData))) {
            return null;
        }

        if(!this._config.has('promptDefaults')) {
            return prompt;
        }

        const base: Map<string, *> = this._config
            .get('promptDefaults')
            .map(ii => ii.get ? ii.get(type) : ii);

        return base
            .merge(prompt)
            .set('item', this.itemNames())
            .set('type', type)
            .toJS();
    }

    itemNames(): Object {
        const ucfirst: Function = (str) => str.charAt(0).toUpperCase() + str.slice(1);
        const item: string = this._config.getIn(['item', 'single'], 'item');
        const items: string = this._config.getIn(['item', 'plural'], `${item}s`);
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
EntityEditorConfigFactory.superableKeys = EntityEditorConfig.superableKeys;

export default EntityEditorConfigFactory;

export {
    EntityEditorConfig
};

