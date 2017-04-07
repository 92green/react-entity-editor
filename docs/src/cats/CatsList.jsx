import React from 'react';

function CatsList(props) {
    const {
        cats,
        entityEditor
    } = props;

    return <div>
        <h3>List</h3>
        <button className="Button" onClick={entityEditor.actions.go.bind(this, {id: null, name: "item"})}>New cat</button>
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
                            <button className="Button Button-small" onClick={entityEditor.actions.go.bind(this, {id, name: "item"})}>edit</button>
                            <button className="Button Button-small" onClick={entityEditor.actions.delete.bind(this, {id})}>delete</button>
                        </td>
                    </tr>;
                })}
            </tbody>
        </table>
    </div>
}

export default CatsList
