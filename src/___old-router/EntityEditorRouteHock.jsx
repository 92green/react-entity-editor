/* @flow */

import {Component} from 'react';
import {List, fromJS} from 'immutable';
import EntityEditorConfig from '../config/EntityEditorConfig';
import RouterConfigCreator from './RouterConfigCreator';

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

    inferBasePath(routes: Array<any>): string {
        return "/" + fromJS(routes)
            .filter(ii => !!ii.get('path') && ii.get('path') != "/") // remove routes that don't add to the path
            .map(ii => ii.get('path')) // get path for each route
            .takeWhile(path => { // only keep routes not made by entity editor
                return !entityEditorRoutePatterns.some(test => test.test(path));
            })
            .join("/");
    }

    // have one specifically for context?
    // also, how do we let this be defined outside of react?

    getRouteProps(): Object {
        const {
            router,
            routes
        } = this.props;

        const base: string = this.inferBasePath(routes);
        const paths: Function = (id: string) => ({
            base,
            list: base,
            new: `${base}/new`,
            edit: `${base}/${id}/edit`
        });

        return {
            props: {
                paths
            },
            config: RouterConfigCreator({
                router,
                paths
            })
        };
    }
}

export default EntityEditorRouteHock;
