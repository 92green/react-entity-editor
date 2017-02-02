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

import CreateFakeApiMethods from './FakeApiMethods';
import CreateApiActions from './ApiActions';
import CreateApiSync from './ApiSync';

export const ApiSchema = {
    dogs: 'dogs',
    sloths: 'sloths',
    dodos: 'dodos'
};

const initialData = {
    dogs: [
        {id: "1", name: "Charlie", toy: "Ball"}
    ],
    sloths: [
        {id: "1", name: "Steven", speed: "0.0002"}
    ],
    dodos: [
        {id: "1", name: "Wilbur", deadness: "Significant"}
    ]
};

export const ApiMethods = CreateFakeApiMethods(ApiSchema, initialData, {log: true});
export const ApiActions = CreateApiActions(ApiMethods);
export const ApiSync = CreateApiSync(ApiActions);

export const SlowApiMethods = CreateFakeApiMethods(ApiSchema, initialData, {log: true, delay: 1500});
export const SlowApiActions = CreateApiActions(SlowApiMethods);
export const SlowApiSync = CreateApiSync(SlowApiActions);

export const FaultyApiMethods = CreateFakeApiMethods(ApiSchema, initialData, {log: true, faulty: true});
export const FaultyApiActions = CreateApiActions(FaultyApiMethods);
export const FaultyApiSync = CreateApiSync(FaultyApiActions);
