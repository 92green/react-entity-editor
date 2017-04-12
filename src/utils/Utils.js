/* @flow */

// returnPromise

// if passed a promise, this returns the promise
// if passed anything else, this returns a reject promise if false, or a resolved promise otherwise

export function returnPromise(item: Promiseable): Promise<*> {
    return typeof item == "object" && typeof item.then != "undefined"
    	? item
    	: item === false
            ? new Promise((resolve, reject) => reject(item))
            : new Promise((resolve) => resolve(item));
}

// returnBoolean

// if passed a function, this calls the function and returns its result cast to a boolean
// if passed anything else, this return the item cast to a boolean

export function returnBoolean(item: *, ...args): boolean {
    return typeof item == "function"
    	? !!item(...args)
    	: !!item;
}

