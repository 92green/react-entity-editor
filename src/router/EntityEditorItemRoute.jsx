/* @flow */

import React, {PropTypes} from 'react';
import {withRouter} from 'react-router';
import EntityEditorRouteHock from './EntityEditorRouteHock';

function EntityEditorItemRoute(config: Object = {}): Function {
    const {
        paramId = 'id'
    } = config;

    return (ComposedComponent: React.Element<any>) => {

        class EntityEditorRouteItemWrapper extends EntityEditorRouteHock {
            render() {
                const entityEditorRoutesProps: Object = {
                    ...this.getRouteProps(),
                    id: this.props.params[paramId]
                };

                return <ComposedComponent
                    {...this.props}
                    entityEditorRoutes={entityEditorRoutesProps}
                />;
            }
        }

        EntityEditorRouteItemWrapper.propTypes = {
            routes: PropTypes.array.isRequired,
            params: PropTypes.object.isRequired,
            router: PropTypes.object
        };

        EntityEditorRouteItemWrapper.childContextTypes = {
            entityEditorRoutes: PropTypes.object
        };

        return withRouter(EntityEditorRouteItemWrapper);
    };
}

export default EntityEditorItemRoute;
