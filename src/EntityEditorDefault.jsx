import React, {Component, PropTypes} from 'react';
import {List, Map, fromJS} from 'immutable';

import EntityEditor from './EntityEditor';
import Modal from './Modal';
import {defaultPrompts, defaultWords} from './TextDefaults';

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
            if(this.props.isReading) {
                return <p>Loading...</p>;
            }

            if(this.props.errorOnRead) {
                return <p>Error: {this.props.errorOnRead.message}</p>;
            }

            const propsToRemove = List.of(
                // prompts
                'prompt',
                'closePrompt',
                // after callbacks
                'afterRead',
                'afterCreate',
                'afterUpdate',
                'afterDelete',
                'afterClose'
            );

            const filteredProps = propsToRemove
                .reduce((filteredProps, propToRemove) => filteredProps.delete(propToRemove), fromJS(this.props))
                .toJS();

            return <div>
                <h2>{this.props.actionName('first')} {this.props.entityName()}</h2>
                <ComposedComponent {...filteredProps} />
                {this.renderModal()}
            </div>;
        }

        renderModal() {
            const {
                open,
                title,
                message,
                status,
                type,
                yes,
                no,
                onYes,
                onNo
            } = this.props.prompt || {};

            return <Modal
                isOpen={open}
                onRequestClose={this.props.closePrompt}
                title={title}
                yes={yes}
                no={no || null}
                onYes={onYes}
                onNo={onNo || null}>
                {type == "error" &&
                    <h3>Error {status}: {title}</h3>
                }
                <p>{message}</p>
            </Modal>;
        }
    }

    return EntityEditor({
        prompts: defaultPrompts,
        words: defaultWords
    })(EntityEditorDefault);
};
