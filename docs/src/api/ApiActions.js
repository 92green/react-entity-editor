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

import {fromJS} from 'immutable';
import CreateRequestActions from './CreateRequestActions';

export default function ApiActions(apiMethods) {
    return fromJS(apiMethods)
        .map((methodSet, key) => {
            return methodSet
                .map((method, methodName) => CreateRequestActions(
                    `${key}_${methodName}_fetch`,
                    `${key}_${methodName}_receive`,
                    `${key}_${methodName}_error`,
                    method
                ));
        })
        .toJS();
}
