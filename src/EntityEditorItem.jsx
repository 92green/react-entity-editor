/* @flow */

import React from 'react';
import EntityEditorConfig from './config/EntityEditorConfig';
import EntityEditorHock from './EntityEditorHock';

export default (config: EntityEditorConfig): Function => {
    EntityEditorConfig.validate(config);

    return (ComposedComponent): React.Element<any> => {

        function EntityEditorItem(props: Object) {
            return <ComposedComponent {...props} />;
        }

        const withHock: Function = EntityEditorHock({
            config,
            preloadActionIds: (props) => props.id
        });

        return withHock(EntityEditorItem);
    }
};
