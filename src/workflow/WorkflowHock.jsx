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
                    name: null,
                    meta: null
                };

                this.workflowStart = this.workflowStart.bind(this);
                this.workflowNext = this.workflowNext.bind(this);
                this.workflowEnd = this.workflowEnd.bind(this);
            }

            /*
             * workflow
             */

            workflowSet(options: Object): void {
                const {workflow, name, meta} = options;
                this.setState({
                    workflow,
                    name,
                    meta
                });
            }

            workflowStart(workflow: Object, name: string, meta: Object = {}): void {
                this.workflowSet({
                    workflow,
                    name,
                    meta
                });
            }

            workflowNext(nextStep: string, fallback: ?Function): void {
                const {workflow} = this.state;
                if(!workflow || !workflow.next) {
                    if(fallback) {
                        fallback(nextStep);
                        return;
                    }
                    throw new Error(`Entity Editor error: cannot go to next step, "${this.state.name}" does not have a "next" object.`);
                }

                if(!workflow.next.hasOwnProperty(nextStep)) {
                    if(fallback) {
                        fallback(nextStep);
                        return;
                    }
                    throw new Error(`Entity Editor error: "${nextStep}" is not a valid nextStep, and no fallback is provided.`);
                }

                this.workflowSet({
                    workflow: workflow.next[nextStep],
                    name: this.state.name,
                    meta: this.state.meta
                });
            }

            workflowEnd(): void {
                this.workflowSet({});
            }

            /*
             * render
             */

            render(): React.Element<any> {
                const {workflow, name, meta} = this.state;
                const task = workflow ? workflow.task : null;
                const next = workflow ? workflow.next : null;

                return <ComposedComponent
                    {...this.props}
                    workflow={{
                        name,
                        meta: meta || {},
                        task,
                        nextSteps: next,
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
