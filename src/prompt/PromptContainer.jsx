/* @flow */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Map} from 'immutable';

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

        const configPromptProps: Object = config
            .getIn(['prompt', 'props'], Map())
            .toObject();

        const configPromptContentProps: Object = config
            .getIn(['promptContent', 'props'], Map())
            .toObject();

        var promptDetails: Object = {};
        if(promptOpen && workflowTask) {
            promptDetails = workflowTask.get('status')(promptProps);
        }

        const Prompt: ReactClass<any> = config.getIn(['prompt', 'component']);
        const PromptContent: ReactClass<any> = config.getIn(['promptContent', 'component']);

        return <Prompt
            {...configPromptProps}
            {...promptDetails}
            open={promptOpen}
            onYes={this.promptOnYes}
            onNo={this.promptOnNo}
        >
            {promptDetails &&
                <PromptContent
                    {...configPromptContentProps}
                    {...promptDetails}
                    children={promptDetails && promptDetails.message}
                />
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
