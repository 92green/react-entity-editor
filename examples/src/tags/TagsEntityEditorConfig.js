import {ApiActions} from '../api/Api';

const TagsEntityEditorConfig = {
    callbacks: {
        onCreate: () => ({payload, dispatch}) => {
            return dispatch(ApiActions.tags.create(payload));
        },
        onUpdate: () => ({id, payload, dispatch}) => {
            return dispatch(ApiActions.tags.update(id, payload));
        },
        onDelete: () => ({id, dispatch}) => {
            return dispatch(ApiActions.tags.delete(id));
        }
    }
};

export default TagsEntityEditorConfig;
