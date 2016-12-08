/* @flow */

import React, {Component} from 'react';
import EntityEditorLoader from './EntityEditorLoader';
import EntityEditorHock from './EntityEditorHock';

export default (userConfig: Object = {}): HockApplier => {
    const  {
        fetchComponent,
        errorComponent,
        promptComponent,
        receivedWhen = (props) => !!props.list
    } = userConfig;

    return (ComposedComponent: ReactClass<any>): ReactClass<any> => {

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

        return withLoader(withHock(EntityEditorList));
    }
};
