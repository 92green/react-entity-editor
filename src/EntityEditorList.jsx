/* @flow */

import React from 'react';
import EntityEditorLoader from './EntityEditorLoader';
import EntityEditorHock from './EntityEditorHock';

type EntityEditorListConfig = {
    fetchComponent?: React.Component<*,*,*>,
    errorComponent?: React.Component<*,*,*>,
    promptComponent?: React.Component<*,*,*>,
    receivedWhen?: (props: Object) => boolean
};

/**
 * @module Components
 */

export default (userConfig: EntityEditorListConfig = {}): Function => {
    const  {
        fetchComponent,
        errorComponent,
        promptComponent,
        receivedWhen
    } = userConfig;

    return (ComposedComponent): React.Element<any> => {

        function EntityEditorList(props: Object) {
            return <ComposedComponent {...props} />;
        }

        const withLoader: Function = EntityEditorLoader({
            fetchComponent,
            errorComponent,
            receivedWhen
        });

        const withHock: Function = EntityEditorHock({
            ...userConfig,
            promptComponent
        });

        return withHock(withLoader(EntityEditorList));
    }
};
