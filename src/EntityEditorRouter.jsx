/* @flow */

import React, {Component, PropTypes} from 'react';
import {Route, IndexRoute, withRouter} from 'react-router';
import {List, fromJS} from 'immutable';

type Params = {
    itemComponent: ?ReactClass<any>,
    listComponent: ?ReactClass<any>,
    paramId: ?string
};

const entityEditorRoutePatterns: List<RegExp> = List.of(
    /^new$/,
    /\/edit$/
);

export function createEditorRoutes(params: Params): ReactClass<Route> {
    const {
        itemComponent,
        listComponent,
        paramId = 'id'
    } = params;

    return <Route>
        {listComponent && <IndexRoute component={wrapListComponent()(listComponent)} />}
        {itemComponent && <Route path="new" component={wrapItemComponent({paramId})(itemComponent)} />}
        {itemComponent && <Route path={`:${paramId}/edit`} component={wrapItemComponent({paramId})(itemComponent)} />}
    </Route>;
}

function getBasePath(routes: Array<any>): string {
    return "/" + fromJS(routes)
        .filter(ii => !!ii.get('path') && ii.get('path') != "/") // remove routes that don't add to the path
        .map(ii => ii.get('path')) // get path for each route
        .takeWhile(path => { // only keep routes not made by entity editor
            return !entityEditorRoutePatterns.some(test => test.test(path));
        })
        .join("/");
}

function getRouteProps(props: Object): Object {
    const {
        router,
        routes
    } = props;

    const base: string = getBasePath(routes);
    const paths: Function = (id: string) => ({
        base,
        list: base,
        new: `${base}/new`,
        edit: `${base}/${id}/edit`
    });

    const callbacks: Object = {
        onGoList: () => () => {
            router.push(paths().list);
        },
        onGoNew: () => () => {
            router.push(paths().new);
        },
        onGoEdit: () => (props: {id: string}) => {
            router.push(paths(props.id).edit);
        }
    };

    return {
        paths,
        callbacks
    };
}

class EntityEditorWrapper extends Component {

    onLeaveHook: Function;
    leaveHookSet: boolean = false;

    componentWillMount() {
        this.onLeaveHook = (callback) => {
            if(this.leaveHookSet) {
                return;
            }
            this.props.router.setRouteLeaveHook(this.props.route, callback);
            this.leaveHookSet = true;
        };
    }

    getChildContext() {
        return {
            entityEditorRoutes: {
                ...getRouteProps(this.props),
                onLeaveHook: this.onLeaveHook
            }
        };
    }
}

export function wrapItemComponent(config: Object = {}): HockApplier {
    const {
        paramId = 'id'
    } = config;

    return (ComposedComponent: ReactClass<any>): ReactClass<any> => {

        class EntityEditorItemWrapper extends EntityEditorWrapper {
            render() {
                const entityEditorRoutesProps: Object = {
                    ...getRouteProps(this.props),
                    id: this.props.params[paramId]
                };

                return <ComposedComponent
                    {...this.props}
                    entityEditorRoutes={entityEditorRoutesProps}
                />;
            }
        }

        EntityEditorItemWrapper.propTypes = {
            routes: PropTypes.array.isRequired,
            params: PropTypes.object.isRequired,
            router: PropTypes.object
        };

        EntityEditorItemWrapper.childContextTypes = {
            entityEditorRoutes: PropTypes.object
        };

        return withRouter(EntityEditorItemWrapper);
    };
}

export function wrapListComponent(config: Object = {}): HockApplier {

    return (ComposedComponent: ReactClass<any>): ReactClass<any> => {

        class EntityEditorListWrapper extends EntityEditorWrapper {
            render() {
                const entityEditorRoutesProps: Object = {
                    ...getRouteProps(this.props)
                };

                return <ComposedComponent
                    {...this.props}
                    entityEditorRoutes={entityEditorRoutesProps}
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
