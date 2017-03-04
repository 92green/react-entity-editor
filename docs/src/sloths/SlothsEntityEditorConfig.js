import {SlowApiActions} from '../api/Api';
import CustomLoader from './CustomLoader';

const SlothsEntityEditorConfig = {
    item: {
        single: "sloth"
    },
    callbacks: {
        // each of these "SlowApiActions.sloths.xyz" redux actions returns a promise
        onCreate: () => ({payload, dispatch}) => {
            return dispatch(SlowApiActions.sloths.create(payload));
        },
        onUpdate: () => ({id, payload, dispatch}) => {
            return dispatch(SlowApiActions.sloths.update(id, payload));
        },
        onDelete: () => ({id, dispatch}) => {
            return dispatch(SlowApiActions.sloths.delete(id));
        }
    },
    // setting components.loader to a React component of your choice
    // allows you to override the default loader
    components: {
        loader: CustomLoader
    }
};

export default SlothsEntityEditorConfig;
