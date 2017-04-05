/* @flow */

import React, {Component} from 'react';

export default (): Function => {
    return (ComposedComponent): ReactClass<any> => {

        class WorkflowDecorator extends Component {

            // keep flow happy by specifying members mentioned in constructor
            state: Object;
            workflowStart: Function;
            workflowNext: Function;
            workflowEnd: Function;

            constructor(props) {
                super(props);
                this.state = {
                    workflow: null,
                    name: null
                };

                this.workflowStart = this.workflowStart.bind(this);
                this.workflowNext = this.workflowNext.bind(this);
                this.workflowEnd = this.workflowEnd.bind(this);
            }

            workflowSet(options: Object): void {
                const {workflow, name} = options;
                this.setState({
                    workflow,
                    name
                });
            }

            workflowStart(workflow: Object, name: string): void {
                this.workflowSet({
                    workflow,
                    name
                });
            }

            workflowNext(nextStep: string): void {
                if(nextStep == "task") {
                    throw new Error(`Entity Editor error: "task" is not a valid nextStep.`);
                }
                if(!this.state.workflow.hasOwnProperty(nextStep)) {
                    throw new Error(`Entity Editor error: "${nextStep}" is not a valid nextStep for the current workflow.`);
                }
                this.workflowSet({
                    workflow: this.state.workflow[nextStep]
                });
            }

            workflowEnd(): void {
                this.workflowSet({});
            }

            render(): React.Element<any> {
                const {workflow, name} = this.state;
                const task = workflow ? workflow.task : null;

                var nextSteps = Object.assign({}, workflow);
                delete nextSteps.task;

                return <ComposedComponent
                    {...this.props}
                    workflow={{
                        name,
                        task,
                        nextSteps,
                        start: this.workflowStart,
                        next: this.workflowNext,
                        end: this.workflowEnd
                    }}
                />;
            }
        }

        return WorkflowDecorator;
    }
};
