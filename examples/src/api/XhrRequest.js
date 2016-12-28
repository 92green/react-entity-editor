import Request from 'superagent';

const resolvePromiseResponse = (continuePromiseChain) => {
    return new Promise((resolve, reject) => {
        return continuePromiseChain((err, res) => {
            if (err) {
                return reject(err);
            } else if (res.ok) {
                var responseKey = res.type == "text/html" ? "text" : "body";
                return resolve(res[responseKey], res);
            } else {
                return reject(res);
            }
        })
    });
}

function simpleQuery(verb, url, query, headers) {
    return resolvePromiseResponse(next => {
        return Request[verb](url)
            .set(headers || {})
            .query(query)
            .end(next);
    });
}

function simplePost(verb, url, payload, headers) {
    return resolvePromiseResponse(next => {
        return Request[verb](url)
            .set(headers || {})
            .send(payload)
            .end(next);
    });
}

export function get(url, query, headers){
    return simpleQuery('get', url, query, headers);
}

export function del(url, query, headers){
    return simpleQuery('del', url, query, headers);
}

export function patch(url, payload, headers){
    return simplePost('patch', url, payload, headers);
}

export function post(url, payload, headers){
    return simplePost('post', url, payload, headers);
}

export function put(url, payload, headers){
    return simplePost('put', url, payload, headers);
}

export function upload(url, query, files, onProgress, headers = {}) {
    return resolvePromiseResponse(next => {
        var req = files
            .reduce((req, file) => req.attach(file.name, file, file.name), Request.post(url))
            .end(next);

        if (onProgress) {
            req.on('progress', onProgress);
        }
    });
}
