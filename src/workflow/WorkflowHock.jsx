/* @flow */

import React, {Component} from 'react';

export default (): Function => {
    return (ComposedComponent): ReactClass<any> => {

        class WorkflowDecorator extends Component {

            state: Object;

            constructor(props) {
                super(props);
                this.state = {
                    workflow: null,
                    step: null,
                    nextSteps: null
                };

                this.setWorkflow = this.setWorkflow.bind(this);
            }

            setWorkflow(options: Object): void {
                const {workflow, step, nextSteps} = options;
                this.setState({
                    workflow,
                    step,
                    nextSteps
                });
            }

            render(): React.Element<any> {
                const {workflow, step, nextSteps} = this.state;
                return <ComposedComponent
                    {...this.props}
                    workflow={workflow}
                    step={step}
                    nextSteps={nextSteps || {}}
                    setWorkflow={this.setWorkflow}
                />;
            }
        }

        return WorkflowDecorator;
    }
};
