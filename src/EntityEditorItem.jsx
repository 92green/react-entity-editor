/* @flow */

import React from 'react';
import EntityEditorConfig from './config/EntityEditorConfig';
import EntityEditorLoader from './EntityEditorLoader';
import EntityEditorHock from './EntityEditorHock';

export default (config: EntityEditorConfig): Function => {
    EntityEditorConfig.validate(config);

    return (ComposedComponent): React.Element<any> => {

        function EntityEditorItem(props: Object) {
            return <ComposedComponent {...props} />;
        }

        const withLoader: Function = EntityEditorLoader({
            config,
            passThroughWhen: (props) => !props.id
        });

        const withHock: Function = EntityEditorHock({
            config,
            preloadActionIds: (props) => props.id
        });

        return withHock(withLoader(EntityEditorItem));
    }
};
