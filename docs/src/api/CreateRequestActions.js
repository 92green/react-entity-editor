import {createAction} from 'redux-actions';

export default function CreateRequestActions(fetchAction, recieveAction, errorAction, sideEffect) {
    return (...args) => (dispatch) => {
        dispatch(createAction(fetchAction)());
        return sideEffect(...args).then(
            (data) => Promise.resolve(dispatch(createAction(recieveAction)(data))),
            (error) => Promise.reject(dispatch(createAction(errorAction)(error)))
        );
    }
}
