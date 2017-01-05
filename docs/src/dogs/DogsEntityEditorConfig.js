import {ApiActions} from '../api/Api';

const DogsEntityEditorConfig = {
    callbacks: {
        // each of these "ApiActions.dogs.xyz" redux actions returns a promise
        onCreate: () => ({payload, dispatch}) => {
            return dispatch(ApiActions.dogs.create(payload));
        },
        onUpdate: () => ({id, payload, dispatch}) => {
            return dispatch(ApiActions.dogs.update(id, payload));
        },
        onDelete: () => ({id, dispatch}) => {
            return dispatch(ApiActions.dogs.delete(id));
        }
    }
};

export default DogsEntityEditorConfig;
