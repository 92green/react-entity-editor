import React, { Component, PropTypes } from 'react';
import { List, Map, fromJS } from 'immutable';
import AutoRequest from 'bd-stampy/components/AutoRequest';

//
// EntityEditor higher order component
// Base entity editor functionality and UI flow without UI elements
//

export default (config) => (ComposedComponent) => {
    class EntityEditor extends Component {

        constructor(props) {
            super(props);
            this.state = {
                prompt: null
            };
        }

        //
        // helpers - these are inferred from this.props, and passed down as props to child elements
        //

        isNew(props = this.props) {
            return !props.id;
        }

        createsOnSave(props = this.props) {
            return this.isNew(props) || props.willCopy;
        }

        //
        // permissions
        //

        permitCreate() {
            return this.props.permitCreate && typeof this.props.onCreate == "function";
        }

        permitUpdate() {
            return this.props.permitUpdate && typeof this.props.onUpdate == "function";
        }

        permitDelete() {
            return this.props.permitDelete && typeof this.props.onDelete == "function";
        }

        //
        // naming / text labels
        //
        // child elements will receive a entityName and actionName prop
        // both are functions that can optionally accept an array of strings to set which text trransforms to perform
        // so if the current entityName="dog" and child.props.entityName(['first','plural']), then the string "Dogs" will be returned
        // 

        entityName(modifications) {
            var name = this.props.entityName;
            if(!modifications) {
                return name;
            }
            if(modifications.includes('plural')) {
                name = this.props.entityNamePlural || name+"s";
            }
            return this.genericNameTransform(name, modifications);
        }

        actionName(modifications) {
            var name = "edit";
            if(this.isNew()) {
                name = "add new";
            } else if(this.props.willCopy) {
                name = "copy";
            }
            return this.genericNameTransform(name, modifications);
        }

        genericNameTransform(name, modifications) {
            if(modifications.includes('first')) {
                name = name
                    .charAt(0)
                    .toUpperCase() + name.slice(1);
            }
            if(modifications.includes('titleCase')) {
                name = name
                    .split(" ")
                    .map(word => word
                        .charAt(0)
                        .toUpperCase() + word.slice(1)
                    )
                    .join(" ");
            }
            return name;
        }

        //
        // handlers
        //

        requestSave(values) {
            if(this.createsOnSave()) {
                // if we need to create but can't do it, reject
                if(!this.permitCreate()) {
                    return Promise.reject();
                }

                // create, then show prompts on success
                return this.props
                    .onCreate(values)
                    .then(
                        (newId) => new Promise((resolve, reject) => {
                            if(this.props.willCopy) {
                                this.openPromptCreateSuccess(resolve, reject, newId, "copied");
                            } else {
                                this.openPromptCreateSuccess(resolve, reject, newId, "created");
                            }
                        })
                    )
                    .then(this.props.afterCreate);
            }

            // if we need to update but can't do it, reject
            if(!this.permitUpdate()) {
                return Promise.reject();
            }

            // update, then show prompts on success
            return this.props
                .onUpdate(this.props.id, values)
                .then(
                    (dataObject) => new Promise((resolve, reject) => {
                        this.openPromptUpdateSuccess(resolve, reject);
                    })
                )
                .then(this.props.afterUpdate);
        }

        requestDelete() {
            // if we need to delete but can't do it, reject
            if(!this.permitDelete()) {
                return Promise.reject();
            }

            return this.props
                .onDelete(this.props.id)
                .then(
                    (data) => new Promise((resolve, reject) => {
                        this.openPromptDeleteSuccess(resolve, reject);
                    })
                )
                .then(this.props.afterDelete);
        }

        requestClose(dirty) {
            return new Promise((resolve, reject) => {
                if(dirty) {
                    this.openPromptCloseConfirm(resolve, reject);
                } else {
                    this.props.onClose();
                    resolve();
                }
            });
        }

        requestReset() {
            return new Promise((resolve, reject) => {
                this.openPromptResetConfirm(resolve, reject);
            });
        }

        //
        // prompts
        //

        openPrompt(prompt) {
            this.setState({
                prompt
            });
        }

        closePrompt() {
            this.setState({
                prompt: null
            });
        }

        openPromptCreateSuccess(resolve, reject, newId, action) {
             this.openPrompt({
                title: "Success",
                message: `${this.entityName(['first'])} ${action}.`,
                yes: "Okay",
                onYes: () => {
                    if(this.props.onGotoEdit && this.props.permitUpdate) {
                        this.props.onGotoEdit(newId);
                    } else {
                        this.props.onClose();
                    }
                    resolve();
                }
            });
        }

        openPromptUpdateSuccess(resolve, reject) {
             this.openPrompt({
                title: "Success",
                message: `${this.entityName(['first'])} saved.`,
                yes: "Okay",
                onYes: resolve
            });
        }

        openPromptDeleteConfirm(resolve, reject) {
             this.openPrompt({
                title: "Warning",
                message: `Are you sure you want to delete this ${entityName()}? This action cannot be undone.`,
                yes: "Delete",
                no: "Cancel",
                onYes: resolve,
                onNo: reject
            });
        }

        openPromptDeleteSuccess(resolve, reject) {
             this.openPrompt({
                title: "Success",
                message: `${this.entityName(['first'])} deleted.`,
                yes: "Okay",
                onYes: () => {
                    this.props.onClose();
                    resolve();
                }
            });
        }

        openPromptCloseConfirm(resolve, reject) {
            this.openPrompt({
                title: "Unsaved changes",
                message: `You have unsaved changes on this ${this.entityName()}. What would you like to do?`,
                yes: "Discard changes",
                no: "Keep editing",
                onYes: () => {
                    this.props.onClose();
                    resolve();
                },
                onNo: reject
            });
        }

        openPromptResetConfirm(resolve, reject) {
            this.openPrompt({
                title: "Warning",
                message: `Are you sure you want to revert this ${this.entityName()}? You will lose any changes since your last save.`,
                yes: "Revert",
                no: "Cancel",
                onYes: resolve,
                onNo: reject
            });
        }

        //
        // render
        //

        render() {
            const {
                // children
                children,
                // id and abilites
                id,
                willCopy,
                // data transaction states
                reading,
                creating,
                updating,
                deleting,
                // errors
                readError,
                writeError
            } = this.props;

            const isNew = this.isNew();

            // inferred data transaction states
            const saving = creating || updating;
            const fetching = reading || creating || updating || deleting;

            // inferred abilities
            const canSave = !fetching;

            const canDelete = this.permitDelete() && !fetching && !isNew;

            if(isNew && !this.permitCreate()) { // prohibit creating if onCreate is undefined
                console.warn("EntityEditor: Can't display form, no onCreate function defined. This might be caused by permitCreate being a non-true value");
                return null;
            }

            if(!isNew && !this.permitUpdate()) { // prohibit updating if onUpdate is undefined
                console.warn("EntityEditor: Can't display form, no onUpdate function defined. This might be caused by permitUpdate being a non-true value");
                return null;
            }

            return (
                <ComposedComponent
                    {...this.props}

                    id={id}
                    willCopy={willCopy}
                    isNew={isNew}
                    canSave={canSave}
                    canDelete={canDelete}

                    prompt={this.state.prompt}
                    closePrompt={this.closePrompt.bind(this)}

                    reading={reading}
                    creating={creating}
                    updating={updating}
                    deleting={deleting}
                    saving={saving}
                    fetching={fetching}

                    readError={readError}
                    writeError={writeError}

                    onSave={this.requestSave.bind(this)}
                    onClose={this.requestClose.bind(this)}
                    onDelete={this.requestDelete.bind(this)}
                    onReset={this.requestReset.bind(this)}

                    entityName={this.entityName.bind(this)}
                    actionName={this.actionName.bind(this)}
                />
            );
        }
    }

    EntityEditor.propTypes = {
        // id and abilites
        id: PropTypes.any, // (editor will edit item if this is set, or create new if this is not set)
        willCopy: PropTypes.bool,
        // prompts
        prompt: PropTypes.string,
        closePrompt: PropTypes.func,
        // data transaction states
        reading: PropTypes.bool,
        creating: PropTypes.bool,
        updating: PropTypes.bool,
        deleting: PropTypes.bool,
        // errors
        readError: PropTypes.any,
        writeError: PropTypes.any,
        // permissions
        permitCreate: PropTypes.bool,
        permitUpdate: PropTypes.bool,
        permitDelete: PropTypes.bool,
        // callbacks
        onRead: PropTypes.func,
        onCreate: PropTypes.func,
        onUpdate: PropTypes.func,
        onDelete: PropTypes.func,
        onClose: PropTypes.func.isRequired,
        onGotoEdit: PropTypes.func,
        // after callbacks - fired on success, must each return a resolve promise
        afterRead: PropTypes.func,
        afterCreate: PropTypes.func,
        afterUpdate: PropTypes.func,
        afterDelete: PropTypes.func,
        afterClose: PropTypes.func,
        // naming
        entityName: PropTypes.string,
        entityNamePlural: PropTypes.string
    };

    EntityEditor.defaultProps = {
        willCopy: false,
        entityName: "item",
        entityNamePlural: "items",
        // after callbacks
        afterRead: (data) => Promise.resolve(data), 
        afterCreate: (data) => Promise.resolve(data), 
        afterUpdate: (data) => Promise.resolve(data), 
        afterDelete: (data) => Promise.resolve(data), 
        afterClose: (data) => Promise.resolve(data)
    };

    const autoRequest = AutoRequest(['id'], (props) => {
        if(props.id && props.onRead) {
            props.onRead(props.id)
                .then(props.afterRead);
        }
    });

    return autoRequest(EntityEditor);
};