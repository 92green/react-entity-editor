
// returnPromise

// if passed a promise, this returns the promise
// if passed anything else, this returns a resolved promise

export function returnPromise(item) {
    return typeof item == "object" && typeof item.then != "undefined"
    	? item
    	: new Promise((resolve) => resolve(item));
}

// returnBoolean

// if passed a function, this calls the function and returns its result cast to a boolean
// if passed anything else, this return the item cast to a boolean

export function returnBoolean(item, ...args) {
    return typeof item == "function"
    	? !!item(...args)
    	: !!item;
}

