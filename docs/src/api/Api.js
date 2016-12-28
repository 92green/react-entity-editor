/**
 * The files in the /api directory are required to make the examples work,
 * but not required for general usage of entity editor
 *
 * FakeApiMethods creates a set of fake XHR requests and database from the ApiSchema provided.
 * Each has the following operations: get, list, create, update, delete
 *
 * ApiActions creates a set of redux actions for each fake XHR request
 *
 * ApiReducer (used in the reducers.js file) provides the reducer for the above redux actions
 *
 * ApiSync is a higher order component that will dispatch a redux action on componentWillMount
 * and on any subsequent componentWillReceiveProps whose new props indicate
 * that a new reuest for data must be made
 */

import CreateFakeApiMethods from './FakeApiMethods';
import CreateApiActions from './ApiActions';
import CreateApiSync from './ApiSync';

export const ApiSchema = {
    dogs: 'dogs'
};

const initialData = {
    dogs: [
        {id: "1", name: "Charlie", toy: "Ball"}
    ]
};

export const ApiMethods = CreateFakeApiMethods(ApiSchema, initialData, {log: true});
export const ApiActions = CreateApiActions(ApiMethods);
export const ApiSync = CreateApiSync(ApiActions);
