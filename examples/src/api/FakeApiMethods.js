import {fromJS, Map} from 'immutable';

export default function FakeApiMethods(apiSchema, initialData = {}, options = {}) {
    var data = fromJS(apiSchema)
        .mapEntries(([key, value]) => [value, Map()])
        .merge(fromJS(initialData)
            .map(list => {
                return list.reduce((map, item) => {
                    return map.set(item.get('id').toString(), item);
                }, Map());
            })
        );

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

    const delay = 250;

    const setData = (newData) => {
        data = newData;
    };

    const log = (...args) => {
        if(options.log) {
            console.log(...args);
        }
    }

    return fromJS(apiSchema)
        .map((path) => ({
            get: (id) => new Promise((resolve, reject) => {
                const callback = () => {
                    if(!data.hasIn([path, id])) {
                        log(`GET ${path}/${id} not found`);
                        reject("Not found");
                        return;
                    }

                    const item = data
                        .getIn([path, id])
                        .toJS();

                    log(`GET ${path}/${id}`, item);
                    resolve(item);
                };
                setTimeout(callback, delay);
            }),
            list: () => new Promise((resolve, reject) => {
                const callback = () => {
                    if(!data.has(path)) {
                        log(`GET ${path} not found`);
                        reject("Not found");
                        return;
                    }

                    const list = data
                        .get(path)
                        .toList()
                        .sortBy(ii => ii.get('id'))
                        .toJS();

                    log(`GET ${path}`, list);
                    resolve(list);
                };
                setTimeout(callback, delay);
            }),
            create: (payload) => new Promise((resolve, reject) => {
                const callback = () => {
                    if(!data.has(path)) {
                        log(`POST ${path} not found`);
                        reject("Not found");
                        return;
                    }

                    const nextId = autoIncrementIds.get(path) + 1;
                    autoIncrementIds = autoIncrementIds.set(path, nextId);
                    const item = fromJS(payload).set('id', nextId.toString());

                    log(`POST ${path}`, item.toJS());
                    setData(data.setIn([path, nextId.toString()], item));
                    resolve(item.toJS());
                };
                setTimeout(callback, delay);
            }),
            update: (id, payload) => new Promise((resolve, reject) => {
                const callback = () => {
                    if(!data.hasIn([path, id])) {
                        log(`PUT ${path}/${id} not found`);
                        reject("Not found");
                        return;
                    }

                    log(`PUT ${path}/${id}`, payload);
                    setData(data.setIn([path, id], fromJS(payload)));
                    resolve(payload);
                };
                setTimeout(callback, delay);
            }),
            delete: (id) => new Promise((resolve, reject) => {
                const callback = () => {
                    if(!data.hasIn([path, id])) {
                        log(`DELETE ${path}/${id} not found`);
                        reject("Not found");
                        return;
                    }

                    log(`DELETE ${path}/${id}`);
                    setData(data.deleteIn([path, id]));
                    resolve({id});
                };
                setTimeout(callback, delay);
            })
        }))
        .toJS();
}
