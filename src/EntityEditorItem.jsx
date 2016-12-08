/* @flow */

import React, {Component} from 'react';
import EntityEditorLoader from './EntityEditorLoader';
import EntityEditorHock from './EntityEditorHock';


export default (userConfig: Object = {}): HockApplier => {
    const  {
        fetchComponent,
        errorComponent,
        promptComponent,
        receivedWhen = (props) => !!props.item
    } = userConfig;

    return (ComposedComponent: ReactClass<any>): ReactClass<any> => {

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
