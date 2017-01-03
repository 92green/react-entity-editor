/* @flow */

import React, {PropTypes} from 'react';
import {withRouter} from 'react-router';
import EntityEditorRouteHock from './EntityEditorRouteHock';

function EntityEditorRoute(): Function {

    return (ComposedComponent: React.Element<any>) => {

        class EntityEditorRouteWrapper extends EntityEditorRouteHock {
            render() {
                const entityEditorRoutesProps: Object = {
                    ...this.getRouteProps()
                };

                return <ComposedComponent
                    {...this.props}
                    entityEditorRoutes={entityEditorRoutesProps}
                />;
            }
        }

        EntityEditorRouteWrapper.propTypes = {
            routes: PropTypes.array.isRequired,
            params: PropTypes.object.isRequired,
            router: PropTypes.object
        };

        EntityEditorRouteWrapper.childContextTypes = {
            entityEditorRoutes: PropTypes.object
        };

        return withRouter(EntityEditorRouteWrapper);
    };
}

export default EntityEditorRoute;
