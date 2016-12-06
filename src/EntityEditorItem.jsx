/* @flow */

import React, {Component, PropTypes} from 'react';
import EntityEditorLoader from './EntityEditorLoader';
import {
    mergeWithBaseConfig,
    getConfigAsProps
} from './Config';

export default (userConfig: Object = {}): HockApplier => {
    const  {
        fetchComponent,
        errorComponent,
        receivedWhen = (props) => !!props.item
    } = userConfig;

    return (ComposedComponent: ReactClass<any>): ReactClass<any> => {

        class EntityEditorItem extends Component {

            render() {
                const config: Object = mergeWithBaseConfig(this.context.entityEditorRoutes, userConfig);
                const preloadActionIds: string = this.props.id;
                const entityEditorProps: Object = {
                    ...getConfigAsProps(config, {preloadActionIds})
                };

                return <ComposedComponent
                    {...this.props}
                    entityEditor={entityEditorProps}
                    entityEditorRoutes={this.context.entityEditorRoutes}
                />;
            }
        }

        EntityEditorItem.contextTypes = {
            entityEditorRoutes: PropTypes.object
        };

        return EntityEditorLoader({
            fetchComponent,
            errorComponent,
            receivedWhen,
            passThroughWhen: (props) => !props.id
        })(EntityEditorItem);
    }
};
