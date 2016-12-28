import {fromJS} from 'immutable';
import CreateRequestActions from './CreateRequestActions';

export default function ApiActions(apiMethods) {
    return fromJS(apiMethods)
        .map((methodSet, key) => {
            return methodSet
                .map((method, methodName) => CreateRequestActions(
                    `${key}_${methodName}_fetch`,
                    `${key}_${methodName}_receive`,
                    `${key}_${methodName}_error`,
                    method
                ));
        })
        .toJS();
}
