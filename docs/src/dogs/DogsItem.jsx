import React, {Component, PropTypes} from 'react';
import {EntityEditorPropType} from 'react-entity-editor';
import DogsForm from './DogsForm';

class DogsItem extends Component {

    constructor(props) {
        super(props);

        // bind methods to this class
        this.handleSave = this.handleSave.bind(this);
        this.handleDirty = this.handleDirty.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleSave(payload) {
        // keep in mind that this.props.dog wont exist yet if you're making a new dog
        const id = this.props.dog ? this.props.dog.id : null;

        // the save action expects a payload and an optional id
        // save is a short way of calling either create or update
        // if id is falsey then the save action will call the create operation
        // or else the save action will call the update operation
        this.props.entityEditor.actions.save({payload, id});
    }

    handleDirty(dirty) {
        // tell entity editor the current dirty status of the form
        // it uses an operation instead of an action
        // because operations are done instantly and they wont block other actions from happening
        // the dirty operation expects a dirty boolean
        this.props.entityEditor.operations.dirty({dirty});
    }

    handleBack(payload) {
        // the go action expects a view and an optional id
        this.props.entityEditor.actions.go({
            view: "list",
            id: null
        });
    }

    handleDelete() {
        // tell entity editor to delete this item
        // the delete action expects an id
        const {id} = this.props.dog;
        this.props.entityEditor.actions.delete({id});
    }

    render() {
        const {dog, entityEditor} = this.props;
        const {item} = entityEditor.names;

        const heading = `${dog ? "Edit" : "New"} ${item}`;

        return <div>
            <h3>{heading}</h3>
            <DogsForm
                dog={dog}
                onSave={this.handleSave}
                onDirty={this.handleDirty}
                canSave={entityEditor.actionable}
            />
            <p>
                <button
                    children="Back"
                    onClick={this.handleBack}
                    className="Button Button-secondary"
                />
                {dog && // only show delete button when we have an item
                    <button
                        children="Delete"
                        onClick={this.handleDelete}
                        className="Button Button-secondary"
                    />
                }
            </p>
        </div>;
    }
}

DogsItem.propTypes = {
    dog: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        toy: PropTypes.string
    }),
    entityEditor: EntityEditorPropType.isRequired
};

export default DogsItem;
