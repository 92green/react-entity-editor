import React, {Component, PropTypes} from 'react';
import {EntityEditorPropType} from 'react-entity-editor';

class CatsList extends Component {

    new() {
        // the go action in the cats example expects a view and an optional id
        const actionProps = {
            view: "item",
            id: null // null id on an "item" view indicates that the item is new
        };
        this.props.entityEditor.actions.go(actionProps);
    }

    edit(id) {
        // the go action in the cats example expects a view and an optional id
        const actionProps = {
            view: "item",
            id
        };
        this.props.entityEditor.actions.go(actionProps);
    }

    delete(id) {
        // the delete action in the cats example expects an id
        const actionProps = {
            id
        };
        this.props.entityEditor.actions.delete(actionProps);
    }

    render() {
        const {cats, entityEditor} = this.props;
        const {abilities} = entityEditor;

        return <div>
            <button className="Button" onClick={this.new.bind(this)} disabled={!abilities.go}>New cat</button>
            <table className="Table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Toy</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cats.map((cat) => {
                        const {id} = cat;
                        return <tr key={id}>
                            <td>{cat.name}</td>
                            <td>{cat.toy}</td>
                            <td>
                                <button className="Button Button-small" onClick={this.edit.bind(this, id)} disabled={!abilities.go}>edit</button>
                                <button className="Button Button-small" onClick={this.delete.bind(this, id)} disabled={!abilities.delete}>delete</button>
                            </td>
                        </tr>;
                    })}
                </tbody>
            </table>
        </div>;
    }
}

CatsList.propTypes = {
    cats: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            toy: PropTypes.string
        })
    ).isRequired,
    entityEditor: EntityEditorPropType.isRequired
};

export default CatsList;
