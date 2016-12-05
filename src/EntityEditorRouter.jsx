/* @flow */

import React, {Component, PropTypes} from 'react';
import {Route, IndexRoute, withRouter} from 'react-router';
import {List, fromJS} from 'immutable';

type Params = {
    itemComponent: ReactClass<any>,
    listComponent: ReactClass<any>,
    paramId: string
};

const routePatterns: List<RegExp> = List.of(
    /^new$/,
    /\/edit$/
);

export function createEditorRoutes(params: Params): ReactClass<Route> {
    const {
        itemComponent,
        listComponent,
        paramId = 'id'
    } = params;

    if(!itemComponent) {
        throw `EntityEditorRouteer.createEditorRoutes() must be passed an object with an itemComponent property, which should be a React components to be rendered when editing an item`;
    }

    return <Route>
        {listComponent && <IndexRoute component={wrapListComponent()(listComponent)} />}
        <Route path="new" component={wrapItemComponent()(itemComponent)} />
        <Route path={`:${paramId}/edit`} component={wrapItemComponent()(itemComponent)} />
    </Route>;
}




/*
function ItemComponentWrapper(paramId: string): ReactClass<any> {

    class EntityEditorItemWrapper extends Component {

        componentWillMount() {
            this.onLeaveHook = (callback) => {
                this.props.router.setRouteLeaveHook(this.props.route, callback);
            };
        }

        onClose() {
            this.props.router.push(this.getEditorRoute('close'));
        }

        onGotoEdit(id = false) {
            this.props.router.push(this.getEditorRoute('edit', id));
        }

        render() {
            const propsToAddToChildren: Object = {
                id: this.props.params[paramId],
                onClose: this.onClose.bind(this),
                onLeaveHook: this.onLeaveHook,
                onGotoEdit: this.onGotoEdit.bind(this),
                getEditorRoute: this.getEditorRoute.bind(this)
            };

            const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, propsToAddToChildren));
            return <div>{childrenWithProps}</div>;
        }
}*/

function getBasePath(routes: Array<any>): string {
    return "/" + fromJS(routes)
        .filter(ii => !!ii.get('path') && ii.get('path') != "/") // remove routes that don't add to the path
        .map(ii => ii.get('path')) // get path for each route
        .takeWhile(path => { // only keep routes not made by entity editor
            return !routePatterns.some(test => test.test(path));
        })
        .join("/");
}

function getRouteProps(routes: Array<any>): Object {
    const base: string = getBasePath(routes);
    return {
        paths: (id: string) => ({
            base,
            new: `${base}/new`,
            edit: `${base}/${id}/edit`
        })
    };
}

function wrapItemComponent(config: ?Object = null): HockApplier {

    return (ComposedComponent: ReactClass<any>): ReactClass<any> => {

        class EntityEditorItemWrapper extends Component {

            /*
            componentWillMount() {
                this.onLeaveHook = (callback) => {
                    this.props.router.setRouteLeaveHook(this.props.route, callback);
                };
            }
            */

            getChildContext() {
                return {
                    entityEditorRoutes: getRouteProps(this.props.routes)
                };
            }

            render() {
                return <ComposedComponent
                    {...this.props}
                    entityEditorRoutes={getRouteProps(this.props.routes)}
                />;
            }
        }

        EntityEditorItemWrapper.propTypes = {
            routes: PropTypes.array.isRequired,
            params: PropTypes.object.isRequired,
            router: PropTypes.object
        };

        return withRouter(EntityEditorItemWrapper);
    };
}

function wrapListComponent(config: ?Object = null): HockApplier {

    return (ComposedComponent: ReactClass<any>): ReactClass<any> => {

        class EntityEditorListWrapper extends Component {

            getChildContext() {
                return {
                    entityEditorRoutes: getRouteProps(this.props.routes)
                };
            }

            render() {
                return <ComposedComponent
                    {...this.props}
                    entityEditorRoutes={getRouteProps(this.props.routes)}
                />;
            }
        }

        EntityEditorListWrapper.propTypes = {
            routes: PropTypes.array.isRequired,
            params: PropTypes.object.isRequired,
            router: PropTypes.object
        };

        EntityEditorListWrapper.childContextTypes = {
            entityEditorRoutes: PropTypes.object
        };

        return withRouter(EntityEditorListWrapper);
    };
}
