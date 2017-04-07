import React, {Component, PropTypes} from 'react';
import {ApiSync} from '../api/Api';
import CatsItemForm from './CatsItemForm';

function CatsItem(props) {
    const {cat, entityEditor} = props;

    // todo get name from ee

    return <div>
        <h3>{cat ? "Edit" : "New"} cat</h3>
        <CatsItemForm
            cat={cat}
            entityEditor={entityEditor}
        />
    </div>;
}

/*
CatsItem.propTypes = {
    cats_get: PropTypes.object,
    fetch: PropTypes.bool,
    error: PropTypes.object
};*/

// only request data when props.entityEditorRoutes.id exists
export default CatsItem;
