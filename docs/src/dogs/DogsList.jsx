import React, {Component, PropTypes} from 'react';
import {EntityEditorPropType} from 'react-entity-editor';

class DogsList extends Component {
    constructor(props) {
        super(props);
        this.handleGoNew = this.handleGoNew.bind(this);
        this.handleGoEdit = this.handleGoEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleGoNew() {
        // the go action expects a view and an optional id
        // an id of null will cause this to go to the "new item" view
        this.props.entityEditor.actions.go({
            view: "item",
            id: null
        });
    }

    handleGoEdit(id) {
        // the go action expects a view and an optional id
        // this will go to the "edit item" view for the given id
        this.props.entityEditor.actions.go({
            view: "item",
            id
        });
    }

    handleDelete(id) {
        // the delete action expects an id
        this.props.entityEditor.actions.delete({id});
    }

    render() {
        const {dogs, entityEditor} = this.props;
        const {item} = entityEditor.names;

        return <div>
            <button
                children={`New ${item}`}
                onClick={this.handleGoNew}
                className="Button Button-primary"
                disabled={!entityEditor.actionable}
            />
            <table className="Table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Toy</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {dogs.map((dog) => {
                        const {id} = dog;
                        return <tr key={id}>
                            <td>{dog.name}</td>
                            <td>{dog.toy}</td>
                            <td>
                                <button
                                    children="edit"
                                    className="Button Button-small Button-primary"
                                    onClick={() => this.handleGoEdit(id)}
                                    disabled={!entityEditor.actionable}
                                />
                                <button
                                    children="delete"
                                    className="Button Button-small Button-secondary"
                                    onClick={() => this.handleDelete(id)}
                                    disabled={!entityEditor.actionable}
                                />
                            </td>
                        </tr>;
                    })}
                </tbody>
            </table>
        </div>;
    }
}

DogsList.propTypes = {
    dogs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            toy: PropTypes.string
        })
    ).isRequired,
    entityEditor: EntityEditorPropType.isRequired
};

export default DogsList;
