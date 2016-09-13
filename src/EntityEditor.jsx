import React, { Component, PropTypes } from 'react';
import { List, Map, fromJS } from 'immutable';
import PropChangeListener from './PropChangeListener';
import {returnPromise} from './Utils';

//
// EntityEditor higher order component
// Base entity editor functionality and UI flow without UI elements
//

export default (config) => (ComposedComponent) => {
    class EntityEditor extends Component {

        constructor(props) {
            super(props);
            this.state = {
                dirty: false,
                prompt: null
            };
        }

        componentWillUnmount() {
            this.closePrompt();
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
                return this.requestCreate(values);
            }
            return this.requestUpdate(values);
        }

        requestCreate(values) {
            // if we need to create but can't do it, reject
            if(!this.permitCreate()) {
                return Promise.reject();
            }

            // create, then show prompts on success
            return returnPromise(this.props.onCreate(values))
                .then(
                    (data) => new Promise((resolve, reject) => {
                        this.openPromptCreateSuccess(() => resolve(data), reject, data.newId);
                    }),
                    (error) => new Promise((resolve, reject) => {
                        this.openPromptWriteError(resolve, reject, this.props.writeError);
                    })
                )
                .then(this.props.afterCreate);
        }

        requestUpdate(values) {
            // if we need to update but can't do it, reject
            if(!this.permitUpdate()) {
                return Promise.reject();
            }

            // update, then show prompts on success
            return returnPromise(this.props.onUpdate(this.props.id, values))
                .then(
                    (data) => new Promise((resolve, reject) => {
                        this.openPromptUpdateSuccess(() => resolve(data), reject);
                    }),
                    (error) => new Promise((resolve, reject) => {
                        this.openPromptWriteError(resolve, reject, this.props.writeError);
                    })
                )
                .then(() => this.setDirty(false))
                .then(this.props.afterUpdate);
        }

        requestDelete() {
            // if we need to delete but can't do it, reject
            if(!this.permitDelete()) {
                return Promise.reject();
            }

            return new Promise((resolve, reject) => {
                this.openPromptDeleteConfirm(resolve, reject);
            })
            .then(
                () => returnPromise(this.props.onDelete(this.props.id))
                    .then(
                        (data) => new Promise((resolve, reject) => {
                            this.openPromptDeleteSuccess(() => resolve(data), reject);
                        })
                    )
                    .then(this.props.afterDelete),
                () => {}
            );
        }

        requestClose() {
            return new Promise((resolve, reject) => {
                if(this.state.dirty) {
                    this.openPromptCloseConfirm(resolve, reject);
                } else {
                    resolve();
                    this.props.onClose();
                }
            });
        }

        requestReset() {
            return new Promise((resolve, reject) => {
                if(this.state.dirty) {
                    this.openPromptResetConfirm(resolve, reject)
                } else {
                    reject();
                }
            })
            .then(() => this.setDirty(false));
        }

        setDirty(dirty = true) {
            this.setState({ dirty });
        }

        //
        // prompts
        //

        openPrompt(prompt) {
            this.setState({ prompt });
        }

        closePrompt() {
            this.setState({ prompt: null });
        }

        openPromptCreateSuccess(resolve, reject, newId) {
            const close = () => {
                if(this.props.onGotoEdit && this.props.permitUpdate) {
                    this.props.onGotoEdit(newId);
                } else {
                    resolve();
                    this.props.onClose();
                }
            };

            // set this in config!
                
            this.openPrompt({
                title: "Success",
                message: `${this.entityName(['first'])} created.`,
                type: "success",
                yes: "Okay",
                onYes: close,
                onNo: close
            });
        }

        openPromptUpdateSuccess(resolve, reject) {
             this.openPrompt({
                title: "Success",
                message: `${this.entityName(['first'])} saved.`,
                type: "success",
                yes: "Okay",
                onYes: resolve
            });
        }

        openPromptDeleteConfirm(resolve, reject) {
            this.openPrompt({
                title: "Warning",
                message: `Are you sure you want to delete this ${this.entityName()}? This action cannot be undone.`,
                type: "confirm",
                yes: "Delete",
                no: "Cancel",
                onYes: resolve,
                onNo: reject
            });
        }

        openPromptDeleteSuccess(resolve, reject) {
            const close = () => {
                resolve();
                this.props.onClose();
            };

            this.openPrompt({
                title: "Success",
                message: `${this.entityName(['first'])} deleted.`,
                type: "success",
                yes: "Okay",
                onYes: close,
                onNo: close
            });
        }

        openPromptCloseConfirm(resolve, reject) {
            this.openPrompt({
                title: "Unsaved changes",
                message: `You have unsaved changes on this ${this.entityName()}. What would you like to do?`,
                type: "confirm",
                yes: "Discard changes",
                no: "Keep editing",
                onYes: () => {
                    resolve();
                    this.props.onClose();
                },
                onNo: reject
            });
        }

        openPromptResetConfirm(resolve, reject) {
            this.openPrompt({
                title: "Warning",
                message: `Are you sure you want to reset this ${this.entityName()}? You will lose any changes since your last save.`,
                type: "confirm",
                yes: "Reset",
                no: "Cancel",
                onYes: resolve,
                onNo: reject
            });
        }

        openPromptWriteError(resolve, reject, error) {
            const {
                status,
                message
            } = error.toJS();

            this.openPrompt({
                title: "Error",
                status,
                message,
                type: "error",
                yes: "Okay",
                onYes: resolve
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
            var canSave = !fetching;
            const canDelete = this.permitDelete() && !fetching && !isNew;
            const canReset = this.state.dirty;

            if(isNew && !this.permitCreate()) { // prohibit creating if onCreate is undefined
                console.log("EntityEditor: Can't save form; permitCreate is false, you don't have permission to create, or an onCreate function is not defined.");
                canSave = false;
            }

            if(!isNew && !this.permitUpdate()) { // prohibit updating if onUpdate is undefined
                console.log("EntityEditor: Can't save form; permitUpdate is false, you don't have permission to update, or an onUpdate function is not defined.");
                canSave = false;
            }

            const propsToRemove = List.of(
                // prompts
                'prompt',
                'closePrompt',
                // data transaction states
                'reading',
                'creating',
                'updating',
                'deleting',
                // errors
                'readError',
                'writeError',
                // permissions
                'permitCreate',
                'permitUpdate',
                'permitDelete',
                // callbacks
                'onRead',
                'onCreate',
                'onUpdate',
                'onDelete',
                'onClose',
                'onGotoEdit',
                // after callbacks
                'afterRead',
                'afterCreate',
                'afterUpdate',
                'afterDelete',
                'afterClose',
                // naming
                'entityName',
                'entityNamePlural'
            );

            const filteredProps = propsToRemove
                .reduce((filteredProps, propToRemove) => filteredProps.delete(propToRemove), fromJS(this.props))
                .toJS();

            return (
                <ComposedComponent
                    {...filteredProps}

                    id={id}
                    isNew={isNew}

                    canSave={canSave}
                    canDelete={canDelete}
                    canReset={canReset}

                    prompt={this.state.prompt}
                    closePrompt={this.closePrompt.bind(this)}

                    reading={reading}
                    creating={creating}
                    updating={updating}
                    deleting={deleting}
                    saving={saving}
                    fetching={fetching}

                    readError={!isNew && readError}
                    writeError={writeError}

                    onSave={this.requestSave.bind(this)}
                    onSaveNew={this.requestCreate.bind(this)}
                    onClose={this.requestClose.bind(this)}
                    onDelete={this.requestDelete.bind(this)}
                    onReset={this.requestReset.bind(this)}
                    onDirty={this.setDirty.bind(this)}

                    entityName={this.entityName.bind(this)}
                    actionName={this.actionName.bind(this)}
                />
            );
        }
    }

    EntityEditor.propTypes = {
        // id and abilites
        id: PropTypes.any, // (editor will edit item if this is set, or create new if this is not set)
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
        // after callbacks fired on success (must each return a resolved promise)
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
        // data transaction states
        reading: false,
        creating: false,
        updating: false,
        deleting: false,
        // permissions
        permitCreate: true,
        permitUpdate: true,
        permitDelete: true,
        // after callbacks
        afterRead: (data) => Promise.resolve(data), 
        afterCreate: (data) => Promise.resolve(data), 
        afterUpdate: (data) => Promise.resolve(data), 
        afterDelete: (data) => Promise.resolve(data), 
        afterClose: (data) => Promise.resolve(data),
        // naming
        entityName: "item",
        entityNamePlural: "items"
    };

    const propChangeListener = PropChangeListener(['id'], (props) => {
        if(props.id && props.onRead) {
            const readResults = props.onRead(props.id);
            if(props.afterRead) {
                returnPromise(readResult).then(props.afterRead);
            }
        }
    });

    return propChangeListener(EntityEditor);
};