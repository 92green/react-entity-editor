import {BaseConfig} from 'react-entity-editor';
import {ApiActions} from '../api/Api';

const DogsEntityEditorConfig = BaseConfig.merge({
    item: {
        single: "dog"
    },
    operations: {
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
});

export default DogsEntityEditorConfig;
