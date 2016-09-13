import React, { Component, PropTypes } from 'react';
import { List, Map, fromJS } from 'immutable';

import EntityEditor from './EntityEditor';
import Modal from './Modal';

//
// EntityEditorDefault higher order component
//
// Default UI for entity editor for modals, headings and error messages
// This component's child component can implement the UI for the editor itself
//
// EntityEditorDefault is just an example, you are encouraged to create your own custom 'EntityEditorXYZ' for your own projects
//

export default (config) => (ComposedComponent) => {

    class EntityEditorDefault extends Component {

        //
        // render
        //

        render() {
            if(this.props.reading) {
                return <p>Loading...</p>;
            }

            if(this.props.readError) {
                return <p>Error: {this.props.readError.get('message')}</p>;
            }

            const propsToRemove = List.of(
                // prompts
                'prompt',
                'closePrompt'
            );
            
            const filteredProps = propsToRemove
                .reduce((filteredProps, propToRemove) => filteredProps.delete(propToRemove), fromJS(this.props))
                .toJS();
                
            return <div>
                <h2>{this.props.actionName(['titleCase'])} {this.props.entityName()}</h2>
                <ComposedComponent {...filteredProps} />
                {this.renderModal()}
            </div>;
        }

        renderModal() {
            if(!this.props.prompt) {
                return null;
            }

            const {
                title,
                message,
                status,
                type,
                yes,
                no,
                onYes,
                onNo
            } = this.props.prompt;

            if(type == "error") {
                return <Modal
                    isOpen={true}
                    onRequestClose={this.props.closePrompt}
                    title={title}
                    yes={yes}
                    no={no || null}
                    onYes={onYes}
                    onNo={onNo || null}>
                    <h3>Error {status}: {title}</h3>
                    <p>{message}</p>
                </Modal>;
            }

            return <Modal
                isOpen={true}
                onRequestClose={this.props.closePrompt}
                title={title}
                yes={yes}
                no={no || null}
                onYes={onYes}
                onNo={onNo || null}>
                <p>{message}</p>
            </Modal>;
        }
    }

    EntityEditor.propTypes = {
        // id and abilites
        id: PropTypes.any, // (editor will edit item if this is set, or create new if this is not set)
        isNew: PropTypes.bool,
        canSave: PropTypes.bool,
        canDelete: PropTypes.bool,
        // props from entity editor - prompts
        prompt: PropTypes.object,
        closePrompt: PropTypes.func,
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
        // props from entity editor - callbacks. Call these from your form
        onSave: PropTypes.func,
        onSaveNew: PropTypes.func,
        onClose: PropTypes.func,
        onDelete: PropTypes.func,
        onReset: PropTypes.func,
        onGotoEdit: PropTypes.func,
        onDirty: PropTypes.func,
        // after callbacks - fired on success, must each return a resolve promise if used
        afterRead: PropTypes.func,
        afterCreate: PropTypes.func,
        afterUpdate: PropTypes.func,
        afterDelete: PropTypes.func,
        afterClose: PropTypes.func,
        // naming
        entityName: PropTypes.func,
        actionName: PropTypes.func
    };

    return EntityEditor()(EntityEditorDefault);
};
