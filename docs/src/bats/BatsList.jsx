import React, {Component, PropTypes} from 'react';
import {EntityEditorPropType} from 'react-entity-editor';

class BatsList extends Component {

    // componentWillMount() {
    //     // when this component mounts, request the list of bats
    //     // this doesn't require any action props
    //     this.props.entityEditor.actions.list();
    // }

    new() {
        // the go action in the bats example expects a view and an optional id
        const actionProps = {
            view: "item",
            id: null // null id on an "item" view indibates that the item is new
        };
        this.props.entityEditor.actions.go(actionProps);
    }

    edit(id) {
        // the go action in the bats example expects a view and an optional id
        const actionProps = {
            view: "item",
            id
        };
        this.props.entityEditor.actions.go(actionProps);
    }

    delete(id) {
        // the delete action in the bats example expects an id
        const actionProps = {
            id
        };
        this.props.entityEditor.actions.delete(actionProps);
    }

    render() {
        const {bats, entityEditor} = this.props;
        const {abilities, status} = entityEditor;

        // if we don't have the list information yet...
        if(!bats) {
            // ...but if something is loading, show it
            if(status) {
                return <p><em>{status.title}</em></p>;
            }
            // or else, we have nothing to show at all
            return null;
        }

        return <div>
            <button className="Button" onClick={this.new.bind(this)} disabled={!abilities.go}>New bat</button>
            <table className="Table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Toy</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bats.map((bat) => {
                        const {id} = bat;
                        return <tr key={id}>
                            <td>{bat.name}</td>
                            <td>{bat.diet}</td>
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

BatsList.propTypes = {
    bats: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            diet: PropTypes.string
        })
    ),
    entityEditor: EntityEditorPropType.isRequired
};

export default BatsList;
