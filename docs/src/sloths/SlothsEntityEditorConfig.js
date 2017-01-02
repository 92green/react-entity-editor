import {ApiActions} from '../api/Api';

const SlothsEntityEditorConfig = {
    callbacks: {
        // each of these "ApiActions.sloths.xyz" redux actions returns a promise
        onCreate: () => ({payload, dispatch}) => {
            return dispatch(ApiActions.sloths.create(payload));
        },
        onUpdate: () => ({id, payload, dispatch}) => {
            return dispatch(ApiActions.sloths.update(id, payload));
        },
        onDelete: () => ({id, dispatch}) => {
            return dispatch(ApiActions.sloths.delete(id));
        }
    }
};

export default SlothsEntityEditorConfig;
