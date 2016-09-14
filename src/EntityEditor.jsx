import React, {Component, PropTypes} from 'react';
import {List, Map, fromJS} from 'immutable';
import PropChangeListener from './PropChangeListener';
import {returnPromise, returnBoolean} from './Utils';

//
// EntityEditor higher order component
// Base entity editor functionality and UI flow without UI elements
//

export default (config) => (ComposedComponent) => {

    const prompts = (config && config.prompts) || {};

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

        //
        // naming / text labels
        //
        // child elements will receive a entityName and actionName prop
        // both are functions that can optionally accept a bunch of strings as arguments
        // to set which text transforms to perform
        // so if the current entityName="dog" and child.props.entityName('first','plural'),
        // then the string "Dogs" will be returned
        // 

        entityName(...modifications) {


            return "NOUN";

            /*console.log(modifications);
            var name = this.props.entityName;
            if(!modifications) {
                return name;
            }
            if(modifications.includes('plural')) {
                name = this.props.entityNamePlural || name+"s";
            }
            return this.genericNameTransform(name, modifications);*/
        }

        actionName(...modifications) {
            return "ACTION";

            /*
            var name = "edit";
            if(this.isNew()) {
                name = "add new";
            }
            return this.genericNameTransform(name, modifications);*/
        }

        genericNameTransform(name, modifications) {
            /*if(modifications.includes('first')) {
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
            }*/
            return name;
        }

        //
        // handlers
        //

        requestSave(values) {
            return this.isNew()
                ? this.requestCreate(values)
                : this.requestUpdate(values);
        }

        requestCreate(values) {
            // if we need to create but can't do it, reject
            if(!returnBoolean(this.props.allowCreate)) {
                return Promise.reject();
            }

            // create, then show prompts on success or error
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
                            this.openPromptErrorOnCreate(resolve, reject, this.props.errorCreating);
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

            // update, then show prompts on success or error
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
                            this.openPromptErrorOnUpdate(resolve, reject, this.props.errorUpdating);
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
                            this.openPromptErrorOnDelete(resolve, reject, this.props.errorDeleting);
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

        setDirty(dirty = true) {
            this.setState({ dirty });
        }

        //
        // prompts
        //

        openPrompt(name, props) {
            const chosenName = typeof name == "string"
                ? name
                : fromJS(name).find(nn => prompts.hasOwnProperty(nn));

            if(!prompts[chosenName]) {
                props.onYes();
                return;
            }

            const prompt = prompts[chosenName]({
                ...props,
                entity: this.entityName,
                action: this.actionName
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
                        this.props.onClose();
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
                    this.props.onClose();
                }
            });
        }

        openPromptCreateConfirm(resolve, reject) {
            this.openPrompt(["createConfirm", "saveConfirm", "writeConfirm"], {
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
                    this.props.onClose();
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
                errorReading,
                errorCreating,
                errorUpdating,
                errorDeleting
            } = this.props;

            const isNew = this.isNew();

            // inferred data transaction states
            const saving = isCreating || isUpdating;
            const fetching = isReading || isCreating || isUpdating || isDeleting;

            // inferred abilities
            const canDelete = !fetching && !isNew && returnBoolean(this.props.allowDelete, id);
            const canReset = !isNew && this.state.dirty;
            const canSaveNew = !fetching && !isNew && returnBoolean(this.props.allowCreate);
            const canSave = !fetching && (isNew ? returnBoolean(this.props.allowCreate) : returnBoolean(this.props.allowUpdate, id));

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
                // errors
                'errorReading',
                'errorCreating',
                'errorUpdating',
                'errorDeleting',
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
                saving={saving}
                fetching={fetching}

                errorReading={!isNew && errorReading}
                errorCreating={errorCreating}
                errorUpdating={errorUpdating}
                errorDeleting={errorDeleting}

                onSave={this.requestSave.bind(this)}
                onSaveNew={this.requestCreate.bind(this)}
                onClose={this.requestClose.bind(this)}
                onDelete={this.requestDelete.bind(this)}
                onResetConfirm={this.requestResetConfirm.bind(this)}
                onDirty={this.setDirty.bind(this)}

                entityName={this.entityName.bind(this)}
                actionName={this.actionName.bind(this)}
            />;
        }
    }

    EntityEditor.propTypes = {
        // id and values: editor will edit item if id is set, or create new if this is not set
        id: PropTypes.any,
        // prompts
        prompt: PropTypes.string,
        closePrompt: PropTypes.func,
        // data transaction states
        isReading: PropTypes.bool,
        isCreating: PropTypes.bool,
        isUpdating: PropTypes.bool,
        isDeleting: PropTypes.bool,
        // errors
        errorReading: PropTypes.any,
        errorCreating: PropTypes.any,
        errorUpdating: PropTypes.any,
        errorDeleting: PropTypes.any,
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