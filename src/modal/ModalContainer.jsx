/* @flow */

import React, {Component, PropTypes} from 'react';

class ModalContainer extends Component {

    promptOnYes: Function;
    promptOnNo: Function;

    constructor(props: Object): void {
        super(props);
        this.promptOnYes = this.promptOnYes.bind(this);
        this.promptOnNo = this.promptOnNo.bind(this);
    }

    promptOnYes(): void {
        this.props.workflow.next("onYes", this.props.workflow.end);
    }

    promptOnNo(): void {
        this.props.workflow.next("onNo", this.props.workflow.end);
    }

    render(): React.Element<any> {
        const {
            userConfig,
            workflow: {
                task
            },
            promptProps
        } = this.props;

        const workflowTask: ?Object =  userConfig.getIn(['tasks', task]);
        const promptOpen: boolean = !!workflowTask
            && workflowTask.get('status')
            && workflowTask.get('statusStyle') == "modal";

        var promptDetails: ?Object = null;

        if(promptOpen && workflowTask) {
            promptDetails = workflowTask.get('status')(promptProps);
        }

        const Prompt: ReactClass<any> = userConfig.getIn(['components', 'prompt']);
        const PromptContent: ReactClass<any> = userConfig.getIn(['components', 'promptContent']);

        return <Prompt
            {...promptDetails}
            open={promptOpen}
            onYes={this.promptOnYes}
            onNo={this.promptOnNo}
        >
            {promptDetails &&
                <PromptContent {...promptDetails}>
                    {promptDetails && promptDetails.message}
                </PromptContent>
            }
        </Prompt>;
    }
}

ModalContainer.propTypes = {
    workflow: PropTypes.object,
    userConfig: PropTypes.object.isRequired,
    promptProps: PropTypes.object.isRequired
};

export default ModalContainer;
