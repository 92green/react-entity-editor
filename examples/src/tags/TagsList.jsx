import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {EntityEditorList} from 'react-entity-editor';
import {Table, Button} from 'stampy';

import TagsEntityEditorConfig from './TagsEntityEditorConfig';

function TagsList(props) {
    const {
        tags_list,
        entityEditor,
        dispatch
    } = props;

    const tableSchema = [
        {
            heading: 'Name',
            value: 'name'
        },
        {
            heading: 'Match',
            value: 'match'
        },
        {
            heading: 'Actions',
            render: tag => {
                const id = tag.get('id');
                return <div>
                    <Button onClick={entityEditor.actions.goEdit.bind(this, {id})}>edit</Button>
                    <Button onClick={entityEditor.actions.delete.bind(this, {id, dispatch})}>delete</Button>
                </div>;
            }
        }
    ];

    return <div>
        <Button onClick={entityEditor.actions.goNew}>New tag</Button>
        <Table
            schema={tableSchema}
            data={tags_list}
        />
    </div>
}

const withEntityEditor = EntityEditorList(TagsEntityEditorConfig);
const withRedux = connect();
export default withEntityEditor(withRedux(TagsList));
