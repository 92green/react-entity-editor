import React from 'react';
import {EntityEditorList} from 'react-entity-editor';

import CatsEntityEditorConfig from './CatsEntityEditorConfig';

function CatsList(props) {
    const {
        cats,
        onGo,
        catModifier, // TODO STAGE 2 make way of hock to receive this prop and bind it automatically into operations
        entityEditor
    } = props;

    //console.log("CatsList props", props);

    return <div>
        <h3>List</h3>
        <button className="Button" onClick={entityEditor.actions.go.bind(this, {id: null, name: "item", onGo})}>New cat</button>
        <table className="Table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Toy</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {cats.map((cat, key) => {
                    const {id} = cat;
                    return <tr key={key}>
                        <td>{cat.name}</td>
                        <td>{cat.toy}</td>
                        <td>
                            <button className="Button Button-small" onClick={entityEditor.actions.go.bind(this, {id, name: "item", onGo})}>edit</button>
                            <button className="Button Button-small" onClick={entityEditor.actions.delete.bind(this, {id, catModifier})}>delete</button>
                        </td>
                    </tr>;
                })}
            </tbody>
        </table>
    </div>
}

const withEntityEditor = EntityEditorList(CatsEntityEditorConfig);
export default withEntityEditor(CatsList);
