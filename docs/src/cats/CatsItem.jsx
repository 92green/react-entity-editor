import React, {Component, PropTypes} from 'react';
import {EntityEditorPropType} from 'react-entity-editor';
import CatsForm from './CatsForm';

class CatsItem extends Component {

    handleSave = (payload) => {
        // keep in mind that this.props.cat wont exist yet if you're making a new cat
        const id = this.props.cat ? this.props.cat.id : null;

        // the save action expects a payload and an optional id
        // save is a short way of calling either create or update
        // if id is falsey then the save action will call the create operation
        // or else the save action will call the update operation
        this.props.entityEditor.actions.save({payload, id});
    };

    handleDirty = () => {
        // tell entity editor that the form is dirty / has unsaved changes
        // it uses an operation instead of an action
        // because operations are done instantly and dont block actions from happening
        this.props.entityEditor.operations.dirty();
    };

    handleClean = () => {
        // tell entity editor that the form is clean / has no unsaved changes
        // it uses an operation instead of an action
        // because operations are done instantly and dont block actions from happening
        this.props.entityEditor.operations.clean();
    };

    handleBack = (payload) => {
        // the go action expects a view and an optional id
        this.props.entityEditor.actions.go({
            view: "list",
            id: null
        });
    };

    handleDelete = () => {
        // tell entity editor to delete this item
        // the delete action expects an id
        const {id} = this.props.cat;
        this.props.entityEditor.actions.delete({id});
    };

    render() {
        const {cat, entityEditor} = this.props;
        const {item} = entityEditor.names;

        const heading = `${cat ? "Edit" : "New"} ${item}`;

        return <div>
            <h3>{heading}</h3>
            <CatsForm
                cat={cat}
                onSave={this.handleSave}
                onDirty={this.handleDirty}
                onClean={this.handleClean}
                canSave={entityEditor.actionable}
            />
            <p>
                <button
                    children="Back"
                    onClick={this.handleBack}
                    className="Button Button-secondary"
                />
                {cat && // only show delete button when we have an item
                    <button
                        children="Delete"
                        onClick={this.handleDelete}
                        className="Button Button-secondary"
                    />
                }
                {entityEditor.status && // if a status comes down as props, render it
                    <em>{entityEditor.status.title}</em>
                }
            </p>
        </div>;
    }
}

CatsItem.propTypes = {
    cat: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        toy: PropTypes.string
    }),
    entityEditor: EntityEditorPropType.isRequired
};

export default CatsItem;
