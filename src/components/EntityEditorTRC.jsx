import React, { Component, PropTypes } from 'react';
import { List, Map, fromJS } from 'immutable';

import EntityEditor from 'trc-client-core/src/components/EntityEditor';

import ModalManager from 'trc-client-core/src/Modal/ModalManager';
import ModalConfirm from 'trc-client-core/src/Modal/ModalConfirm';

import Loader from 'toyota-styles/lib/components/Loader';
import ErrorMessage from 'toyota-styles/lib/components/ErrorMessage';
import Button from 'toyota-styles/lib/components/Button';

//
// EntityEditorTRC higher order component
//
// TRC specific UI for entity editor 
//

export default (config) => (ComposedComponent) => {

    class EntityEditorTRC extends Component {

        handleSave(values) {
            const {
                entityName,
                willCreateNew,
                onClose
            } = this.props;

            return this.props
                .onSave(values)
                .then(
                    (data) => {
                        ModalManager.showModal(
                            <ModalConfirm 
                                title="Success"
                                message={`${entityName('first')} ${data.action}.`}
                                yes="Okay"
                                no={null}
                                onYes={willCreateNew ? onClose : null}
                            />
                        );
                        return Promise.resolve();
                    },
                    (error) => {
                        ModalManager.showModal(
                            <ModalConfirm 
                                title={`Error saving ${entityName()}`}
                                message={`${error}`}
                                yes="Okay"
                                no={null}
                            />
                        );
                        return Promise.reject();
                    }
                );
        }

        handleDelete() {
            const {
                entityName,
                onDelete,
                onClose
            } = this.props;

            return new Promise((resolve, reject) => {
                const onYes = () => {
                    onDelete().then(
                        (data) => {
                            ModalManager.showModal(
                                <ModalConfirm 
                                    title="Success"
                                    message={`${this.props.entityName('first')} deleted`}
                                    yes="Okay"
                                    no={null}
                                    onYes={onClose}
                                />
                            );
                            resolve();
                        },
                        (error) => {
                            ModalManager.showModal(
                                <ModalConfirm 
                                    title={`Error deleting ${this.props.entityName()}`}
                                    message={`${error}`}
                                    yes="Okay"
                                    no={null}
                                />
                            );
                            reject();
                        }
                    );
                };

                ModalManager.showModal(
                    <ModalConfirm 
                        title="Warning" 
                        message={`Are you sure you want to delete this ${entityName()}? This action cannot be undone.`}
                        yes="Delete"
                        no="Cancel"
                        onYes={onYes}
                        onNo={reject}
                    />
                );
            });
        }

        handleClose(dirty) {
            return new Promise((resolve, reject) => {
                if(!dirty) {
                    resolve();
                    return this.props.onClose();
                }

                const quitWithoutSaving = () => {
                    this.props.onClose();
                    resolve();
                };

                ModalManager.showModal(
                    <ModalConfirm 
                        title="Unsaved changes" 
                        message={`You have unsaved changes on this ${this.props.entityName()}. What would you like to do?`}
                        yes="Discard changes"
                        no="Keep editing"
                        onYes={quitWithoutSaving}
                        onNo={reject}
                    />
                );
            });
        }

        handleReset() {
            return new Promise((resolve, reject) => {
                ModalManager.showModal(
                    <ModalConfirm 
                        title="Warning" 
                        message={`Are you sure you want to revert this ${this.props.entityName()}? You will lose any changes since your last save.`}
                        yes="Revert"
                        no="Cancel"
                        onYes={resolve}
                        onNo={reject}
                    />
                );
            });
        }

        //
        // render
        //

        render() {
            const {
                reading,
                readError,
                children
            } = this.props;

            if(reading) {
                return <Loader />;
            }

            if(readError) {
                return <ErrorMessage message={readError.message} />;
            }
            
            return (
                <div>
                    {this.renderHeading()}
                    <ComposedComponent
                        {...this.props}
                        onSave={this.handleSave.bind(this)}
                        onClose={this.handleClose.bind(this)}
                        onDelete={this.handleDelete.bind(this)}
                        onReset={this.handleReset.bind(this)}
                    />
                </div>
            );
        }

        renderHeading() {
            if(!this.props.showHeading) {
                return null;
            }
            return React.createElement(this.props.headingTag, {className: 'hug-top'}, `${this.props.actionName(['titleCase'])} ${this.props.entityName(['first'])}`);
        }
    }

    EntityEditorTRC.propTypes = {
        // id and abilites
        id: PropTypes.any, // (editor will edit item if this is set, or create new if this is not set)
        willCopy: PropTypes.bool,
        willCreateNew: PropTypes.bool,
        canSave: PropTypes.bool,
        canDelete: PropTypes.bool,
        // data transaction states
        reading: PropTypes.bool,
        creating: PropTypes.bool,
        updating: PropTypes.bool,
        deleting: PropTypes.bool,
        saving: PropTypes.bool,
        fetching: PropTypes.bool,
        // errors
        readError: PropTypes.any,
        writeError: PropTypes.any,
        // permissions
        permitCreate: PropTypes.bool,
        permitUpdate: PropTypes.bool,
        permitDelete: PropTypes.bool,
        // props from entity editor - callbacks
        onRead: PropTypes.func,
        onCreate: PropTypes.func,
        onUpdate: PropTypes.func,
        onDelete: PropTypes.func,
        onClose: PropTypes.func.isRequired,
        // after callbacks - fired on success, must each return a resolve promise
        afterRead: PropTypes.func,
        afterCreate: PropTypes.func,
        afterUpdate: PropTypes.func,
        afterDelete: PropTypes.func,
        afterClose: PropTypes.func,
        // naming
        entityName: PropTypes.func,
        actionName: PropTypes.func,
        // options
        showHeading: PropTypes.bool,
        headingTag: PropTypes.string
    };

    EntityEditorTRC.defaultProps = {
        showHeading: true,
        headingTag: "h1"
    };

    return EntityEditor()(EntityEditorTRC);
};
