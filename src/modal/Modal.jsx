/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import ModalContent from './ModalContent';

export default (config: ModalConfig = {}): Function => {

    // TODO use stampy style Hock()

    const {
        className = "Modal",
        classNameContent = "Modal_content",
        content: Content = ModalContent
    } = config;

    return (Component: ReactClass<any>): ReactClass<any> => {

        return class EntityEditorModalHock extends React.Component {

            static propTypes = {
                entityEditor: PropTypes.object // TODO make a prop types file with one defintion for each
            };

            onRequestClose = () => this.props.entityEditor.nextSteps.onNo();

            render(): React.Element<any> {
                let {
                    status,
                    nextSteps
                } = this.props.entityEditor;

                let contentLabel = status
                    ? status.title || (status.no ? "Confirm" : "Alert")
                    : "";

                return <div>
                    <Component {...this.props} />
                    <ReactModal
                        isOpen={!!status}
                        onRequestClose={this.onRequestClose}
                        className={classNameContent}
                        overlayClassName={className}
                        contentLabel={contentLabel}
                    >
                        <Content
                            status={status}
                            nextSteps={nextSteps}
                        />
                    </ReactModal>
                </div>;
            }
        }
    };
};
