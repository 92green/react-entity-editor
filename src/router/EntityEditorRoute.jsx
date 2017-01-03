/* @flow */

import React, {PropTypes} from 'react';
import {withRouter} from 'react-router';
import EntityEditorRouteHock from './EntityEditorRouteHock';

function EntityEditorRoute(config: Object = {}): Function {
    const {
        basePath
    } = config;

    const routePropOptions = {
        basePath
    };

    return (ComposedComponent: React.Element<any>) => {

        class EntityEditorRouteWrapper extends EntityEditorRouteHock {

            getChildContext() {
                return {
                    entityEditorRoutes: {
                        ...this.getRouteProps(routePropOptions),
                        onLeaveHook: this.onLeaveHook
                    }
                };
            }

            render() {
                const entityEditorRoutesProps: Object = {
                    ...this.getRouteProps(routePropOptions)
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
