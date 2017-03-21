/* @flow */

import React from 'react';
import EntityEditorConfig from './config/EntityEditorConfig';
import EntityEditorLoader from './EntityEditorLoader';
import EntityEditorHock from './EntityEditorHock';

export default (config: EntityEditorConfig): Function => {
    EntityEditorConfig.validate(config);

    return (ComposedComponent): React.Element<any> => {

        function EntityEditorList(props: Object) {
            return <ComposedComponent {...props} />;
        }

        const withLoader: Function = EntityEditorLoader({
            config,
            actionName: "list"
        });

        const withHock: Function = EntityEditorHock({
            config
        });

        return withLoader(withHock(EntityEditorList));
    }
};
