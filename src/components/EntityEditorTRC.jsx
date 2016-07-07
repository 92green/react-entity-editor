import React, { Component, PropTypes } from 'react';
import { List, Map, fromJS } from 'immutable';

import EntityEditor, {
    RESET_CONFIRM
} from 'trc-client-core/src/components/EntityEditor';

import Modal from 'trc-client-core/src/components/Modal';
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

        //
        // render
        //

        render() {
            const {
                reading,
                isNew,
                readError,
                children
            } = this.props;

            if(reading) {
                return <Loader />;
            }

            if(readError) {
                return <ErrorMessage message={readError.get('message')} />;
            }
            
            return <div>
                {this.renderHeading()}
                <ComposedComponent {...this.props} />
                {this.renderModal()}
            </div>;
        }

        renderHeading() {
            if(!this.props.showHeading) {
                return null;
            }
            return React.createElement(this.props.headingTag, {className: 'hug-top'}, `${this.props.actionName(['titleCase'])} ${this.props.entityName(['first'])}`);
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
                    <ErrorMessage
                        title={title}
                        code={status}
                        message={message}
                        />
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

    EntityEditorTRC.propTypes = {
        // id and abilites
        id: PropTypes.any, // (editor will edit item if this is set, or create new if this is not set)
        willCopy: PropTypes.bool,
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
        // permissions
        permitCreate: PropTypes.bool,
        permitUpdate: PropTypes.bool,
        permitDelete: PropTypes.bool,
        // props from entity editor - callbacks
        onSave: PropTypes.func,
        onClose: PropTypes.func,
        onDelete: PropTypes.func,
        onReset: PropTypes.func,
        onGotoEdit: PropTypes.func,
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
