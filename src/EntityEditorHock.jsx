/* @flow */

import React, {Component, PropTypes} from 'react';
import {Map} from 'immutable';
import WorkflowHock from './workflow/WorkflowHock';
import PromptContainer from './prompt/PromptContainer';
import {EntityEditorConfig} from './config/EntityEditorConfig';
import {returnPromise} from './utils/Utils';

export default (config: EntityEditorConfig): Function => {
    const additionalOperationProps: Function = config.get('operationProps', () => {});

    return (ComposedComponent: ReactClass<any>): ReactClass<any> => {

        class EntityEditorHock extends Component {

            state: Object;
            onOperationSuccess: Function;
            onOperationError: Function;
            componentIsMounted: boolean;

            constructor(props: Object): void {
                super(props);
                this.componentIsMounted = false;
                this.state = {
                    dirty: false
                };
                this.onOperationSuccess = this.onOperationSuccess.bind(this);
                this.onOperationError = this.onOperationError.bind(this);
            }

            /*
             * React lifecycle
             */

            componentWillMount() {
                this.componentIsMounted = true;
            }

            componentWillReceiveProps(nextProps: Object): void {
                const currentTask: ?Map<string, any> = this.getCurrentTask(nextProps);
                const {end} = nextProps.workflow;

                // if changing to a new task...
                if(currentTask && this.props.workflow.task !== nextProps.workflow.task) {

                    // if skip() exists for this task and returns a string, then go there
                    const skip: Function = currentTask.get('skip');
                    if(skip) {
                        const skipProps: Object = {
                            editorState: this.getEditorState()
                        };
                        const skipTo: ?string = skip(skipProps);
                        if(skipTo && typeof skipTo == "string") {
                            this.props.workflow.next(skipTo, end);
                            return;
                        }
                    }

                    // if a task has something to do when new task is entered do it here...
                    const taskFunction: Function = currentTask.get('operate');
                    if(taskFunction) {
                        this.operate(taskFunction, nextProps);
                    }
                }
            }

            componentWillUnmount() {
                this.componentIsMounted = false;
            }

            /*
             * editor state
             */

            getEditorState(): Object {
                return {
                    dirty: this.state.dirty
                };
            }

            setEditorState(): Object {
                return {
                    dirty: (dirty) => {
                        if(this.state.dirty != dirty) {
                            this.setState({dirty});
                        }
                    }
                };
            }

            /*
             * operate
             */

            operate(operateFunction: Function, props: Object) {
                if(typeof operateFunction != "function") {
                    throw new Error(`Entity Editor: "task.operate" must be a function`);
                }

                const originalOperations: Map<string, Function> = config.get('operations');
                const partiallyAppliedOperations: Map<string, Function> = this.partiallyApplyOperations(originalOperations, props);

                const nextWorkflow = props.workflow;
                const {actionProps} = nextWorkflow.meta;

                // create operateProps object to be passed into operate() on a task
                const operateProps: Object = Map({
                    operations: partiallyAppliedOperations.toObject()
                })
                    .filter(ii => ii)
                    .toObject();

                const partiallyAppliedOperateFunction: Function = operateFunction(operateProps);
                if(typeof partiallyAppliedOperateFunction != "function") {
                    throw new Error(`Entity Editor: "task.operate" must return a function`);
                }

                const result: Promiseable = partiallyAppliedOperateFunction(actionProps);
                returnPromise(result)
                    .then(this.onOperationSuccess(actionProps, nextWorkflow), this.onOperationError(actionProps, nextWorkflow));
            }

            partiallyApplyOperations(operations: Map<string,Function>, props: Object): Map<string,Function> {
                // create mutable operations object with the aim of passing a reference to it into each partial application
                var mutableOperations: Object = {};

                // get additional operations props passed through config, and make them all return promises
                const additional: Object = Map(additionalOperationProps(props))
                    .map(fn => (...args) => returnPromise(fn(...args)))
                    .toObject();

                operations.forEach((operation: Function, key: string) => {

                    // create operationsProps object to be passed into the first operation function
                    // it will contain a reference to mutableOperations which will be updated each iteration
                    const operationProps: Object = Map({
                        ...additional,
                        operations: mutableOperations,
                        setEditorState: this.setEditorState()
                    })
                        .filter(ii => ii)
                        .toObject();

                    // partially apply the callbacks so they have knowledge of the full set of callbacks and any other config they're allowed to receive
                    const partialOperation: Function = operation(operationProps);

                    // if not a function then this callback hasn't been set up correctly, error out
                    if(typeof partialOperation != "function") {
                        throw `Entity Editor: callback "${key} must be a function that returns a 'callback' function, such as (config) => (callbackProps) => { /* return null, promise or false */ }"`;
                    }

                    // wrap partialOperation in a function that forces the callback to always return a promise
                    mutableOperations[key] =  (...args): Promise<*> => returnPromise(partialOperation(...args));
                });

                return Map(mutableOperations);
            }

            onOperationSuccess({onSuccess}, nextWorkflow): any {
                return (result) => {
                    if(!this.componentIsMounted || this.props.workflow.name != nextWorkflow.name) {
                        return;
                    }
                    onSuccess && onSuccess(result);
                    return this.props.workflow.next("onSuccess", this.props.workflow.end);
                }
            }

            onOperationError({onError}, nextWorkflow): any {
                return (result) => {
                    if(!this.componentIsMounted || this.props.workflow.name != nextWorkflow.name) {
                        return;
                    }
                    onError && onError(result);
                    return this.props.workflow.next("onError", this.props.workflow.end);
                }
            }

            /*
             * workflow
             */

            workflowStart(actionName: string, actionConfig: Object, actionProps: Object = {}): void {
                const workflow: Object = actionConfig.get('workflow');
                if(!workflow) {
                    throw new Error(`Entity Editor: A workflow must be defined on the config object for ${actionName}`);
                }
                this.props.workflow.start(workflow.toJS(), actionName, {actionProps});
            }

            getCurrentTask(props: ?Object = this.props): ?Object {
                return config.getIn(['tasks', props.workflow.task]);
            }

            isCurrentTaskBlocking(props: ?Object = this.props): boolean {
                const currentTask: ?Object = this.getCurrentTask(props);
                if(!currentTask) {
                    return false;
                }
                return currentTask.get('blocking',  !!currentTask.get('operate'));
            }

            /*
             * prop calculation
             */

            entityEditorProps(statusProps: Object): Object {

                // actions

                const actions: Object<Function> = config
                    .get('actions', Map())
                    .map((actionConfig: Object, actionName: string) => (actionProps: Object) => {
                        //setTimeout(() => {
                            if(!this.isCurrentTaskBlocking()) {
                                this.workflowStart(actionName, actionConfig, actionProps);
                            } else {
                                const {name, task} = this.props.workflow;
                                console.warn(`Entity Editor: cannot start new "${actionName}" action while "${name}" action is blocking with task "${task}".`);
                            }
                        //}, 10);
                    })
                    .toObject();

                // abilities

                // for now this returns the same result for all action names
                // and is structured like this to prevent changing the API if more granular abilities are added

                const abilities: Object = config
                    .get('actions', Map())
                    .map((actionConfig: Object, actionName: string) => !this.isCurrentTaskBlocking())
                    .toObject();

                // status

                const currentWorkflow: ?Object = this.getCurrentTask();
                const statusAsProps: boolean = !!currentWorkflow
                    && currentWorkflow.get('status')
                    && currentWorkflow.get('statusOutput') == "props";

                var status: ?Object = null;
                if(statusAsProps && currentWorkflow) {
                    status = currentWorkflow.get('status')(statusProps);
                    status.action = this.props.workflow.name;
                    status.task = this.props.workflow.task;
                }

                return {
                    actions,
                    abilities,
                    status
                };
            }

            /*
             * render
             */

            render() {
                const {workflow} = this.props;
                const statusProps: Object = {
                    editorState: this.getEditorState(),
                    ...config.itemNames()
                };

                return <div>
                    <ComposedComponent
                        {...this.props}
                        entityEditor={this.entityEditorProps(statusProps)}
                    />
                    <PromptContainer
                        workflow={workflow}
                        config={config}
                        promptProps={statusProps}
                        blocking={this.isCurrentTaskBlocking()}
                    />
                </div>;
            }
        }

        const withWorkflowHock: Function = WorkflowHock();
        return withWorkflowHock(EntityEditorHock);
    }
};
