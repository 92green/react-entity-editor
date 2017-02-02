/* @flow */

import React from 'react';
import EntityEditorLoader from './EntityEditorLoader';
import EntityEditorHock from './EntityEditorHock';

export default (userConfig = {}): Function => {
    return (ComposedComponent): React.Element<any> => {

        function EntityEditorList(props: Object) {
            return <ComposedComponent {...props} />;
        }

        const withLoader: Function = EntityEditorLoader("list", userConfig);
        const withHock: Function = EntityEditorHock(userConfig);
        return withLoader(withHock(EntityEditorList));
    }
};
