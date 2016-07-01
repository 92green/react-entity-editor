import React, { Component, PropTypes } from 'react';
import { List, Map, fromJS } from 'immutable';
import AutoRequest from 'bd-stampy/components/AutoRequest';

//
// EntityEditor higher order component
// Base entity editor functionality without UI elements
//

//
// TODO - some logic such as confirmations are currently handled in EntityEditorTRC where it should really be handled here and the UI implemented by EntityEditorTRC
// This is only because the current modal's state isn't based off props - changing the modal to a PortalModal used by BigDatr will fix this
// and allow EntityEditor to be prescriptive about the entire UI state
//

//
// TODO - use new modal controlled by props (react-modal) so errors can be displayed from redux rather than from the results of the xhr requests
//

export default (config) => (ComposedComponent) => {
    class EntityEditor extends Component {

        //
        // helpers - these are inferred from this.props, and passed down as props to child elements
        //

        willCreateNew(props = this.props) {
            return !props.id;
        }

        createsOnSave(props = this.props) {
            return this.willCreateNew(props) || props.willCopy;
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
            if(this.willCreateNew()) {
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

        handleSave(values) {
            if(this.createsOnSave()) {
                if(!this.permitCreate()) {
                    return Promise.reject();
                }

                return this.props
                    .onCreate(values)
                    .then(
                        (newId) => {
                            return Promise.resolve({
                                newId,
                                action: this.props.willCopy ? "copied" : "created"
                            });
                        },
                        (error) => {
                            var errorMessage = error.payload.message;
                            return Promise.reject(errorMessage);
                        }
                    )
                    .then(this.props.afterCreate);
            }

            if(!this.permitUpdate()) {
                return Promise.reject();
            }

            return this.props
                .onUpdate(this.props.id, values)
                .then(
                    (dataObject) => {
                        dataObject.action = "saved";
                        return Promise.resolve(dataObject);
                    },
                    (error) => {
                        var errorMessage = error.payload.message;
                        return Promise.reject(errorMessage);
                    }
                )
                .then(this.props.afterUpdate);
        }

        handleDelete() {
            if(!this.permitDelete()) {
                return Promise.reject();
            }

            return this.props
                .onDelete(this.props.id)
                .then(
                    (data) => {
                        return Promise.resolve({
                            action: "deleted"
                        });
                    },
                    (error) => {
                        var errorMessage = error.payload.message;
                        return Promise.reject(errorMessage);
                    }
                )
                .then(this.props.afterDelete);
        }

        handleClose() {
            this.props.onClose();
            return Promise.resolve({
                action: "closed"
            });
        }

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

            const willCreateNew = this.willCreateNew();

            // inferred data transaction states
            const saving = creating || updating;
            const fetching = reading || creating || updating || deleting;

            // inferred abilities
            const canSave = !fetching;

            const canDelete = this.permitDelete() && !fetching && !willCreateNew;

            if(willCreateNew && !this.permitCreate()) { // prohibit creating if onCreate is undefined
                console.warn("EntityEditor: Can't display form, no onCreate function defined. This might be caused by permitCreate being a non-true value");
                return null;
            }

            if(!willCreateNew && !this.permitUpdate()) { // prohibit updating if onUpdate is undefined
                console.warn("EntityEditor: Can't display form, no onUpdate function defined. This might be caused by permitUpdate being a non-true value");
                return null;
            }

            return (
                <ComposedComponent
                    {...this.props}

                    id={id}
                    willCopy={willCopy}
                    willCreateNew={willCreateNew}
                    canSave={canSave}
                    canDelete={canDelete}

                    reading={reading}
                    creating={creating}
                    updating={updating}
                    deleting={deleting}
                    saving={saving}
                    fetching={fetching}

                    readError={readError}
                    writeError={writeError}

                    onSave={this.handleSave.bind(this)}
                    onClose={this.handleClose.bind(this)}
                    onDelete={this.handleDelete.bind(this)}

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
        // routes info
        getEditorRoute: PropTypes.func,
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