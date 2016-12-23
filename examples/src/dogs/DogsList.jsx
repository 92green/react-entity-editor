import React from 'react';
import {connect} from 'react-redux';
import {EntityEditorList} from 'react-entity-editor';

import DogsEntityEditorConfig from './DogsEntityEditorConfig';

function DogsList(props) {
    const {
        dogs_list,
        entityEditor,
        dispatch
    } = props;

    return <div>
        <button className="Button" onClick={entityEditor.actions.goNew}>New dog</button>
        <table className="Table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Toy</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {dogs_list.map(dog => {
                    const {id} = dog;
                    return <tr>
                        <td>{dog.name}</td>
                        <td>{dog.toy}</td>
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

const withEntityEditor = EntityEditorList(DogsEntityEditorConfig);
const withRedux = connect();
export default withEntityEditor(withRedux(DogsList));
