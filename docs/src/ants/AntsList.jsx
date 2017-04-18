import React, {Component, PropTypes} from 'react';
import {EntityEditorPropType} from 'react-entity-editor';

class AntsList extends Component {

    new() {
        // the go action in the ants example expects a view and an optional id
        const actionProps = {
            view: "item",
            id: null // null id on an "item" view indiantes that the item is new
        };
        this.props.entityEditor.actions.go(actionProps);
    }

    edit(id) {
        // the go action in the ants example expects a view and an optional id
        const actionProps = {
            view: "item",
            id
        };
        this.props.entityEditor.actions.go(actionProps);
    }

    delete(id) {
        // the delete action in the ants example expects an id
        const actionProps = {
            id
        };
        this.props.entityEditor.actions.delete(actionProps);
    }

    render() {
        const {ants, entityEditor} = this.props;
        const {abilities} = entityEditor;

        return <div>
            <button className="Button" onClick={this.new.bind(this)} disabled={!abilities.go}>New ant</button>
            <table className="Table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Legs</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {ants.map((ant) => {
                        const {id} = ant;
                        return <tr key={id}>
                            <td>{ant.name}</td>
                            <td>{ant.legs}</td>
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

AntsList.propTypes = {
    ants: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            legs: PropTypes.string
        })
    ).isRequired,
    entityEditor: EntityEditorPropType.isRequired
};

export default AntsList;
