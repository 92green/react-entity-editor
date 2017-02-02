import React, {Component, PropTypes} from 'react';
import {FaultyApiSync} from '../api/Api';
import DodosEditForm from './DodosEditForm';

function DodosEdit(props) {
    const {
        dodos_get,
        entityEditorRoutes: {
            id
        },
        fetch,
        error
    } = props;

    return <div>
        <h1>Edit dodo</h1>
        <DodosEditForm
            dodos_get={dodos_get}
            id={id}
            receivedWhen={props => !!props.dodos_get}
            fetch={fetch}
            error={error}
        />
    </div>;
}

DodosEdit.propTypes = {
    dodos_get: PropTypes.object,
    fetch: PropTypes.bool,
    error: PropTypes.object
};

// only request data when props.entityEditorRoutes.id exists
const withSync = FaultyApiSync.dodos.get((props, request) => props.entityEditorRoutes.id && request(props.entityEditorRoutes.id));
export default withSync(DodosEdit);
