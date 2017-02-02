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

import {fromJS, Map} from 'immutable';

export default function FakeApiMethods(apiSchema, initialData = {}, options = {}) {
    // set initial data according to schema and initialData
    var data = fromJS(apiSchema)
        .mapEntries(([key, value]) => [value, Map()])
        .merge(fromJS(initialData)
            .map(list => {
                return list.reduce((map, item) => {
                    return map.set(item.get('id').toString(), item);
                }, Map());
            })
        );

    // set initial autoincrement ids, pretending to be a database
    var autoIncrementIds = data
        .map(list => {
            if(list.isEmpty()) {
                return 0;
            }
            const maxId = list
                .max(ii => Number(ii.get('id')))
                .get('id');

            return Number(maxId);
        });

    // fake api call have a fake delay
    const delay = options.delay || 250;

    // this applies the fake delay, and also introduces a chance of errors if options.faulty == true
    const tryFakeRequest = (fakeRequest, resolve, reject, failChance) => {
        const success = () => resolve(fakeRequest());
        const fail = () => reject({status: 500, message: "Something went wrong"});

        const willFail = options.faulty && Math.random() < failChance;
        if(options.log && options.faulty) {
            if(willFail) {
                console.warn(`Oh no! This faulty API call will probably fail!`);
            } else {
                console.warn(`This API call looks like it will succeed, but you might not be so lucky nect time...`);
            }
        }
        setTimeout(willFail ? fail : success, delay);
    };

    // set data in the "database"
    const setData = (newData) => {
        data = newData;
    };

    // log info to console only when options.log == true
    const log = (...args) => {
        if(options.log) {
            console.log(...args);
        }
    }

    // create the 5 methods for each type of entity in the api schema
    return fromJS(apiSchema)
        .map((path) => ({
            get: (id) => new Promise((resolve, reject) => {
                const fakeRequest = () => {
                    if(!data.hasIn([path, id])) {
                        log(`Fake GET ${path}/${id} not found`);
                        reject("Not found");
                        return;
                    }

                    const item = data
                        .getIn([path, id])
                        .toJS();

                    log(`Fake GET ${path}/${id} done`, item);
                    return item;
                };
                log(`Requesting fake GET ${path}/${id}...`);
                tryFakeRequest(fakeRequest, resolve, reject, 0.5);
            }),
            list: () => new Promise((resolve, reject) => {
                const fakeRequest = () => {
                    if(!data.has(path)) {
                        log(`Fake GET ${path} not found`);
                        reject("Not found");
                        return;
                    }

                    const list = data
                        .get(path)
                        .toList()
                        .sortBy(ii => ii.get('id'))
                        .toJS();

                    log(`Fake GET ${path} done`, list);
                    return list;
                };
                log(`Requesting fake GET ${path}...`);
                tryFakeRequest(fakeRequest, resolve, reject, 0.5);
            }),
            create: (payload) => new Promise((resolve, reject) => {
                const fakeRequest = () => {
                    if(!data.has(path)) {
                        log(`Fake POST ${path} not found`);
                        reject("Not found");
                        return;
                    }

                    const nextId = autoIncrementIds.get(path) + 1;
                    autoIncrementIds = autoIncrementIds.set(path, nextId);
                    const item = fromJS(payload).set('id', nextId.toString());

                    setData(data.setIn([path, nextId.toString()], item));
                    log(`Fake POST ${path} done`, item.toJS());
                    return item.toJS();
                };
                log(`Requesting fake POST ${path}...`);
                tryFakeRequest(fakeRequest, resolve, reject, 1);
            }),
            update: (id, payload) => new Promise((resolve, reject) => {
                const fakeRequest = () => {
                    if(!data.hasIn([path, id])) {
                        log(`Fake PUT ${path}/${id} not found`);
                        reject("Not found");
                        return;
                    }

                    const item = fromJS(payload).set('id', id);
                    setData(data.setIn([path, id], item));
                    log(`Fake PUT ${path}/${id} done`, payload);
                    return item.toJS();
                };
                log(`Requesting fake PUT ${path}/${id}...`);
                tryFakeRequest(fakeRequest, resolve, reject, 1);
            }),
            delete: (id) => new Promise((resolve, reject) => {
                const fakeRequest = () => {
                    if(!data.hasIn([path, id])) {
                        log(`Fake DELETE ${path}/${id} not found`);
                        reject("Not found");
                        return;
                    }

                    setData(data.deleteIn([path, id]));
                    log(`Fake DELETE ${path}/${id} done`);
                    return {id};
                };
                log(`Requesting fake DELETE ${path}/${id}...`);
                tryFakeRequest(fakeRequest, resolve, reject, 1);
            })
        }))
        .toJS();
}
