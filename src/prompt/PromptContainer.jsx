/* @flow */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

class PromptContainer extends Component {

    promptOnYes: Function;
    promptOnNo: Function;

    constructor(props: Object) {
        super(props);
        this.promptOnYes = this.promptOnYes.bind(this);
        this.promptOnNo = this.promptOnNo.bind(this);
    }

    promptOnYes() {
        this.props.workflow.next("onYes", this.props.workflow.end);
    }

    promptOnNo() {
        this.props.workflow.next("onNo", this.props.workflow.end);
    }

    render(): React.Element<any> {
        const {
            config,
            workflow: {
                task
            },
            promptProps
        } = this.props;


        const workflowTask: ?Object =  config.getIn(['tasks', task]);
        const promptOpen: boolean = !!workflowTask
            && workflowTask.get('status')
            && workflowTask.get('statusOutput') == "prompt";

        var promptDetails: ?Object = null;

        if(promptOpen && workflowTask) {
            promptDetails = workflowTask.get('status')(promptProps);
        }

        const Prompt: ReactClass<any> = config.getIn(['components', 'prompt']);
        const PromptContent: ReactClass<any> = config.getIn(['components', 'promptContent']);

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

PromptContainer.propTypes = {
    workflow: PropTypes.object,
    config: PropTypes.object.isRequired,
    promptProps: PropTypes.object.isRequired,
    blocking: PropTypes.bool
};

export default PromptContainer;
