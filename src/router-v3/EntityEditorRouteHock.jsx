/* @flow */

import {Component} from 'react';
import {List, fromJS} from 'immutable';
import EntityEditorConfig from '../config/EntityEditorConfig';

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

        const confirmLeave: Object = {
            confirm: {
                showWhen: ({dirty}: {dirty: Boolean}) => dirty,
                title: `Unsaved changes`,
                message: () => <span>You have unsaved changes. What would you like to do?</span>,
                yes: `Discard changes`,
                no: `Keep editing`
            }
        };

        const config: EntityEditorConfig = EntityEditorConfig({
            operations: {
                onGoList: () => () => {
                    router.push(paths().list);
                },
                onGoNew: () => () => {
                    router.push(paths().new);
                },
                onGoEdit: () => (props: {id: string}) => {
                    router.push(paths(props.id).edit);
                }
            },
            actions: {
                goList: ({operations}: ActionConfig) => (actionProps: Object): Promiseable => {
                    return operations
                        .onGoList()
                        .then((result): AfterActionProps => ({result, actionProps, called: 'onGoList'}));
                },
                goNew: ({operations}: ActionConfig) => (actionProps: Object): Promiseable => {
                    return operations
                        .onGoNew()
                        .then((result): AfterActionProps => ({result, actionProps, called: 'onGoNew'}));
                },
                goEdit: ({operations}: ActionConfig) => (actionProps: {id: string}): Promiseable => {
                    if(!actionProps.id) {
                        throw `EntityEditor: config.actions.goEdit: actionProps.id is not defined`;
                    }
                    return operations
                        .onGoEdit({id: actionProps.id})
                        .then((result): AfterActionProps => ({result, actionProps, called: 'onGoEdit'}));
                }
            },
            prompts: {
                goList: confirmLeave,
                goNew: confirmLeave,
                goEdit: confirmLeave
            },
            excludePending: {
                goList: true,
                goNew: true,
                goEdit: true
            }
        });

        return {
            props: {
                paths
            },
            config
        };
    }
}

export default EntityEditorRouteHock;
