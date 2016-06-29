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
                name = this.props.entityNamePlural || this.props.entityName+"s";
            }
            return this.genericNameTransform(name, modifications);
        }

        actionName(modifications) {
            var name = "edit";
            if(this.willCreateNew()) {
                name = "new";
            } else if(this.props.willCopy) {
                name = "copy";
            }
            return this.genericNameTransform(name, modifications);
        }

        genericNameTransform(name, modifications) {
            if(modifications.includes('first')) {
                name = name.charAt(0).toUpperCase() + name.slice(1);
            }
            return name;
        }

        //
        // handlers
        //

        handleSave(values) {
            if(this.createsOnSave()) {
                return this.props
                    .onCreate(values)
                    .then(
                        (newId) => {
                            return Promise.resolve({
                                newId,
                                action: this.props.willCopy ? "copied" : "created"
                            });
                        }
                    );
            }
            return this.props
                .onUpdate(this.props.id, values)
                .then(
                    (dataObject) => {
                        dataObject.action = "saved";
                        return Promise.resolve(dataObject);
                    }
                );
        }

        handleDelete() {
            return this.props
                .onDelete(this.props.id)
                .then(
                    (data) => {
                        return Promise.resolve({
                            action: "deleted"
                        });
                    }
                );
        }

        handleClose() {
            this.props.onClose();
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
                writeError,
                // callbacks
                onCreate,
                onUpdate,
                onDelete
            } = this.props;

            const willCreateNew = this.willCreateNew();

            // inferred data transaction states
            const saving = creating || updating;
            const fetching = reading || creating || updating || deleting;

            // inferred abilities
            const canSave = !fetching;

            const canDelete = typeof onDelete == "function" && !fetching && !willCreateNew;

            if(willCreateNew && typeof onCreate != "function") { // prohibit creating if onCreate is undefined
                console.warn("EntityEditor: Can't display form, no onCreate function defined. This might be caused by permitCreate being a non-true value");
                return null;
            }

            if(!willCreateNew && typeof onUpdate != "function") { // prohibit updating if onUpdate is undefined
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
        // data transaction states
        reading: PropTypes.bool,
        creating: PropTypes.bool,
        updating: PropTypes.bool,
        deleting: PropTypes.bool,
        // errors
        readError: PropTypes.any,
        writeError: PropTypes.any,
        // callbacks
        onRead: PropTypes.func,
        onCreate: PropTypes.func,
        onUpdate: PropTypes.func,
        onDelete: PropTypes.func,
        onClose: PropTypes.func.isRequired,
        // naming
        entityName: PropTypes.string,
        entityNamePlural: PropTypes.string
    };

    EntityEditor.defaultProps = {
        willCopy: false,
        entityName: "item",
        entityNamePlural: "items"
    };

    const autoRequest = AutoRequest(['id'], (props) => {
        if(props.id && props.onRead) {
            props.onRead(props.id)
                .then(
                    (data) => {},
                    (error) => {}
                );
        }
    });

    return autoRequest(EntityEditor);
};