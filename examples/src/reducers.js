import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import {ApiSchema} from 'api/Api';
import {ApiReducer} from 'dcme-api';

export default combineReducers({
    form: formReducer,
    ...ApiReducer(ApiSchema)
});
