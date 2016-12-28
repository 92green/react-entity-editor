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
