import {
    ApiMethods as CreateApiMethods,
    ApiActions as CreateApiActions,
    ApiSync as CreateApiSync,
    FakeApiMethods as CreateFakeApiMethods
} from 'dcme-api';

export const ApiSchema = {
    transactions: 'badger_transactions',
    tags: 'badger_tags'
};

const fakeInitialData = {
    badger_tags: [
        {id: 1, name: "Test", match: "???"},
        {id: 3, name: "Test 2", match: "???"}
    ]
};

export const ApiMethods = CreateFakeApiMethods(ApiSchema, fakeInitialData, {log: true});
export const ApiActions = CreateApiActions(ApiMethods);
export const ApiSync = CreateApiSync(ApiActions);
