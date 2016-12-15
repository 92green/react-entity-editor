/* @flow */

import React from 'react';
import EntityEditorLoader from './EntityEditorLoader';
import EntityEditorHock from './EntityEditorHock';

type EntityEditorItemConfig = {
    fetchComponent?: React.Component<*,*,*>,
    errorComponent?: React.Component<*,*,*>,
    promptComponent?: React.Component<*,*,*>,
    receivedWhen?: (props: Object) => boolean
};

/**
 * @module Components
 */

export default (userConfig: EntityEditorItemConfig = {}): Function => {
    const  {
        fetchComponent,
        errorComponent,
        promptComponent,
        receivedWhen
    } = userConfig;

    return (ComposedComponent): React.Element<any> => {

        function EntityEditorItem(props: Object) {
            return <ComposedComponent {...props} />;
        }

        const withLoader: Function = EntityEditorLoader({
            fetchComponent,
            errorComponent,
            receivedWhen,
            passThroughWhen: (props) => !props.id
        });

        const withHock: Function = EntityEditorHock({
            ...userConfig,
            promptComponent,
            preloadActionIds: (props) => props.id
        });

        return withLoader(withHock(EntityEditorItem));
    }
};
