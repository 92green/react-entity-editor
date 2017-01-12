/**
 * The files in the /api directory are required to make the examples work,
 * but not required for general usage of entity editor
 *
 * FakeApiMethods creates a set of fake XHR requests and database from the ApiSchema provided.
 * Each has the following operations: get, list, create, update, delete
 *
 * ApiActions creates a set of redux actions for each fake XHR request
 * It stores items, lists, fetch (whether a request is currently taking place) and error (if a request has stopped due to an error)
 *
 * ApiReducer (used in the reducers.js file) provides the reducer for the above redux actions
 *
 * ApiSync is a higher order component that will dispatch a redux action on componentWillMount
 * and on any subsequent componentWillReceiveProps whose new props indicate that a new request for data must be made
 * It also provides a set of props to the component it's used on, which include fetch, error, and the item or list that was requested once it exists
 *
 * CreateRequestActions is used by ApiActions to create a set of actions for each request
 * One is fired when information is first requested ("fetch"), one is fired when a response is received ("receive")
 * and one is fired if an error occurs ("error")
 *
 * Select provides some helper functions for getting data out of redux state
 */

import React, {Component, cloneElement} from 'react';
import {connect} from 'react-redux';
import {fromJS} from 'immutable';
import {
    SelectItem,
    SelectList,
    SelectRequestState
} from './Select';

const syncMethods = fromJS({
    get: SelectItem,
    list: SelectList
});

function createSync(action, methodName, type) {
    return (argFunction) => {
        const callArgFunction = (props) => {
            var res = {
                arg: null,
                requested: false
            };
            argFunction(props, aa => {
                res.arg = aa;
                res.requested = true;
            });
            return res;
        };
        return (ComposedComponent) => {
            class ApiSync extends Component {
                componentWillMount() {
                    if(!argFunction) {
                        this.props.dispatch(action());
                        return;
                    }
                    const thisArg = callArgFunction(this.props);
                    if(thisArg.requested) {
                        this.props.dispatch(action(thisArg.arg));
                    }
                }
                componentWillReceiveProps(nextProps: Object) {
                    if(!argFunction) {
                        return;
                    }
                    const thisArg = callArgFunction(this.props);
                    const nextArg = callArgFunction(nextProps);
                    if(nextArg.requested && thisArg.arg != nextArg.arg) {
                        this.props.dispatch(action(nextArg.arg));
                    }
                }
                render() {
                    return <ComposedComponent {...this.props} />;
                }
            }

            const withRedux = connect((state, props) => {
                const syncMethod = syncMethods.get(methodName);
                if(!syncMethod) {
                    return {};
                }
                return {
                    [`${type}_${methodName}`]: syncMethod(state, type, argFunction && callArgFunction(props).arg),
                    ...SelectRequestState(state, type, methodName)
                };
            });

            return withRedux(ApiSync);
        };
    }
}

export default function ApiSync(apiActions) {
    return fromJS(apiActions)
        .map((actionSet, type) => {
            return actionSet
                .filter((action, methodName) => syncMethods.keySeq().includes(methodName))
                .map((action, methodName) => createSync(action, methodName, type));
        })
        .toJS();
}
