import React, {PropTypes} from 'react';
import {ApiSync} from '../api/Api';
import TagsList from './TagsList';

function TagsOverview(props) {
    const {
        tags_list,
        fetch,
        error
    } = props;

    return <div>
        <h1>Tags</h1>
        <TagsList
            tags_list={tags_list}
            receivedWhen={props => !!props.tags_list}
            fetch={fetch}
            error={error}
        />
    </div>;
}

TagsOverview.propTypes = {
    tags_list: PropTypes.object,
    fetch: PropTypes.bool,
    error: PropTypes.object
};

const withSync = ApiSync.tags.list();
export default withSync(TagsOverview);
