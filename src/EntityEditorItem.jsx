/* @flow */

import React from 'react';
import EntityEditorLoader from './EntityEditorLoader';
import EntityEditorHock from './EntityEditorHock';

export default (userConfig = {}): Function => {
    return (ComposedComponent): React.Element<any> => {

        function EntityEditorItem(props: Object) {
            return <ComposedComponent {...props} />;
        }

        const withLoader: Function = EntityEditorLoader("get", {
            ...userConfig,
            loader: {
                passThroughWhen: (props) => !props.id
            }
        });

        const withHock: Function = EntityEditorHock({
            ...userConfig,
            preloadActionIds: (props) => props.id
        });

        return withHock(withLoader(EntityEditorItem));
    }
};
