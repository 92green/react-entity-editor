import React, {Component, PropTypes} from 'react';
import {List, Map, fromJS} from 'immutable';
import PropChangeListener from './PropChangeListener';
import {returnPromise, returnBoolean} from './Utils';

//
// EntityEditor higher order component
// Base entity editor functionality and UI flow without UI elements
//

export default (config) => (ComposedComponent) => {

    const configPrompts = (config && config.prompts) || {};
    const configWords = (config && config.words) || {};

    class EntityEditor extends Component {

        constructor(props) {
            super(props);
            this.state = {
                dirty: false,
                prompt: null
            };
            this.allowLeave = false;
        }

        componentWillMount() {
            if(this.props.onLeaveHook) {
                this.props.onLeaveHook((a,b) => {
                    if(this.allowLeave) {
                        return true;
                    }
                    this.requestClose();
                    return false;
                });
            }
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

        //
        // naming / text labels
        //

        entityName(...modifiers) {
            const entityName = configWords.entityName(this.props, modifiers);
            return this.applyNameModifiers(entityName, modifiers);
        }

        actionName(...modifiers) {
            const actionName = configWords.actionName(this.props, modifiers, this.isNew());
            return this.applyNameModifiers(actionName, modifiers);
        }

        applyNameModifiers(words, modifiers) {
            return modifiers
                .reduce((words, modifier) => {
                    if(!configWords.modifiers.hasOwnProperty(modifier)) {
                        throw `${modifier} is not a valid modifier. The following are valid modifiers according to the config passed into Entity Editor: {words.modifiers.join(', ')}`;
                    }
                    return configWords.modifiers[modifier](words);
                }, words);
        }

        //
        // handlers
        //

        requestSave(values) {
            return this.isNew()
                ? this.requestCreate(values)
                : this.requestUpdate(values);
        }

        requestSaveNew(values) {
            // if we need to create but can't do it, reject
            if(!returnBoolean(this.props.allowCreate)) {
                return Promise.reject();
            }

            return new Promise((resolve, reject) => {
                this.openPromptSaveNewConfirm(resolve, reject);
            })
            .then(
                () => this.requestCreate(values),
                () => {}
            );
        }

        requestCreate(values) {
            // if we need to create but can't do it, reject
            if(!returnBoolean(this.props.allowCreate)) {
                return Promise.reject();
            }

            return new Promise((resolve, reject) => {
                this.openPromptCreateConfirm(resolve, reject);
            })
            .then(
                () => returnPromise(this.props.onCreate(values))
                    .then(
                        (data) => new Promise((resolve, reject) => {
                            this.openPromptCreateSuccess(() => resolve(data), reject, data.newId);
                        }),
                        (error) => new Promise((resolve, reject) => {
                            this.openPromptErrorOnCreate(resolve, reject, this.props.errorOnCreate);
                        })
                    )
                    .then(this.props.afterCreate),
                () => {}
            );
        }

        requestUpdate(values) {
            // if we need to update but can't do it, reject
            if(!returnBoolean(this.props.allowUpdate, this.props.id)) {
                return Promise.reject();
            }

            return new Promise((resolve, reject) => {
                this.openPromptUpdateConfirm(resolve, reject);
            })
            .then(
                () => returnPromise(this.props.onUpdate(this.props.id, values))
                    .then(
                        (data) => new Promise((resolve, reject) => {
                            this.openPromptUpdateSuccess(() => resolve(data), reject);
                        }),
                        (error) => new Promise((resolve, reject) => {
                            this.openPromptErrorOnUpdate(resolve, reject, this.props.errorOnUpdate);
                        })
                    )
                    .then(() => this.setDirty(false))
                    .then(this.props.afterUpdate),
                () => {}
            );
        }

        requestDelete() {
            // if we need to delete but can't do it, reject
            if(!returnBoolean(this.props.allowDelete, this.props.id)) {
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
                        }),
                        (error) => new Promise((resolve, reject) => {
                            this.openPromptErrorOnDelete(resolve, reject, this.props.errorOnDelete);
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
                    this.handleClose();
                }
            });
        }

        requestResetConfirm() {
            return new Promise((resolve, reject) => {
                if(this.state.dirty) {
                    this.openPromptResetConfirm(resolve, reject)
                } else {
                    reject();
                }
            })
            .then(() => this.setDirty(false));
        }

        requestCustomConfirm(func) {
            return new Promise((resolve, reject) => {
                const prompt = {
                    ...func({
                        entityName: this.entityName.bind(this),
                        actionName: this.actionName.bind(this)
                    }),
                    onYes: resolve,
                    onNo: reject
                };
                this.setState({prompt});
            });
        }

        setDirty(dirty = true) {
            this.setState({ dirty });
        }

        handleClose() {
            this.allowLeave = true;
            this.props.onClose();
        }

        //
        // prompts
        //

        openPrompt(name, props) {
            const chosenName = typeof name == "string"
                ? name
                : fromJS(name).find(nn => configPrompts.hasOwnProperty(nn));

            if(!configPrompts[chosenName]) {
                props.onYes();
                return;
            }

            const prompt = configPrompts[chosenName]({
                ...props,
                entityName: this.entityName.bind(this),
                actionName: this.actionName.bind(this)
            });

            this.setState({prompt});
        }

        closePrompt() {
            this.setState({prompt: null});
        }

        openPromptCreateSuccess(resolve, reject, newId) {
            this.openPrompt(["createSuccess", "saveSuccess", "writeSuccess"], {
                onYes: () => {
                    if(this.props.onGotoEdit && returnBoolean(this.props.allowUpdate, newId)) {
                        this.props.onGotoEdit(newId);
                    } else {
                        resolve();
                        this.handleClose();
                    }
                }
            });
        }

        openPromptUpdateSuccess(resolve, reject) {
            this.openPrompt(["updateSuccess", "saveSuccess", "writeSuccess"], {
                onYes: resolve
            });
        }

        openPromptDeleteSuccess(resolve, reject) {
            this.openPrompt(["deleteSuccess", "writeSuccess"], {
                onYes: () => {
                    resolve();
                    this.handleClose();
                }
            });
        }

        openPromptCreateConfirm(resolve, reject) {
            this.openPrompt(["createConfirm", "saveConfirm", "writeConfirm"], {
                onYes: resolve,
                onNo: reject
            });
        }

        openPromptSaveNewConfirm(resolve, reject) {
            this.openPrompt(["saveNewConfirm", "createConfirm", "saveConfirm", "writeConfirm"], {
                onYes: resolve,
                onNo: reject
            });
        }

        openPromptUpdateConfirm(resolve, reject) {
            this.openPrompt(["updateConfirm", "saveConfirm", "writeConfirm"], {
                onYes: resolve,
                onNo: reject
            });
        }

        openPromptDeleteConfirm(resolve, reject) {
            this.openPrompt(["deleteConfirm", "writeConfirm"], {
                onYes: resolve,
                onNo: reject
            });
        }        

        openPromptCloseConfirm(resolve, reject) {
            this.openPrompt("closeConfirm", {
                onYes: () => {
                    resolve();
                    this.handleClose();
                },
                onNo: reject()
            });
        }

        openPromptResetConfirm(resolve, reject) {
            this.openPrompt("resetConfirm", {
                onYes: resolve,
                onNo: reject
            });
        }

        openPromptErrorOnRead(resolve, reject, error) {
            this.openPrompt(["errorOnCreate", "errorOnWrite"], {
                error,
                onYes: resolve
            });
        }

        openPromptErrorOnCreate(resolve, reject, error) {
            this.openPrompt(["errorOnCreate", "errorOnWrite"], {
                error,
                onYes: resolve
            });
        }

        openPromptErrorOnUpdate(resolve, reject, error) {
            this.openPrompt(["errorOnUpdate", "errorOnWrite"], {
                error,
                onYes: resolve
            });
        }

        openPromptErrorOnDelete(resolve, reject, error) {
            this.openPrompt(["errorOnDelete", "errorOnWrite"], {
                error,
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
                // data transaction states
                isReading,
                isCreating,
                isUpdating,
                isDeleting,
                // errors
                errorOnRead,
                errorOnCreate,
                errorOnUpdate,
                errorOnDelete
            } = this.props;

            const isNew = this.isNew();

            // inferred data transaction states
            const isSaving = isCreating || isUpdating;
            const isWriting = isCreating || isUpdating || isDeleting;
            const isWaiting = isReading || isCreating || isUpdating || isDeleting;

            // inferred abilities
            const canDelete = !isWaiting && !isNew && returnBoolean(this.props.allowDelete, id);
            const canReset = !isNew && this.state.dirty;
            const canSaveNew = !isWaiting && !isNew && returnBoolean(this.props.allowCreate);
            const canSave = !isWaiting && (isNew ? returnBoolean(this.props.allowCreate) : returnBoolean(this.props.allowUpdate, id));

            const propsToRemove = List.of(
                'id',
                // prompts
                'prompt',
                'closePrompt',
                // data transaction states
                'isReading',
                'isCreating',
                'isUpdating',
                'isDeleting',
                // errors - experimental
                'errorOnRead',
                'errorOnCreate',
                'errorOnUpdate',
                'errorOnDelete',
                // allowances
                'allowCreate',
                'allowUpdate',
                'allowDelete',
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
                .reduce((filteredProps, propToRemove) => {
                    return filteredProps.delete(propToRemove)
                }, fromJS(this.props))
                .toJS();

            return <ComposedComponent
                {...filteredProps}

                id={id}
                isNew={isNew}

                canDelete={canDelete}
                canReset={canReset}
                canSave={canSave}
                canSaveNew={canSaveNew}

                prompt={this.state.prompt}
                closePrompt={this.closePrompt.bind(this)}

                isReading={isReading}
                isCreating={isCreating}
                isUpdating={isUpdating}
                isDeleting={isDeleting}
                isSaving={isSaving}
                isWriting={isWriting}
                isWaiting={isWaiting}

                errorOnRead={!isNew && errorOnRead}
                errorOnCreate={errorOnCreate}
                errorOnUpdate={errorOnUpdate}
                errorOnDelete={errorOnDelete}

                onSave={this.requestSave.bind(this)}
                onSaveNew={this.requestSaveNew.bind(this)}
                onClose={this.requestClose.bind(this)}
                onDelete={this.requestDelete.bind(this)}
                onResetConfirm={this.requestResetConfirm.bind(this)}
                onDirty={this.setDirty.bind(this)}
                onCustomConfirm={this.requestCustomConfirm.bind(this)}

                entityName={this.entityName.bind(this)}
                actionName={this.actionName.bind(this)}
            />;
        }
    }

    EntityEditor.propTypes = {
        // id and values: editor will edit item if id is set, or create new if this is not set
        id: PropTypes.any,
        // data transaction states
        isReading: PropTypes.bool,
        isCreating: PropTypes.bool,
        isUpdating: PropTypes.bool,
        isDeleting: PropTypes.bool,
        // errors
        errorOnRead: PropTypes.any,
        errorOnCreate: PropTypes.any,
        errorOnUpdate: PropTypes.any,
        errorOnDelete: PropTypes.any,
        // allowances
        allowRead: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.func // is passed (id)
        ]),
        allowCreate: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.func // is passed nothing
        ]),
        allowUpdate: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.func // is passed (id)
        ]),
        allowDelete: PropTypes.oneOfType([
            PropTypes.bool, // is passed (id)
            PropTypes.func
        ]),
        // callbacks
        onRead: PropTypes.func,
        onCreate: PropTypes.func,
        onUpdate: PropTypes.func,
        onDelete: PropTypes.func,
        onClose: PropTypes.func.isRequired,
        onGotoEdit: PropTypes.func,
        onLeaveHook: PropTypes.func,
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
        isReading: false,
        isCreating: false,
        isUpdating: false,
        isDeleting: false,
        // allowances
        allowRead: true,
        allowCreate: true,
        allowUpdate: true,
        allowDelete: true,
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
        const allowRead = typeof props.allowRead == "undefined" ? true : props.allowRead;

        if(props.id && props.onRead && returnBoolean(allowRead, props.id)) {
            const readResults = props.onRead(props.id);
            if(props.afterRead) {
                returnPromise(readResult).then(props.afterRead);
            }
        }
    });

    return propChangeListener(EntityEditor);
};