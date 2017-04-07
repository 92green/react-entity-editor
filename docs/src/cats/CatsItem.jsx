import React, {Component, PropTypes} from 'react';
import {ApiSync} from '../api/Api';
import CatsItemForm from './CatsItemForm';

function CatsItem(props) {
    const {cat, onGo, catModifier} = props;

    console.log("CatsItem cat", cat);

    // todo get name from ee

    return <div>
        <h3>{cat ? "Edit" : "New"} cat</h3>
        <CatsItemForm
            cat={cat}
            onGo={onGo}
            catModifier={catModifier}
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
