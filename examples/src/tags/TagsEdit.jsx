import React, {Component, PropTypes} from 'react';
import {ApiSync} from '../api/Api';
import TagsEditForm from './TagsEditForm';

function TagsEdit(props) {
    const {
        tags_get,
        entityEditorRoutes: {
            id
        },
        fetch,
        error
    } = props;

    return <div>
        <h1>Edit tag</h1>
        <TagsEditForm
            tags_get={tags_get}
            id={id}
            receivedWhen={props => !!props.tags_get}
            fetch={fetch}
            error={error}
        />
    </div>;
}

TagsEdit.propTypes = {
    tags_get: PropTypes.object,
    fetch: PropTypes.bool,
    error: PropTypes.object
};

const withSync = ApiSync.tags.get((props, request) => props.entityEditorRoutes.id && request(props.entityEditorRoutes.id));
export default withSync(TagsEdit);
