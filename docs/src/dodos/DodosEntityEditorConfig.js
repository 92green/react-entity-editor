import {FaultyApiActions} from '../api/Api';
import CustomError from './CustomError';

const DodosEntityEditorConfig = {
    item: {
        single: "dodo"
    },
    callbacks: {
        // each of these "FaultyApiActions.dodos.xyz" redux actions returns a promise
        // and they each only work half the time, rejecting promises containing errors when they dont work
        onCreate: () => ({payload, dispatch}) => {
            return dispatch(FaultyApiActions.dodos.create(payload));
        },
        onUpdate: () => ({id, payload, dispatch}) => {
            return dispatch(FaultyApiActions.dodos.update(id, payload));
        },
        onDelete: () => ({id, dispatch}) => {
            return dispatch(FaultyApiActions.dodos.delete(id));
        }
    },
    // this CustomError may be displayed in page, when loading a list or item has failed
    // or within a prompt (usually a modal) when saving, editing or deleting has failed
    // it is passed an error prop containing the error object (or other data)
    // returned from the rejected promise
    components: {
        //error: CustomError,
    }
};

export default DodosEntityEditorConfig;
