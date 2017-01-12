import React, {Component, PropTypes} from 'react';
import {SlowApiSync} from '../api/Api';
import SlothsEditForm from './SlothsEditForm';

function SlothsEdit(props) {
    const {
        sloths_get,
        entityEditorRoutes: {
            id
        },
        fetch,
        error
    } = props;

    return <div>
        <h1>Edit sloth</h1>
        <SlothsEditForm
            sloths_get={sloths_get}
            id={id}
            receivedWhen={props => !!props.sloths_get}
            fetch={fetch}
            error={error}
        />
    </div>;
}

SlothsEdit.propTypes = {
    sloths_get: PropTypes.object,
    fetch: PropTypes.bool,
    error: PropTypes.object
};

// only request data when props.entityEditorRoutes.id exists
const withSync = SlowApiSync.sloths.get((props, request) => props.entityEditorRoutes.id && request(props.entityEditorRoutes.id));
export default withSync(SlothsEdit);
