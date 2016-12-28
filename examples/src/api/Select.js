export function SelectList(state, type) {
    const {items, list} = state[type].toObject();
    return list.map(ii => items.get(ii));
}

export function SelectItem(state, type, id) {
    return state[type].getIn(['items', id], null);
}

export function SelectRequestState(state, type, method) {
    const fetch = state[type].getIn(['fetch', method], false);
    const error = state[type].getIn(['error', method], null);
    return {fetch, error};
}
