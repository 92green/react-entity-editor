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

import {fromJS, Map, List} from 'immutable';

const initialState = fromJS({
    items: Map(),
    list: List(),
    fetch: Map(),
    error: Map()
});

function getId(item) {
    return item.get('id').toString();
}

function setItem(items, item) {
    const id = getId(item);
    return items.set(id, item.set('id', id));
}

function createReducer(path, reducerType) {
    return (state = initialState, {type, payload}) => {
        const [
            entityType,
            method,
            subAction
        ] = type.split('_');

        if(entityType != reducerType) {
            return state;
        }

        if(subAction == 'fetch') {
            return state
                .setIn(['fetch', method], true);
        }

        if(subAction == 'error') {
            const {status, message} = payload;
            return state
                .setIn(['fetch', method], false)
                .setIn(['error', method], fromJS({status, message}));
        }

        if(subAction == 'receive') {
            const receivedState = state
                .setIn(['fetch', method], false)
                .setIn(['error', method], null);

            if(method == 'get') {
                return receivedState
                    .update('items', items => setItem(items, fromJS(payload)));
            }
            if(method == 'list') {
                const list = fromJS(payload);
                return receivedState
                    .update('items', items => {
                        return list.reduce((items, item) => {
                            return setItem(items, item);
                        }, items);
                    })
                    .set('list', list.map(ii => getId(ii)));
            }
            if(method == 'create' || method == 'update') {
                return receivedState
                    .update('items', items => setItem(items, fromJS(payload)));
            }
            if(method == 'delete') {
                const {id} = payload;
                return receivedState
                    .deleteIn(['items', id])
                    .update('list', list => list.filter(ii => ii != id));
            }
            return receivedState;
        }
        return state;
    };
};

export default function ApiReducer(apiSchema) {
    return fromJS(apiSchema)
        .map(createReducer)
        .toJS();
}
