/* @flow */

import React, {PropTypes} from 'react';
import {withRouter} from 'react-router';
import EntityEditorRouteHock from './EntityEditorRouteHock';

function EntityEditorItemRoute(config: Object = {}): Function {
    const {
        paramName = 'id'
    } = config;

    return (ComposedComponent: React.Element<any>) => {

        class EntityEditorRouteItemWrapper extends EntityEditorRouteHock {

            getChildContext() {
                return {
                    entityEditorRoutes: {
                        ...this.getRouteProps(),
                        onLeaveHook: this.onLeaveHook
                    }
                };
            }

            render() {
                const entityEditorRoutesProps: Object = {
                    ...this.getRouteProps(),
                    id: this.props.params[paramName]
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
