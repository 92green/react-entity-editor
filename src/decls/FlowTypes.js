/* @flow */
/* eslint-disable no-unused-vars */

type ActionConfig = {
    actions: Object,
    operations: Object
};

// Promiseable is a type that includes everything that Utils.returnPromise() can accept
type Promiseable = ?Promise<*>|Object|boolean;
