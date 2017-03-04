import React from 'react';
import {connect} from 'react-redux';
import {EntityEditorList} from 'react-entity-editor';

import DodosEntityEditorConfig from './DodosEntityEditorConfig';

function DodosList(props) {
    const {
        dodos_list,
        entityEditor,
        dispatch
    } = props;

    return <div>
        <button className="Button" onClick={entityEditor.actions.goNew}>New dodo</button>
        <table className="Table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Deadness</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {dodos_list.map((dodo, key) => {
                    const {id} = dodo;
                    return <tr key={key}>
                        <td>{dodo.name}</td>
                        <td>{dodo.deadness}</td>
                        <td>
                            <button className="Button Button-small" onClick={entityEditor.actions.goEdit.bind(this, {id})}>edit</button>
                            <button className="Button Button-small" onClick={entityEditor.actions.delete.bind(this, {id, dispatch})}>delete</button>
                        </td>
                    </tr>;
                })}
            </tbody>
        </table>
    </div>
}

const withEntityEditor = EntityEditorList(DodosEntityEditorConfig);
const withRedux = connect();
export default withEntityEditor(withRedux(DodosList));
