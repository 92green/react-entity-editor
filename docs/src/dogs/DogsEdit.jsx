import React, {Component, PropTypes} from 'react';
import {ApiSync} from '../api/Api';
import DogsEditForm from './DogsEditForm';

function DogsEdit(props) {
    const {
        dogs_get,
        entityEditorRoutes: {
            id
        },
        fetch,
        error
    } = props;

    return <div>
        <h1>Edit dog</h1>
        <DogsEditForm
            dogs_get={dogs_get}
            id={id}
            receivedWhen={props => !!props.dogs_get}
            fetch={fetch}
            error={error}
        />
    </div>;
}

DogsEdit.propTypes = {
    dogs_get: PropTypes.object,
    fetch: PropTypes.bool,
    error: PropTypes.object
};

// only request data when props.entityEditorRoutes.id exists
const withSync = ApiSync.dogs.get((props, request) => props.entityEditorRoutes.id && request(props.entityEditorRoutes.id));
export default withSync(DogsEdit);
