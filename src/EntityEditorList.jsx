/* @flow */

import React from 'react';
import EntityEditorConfig from './config/EntityEditorConfig';
import EntityEditorHock from './EntityEditorHock';

export default (config: EntityEditorConfig): Function => {
    EntityEditorConfig.validate(config);

    return (ComposedComponent): React.Element<any> => {

        function EntityEditorList(props: Object) {
            return <ComposedComponent {...props} />;
        }

        const withHock: Function = EntityEditorHock({
            config
        });

        return withHock(EntityEditorList);
    }
};
