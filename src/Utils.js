
// returnPromise

// if passed a promise, this returns the promise
// if passed anything else, this returns a resolved promise

export function returnPromise(item) {
    if(typeof item == "object" && typeof item.then != "undefined") {
        return item;
    }
    return new Promise((resolve) => resolve(item));
}