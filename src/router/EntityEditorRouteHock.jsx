/* @flow */

import {Component} from 'react';
import {List, fromJS} from 'immutable';

const entityEditorRoutePatterns: List<RegExp> = List.of(
    /^new$/,
    /\/edit$/
);

class EntityEditorRouteHock extends Component {

    onLeaveHook: Function;
    leaveHookSet: boolean;

    constructor(props: Object) {
        super(props);
        this.leaveHookSet = false;
    }

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
                ...this.getRouteProps(),
                onLeaveHook: this.onLeaveHook
            }
        };
    }

    getBasePath(routes: Array<any>): string {
        return "/" + fromJS(routes)
            .filter(ii => !!ii.get('path') && ii.get('path') != "/") // remove routes that don't add to the path
            .map(ii => ii.get('path')) // get path for each route
            .takeWhile(path => { // only keep routes not made by entity editor
                return !entityEditorRoutePatterns.some(test => test.test(path));
            })
            .join("/");
    }

    getRouteProps(): Object {
        const {
            router,
            routes
        } = this.props;

        const base: string = this.getBasePath(routes);
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
}

export default EntityEditorRouteHock;
