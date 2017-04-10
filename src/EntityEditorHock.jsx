/* @flow */

import React, {Component, PropTypes} from 'react';
import {Map} from 'immutable';
import WorkflowHock from './workflow/WorkflowHock';
import PromptContainer from './prompt/PromptContainer';
import {EntityEditorConfig} from './config/EntityEditorConfig';
import {returnPromise} from './Utils';

type PropNames = {
    entityEditor?: string,
    entityEditorRoutes?: string
};

type EntityEditorHockOptions = {
    config: EntityEditorConfig,
    operationProps: Function,
    propNames?: PropNames
};

export default (options: EntityEditorHockOptions): Function => {
    const userConfig: EntityEditorConfig = options.config;
    const additionalOperationProps: Function = options.operationProps
        ? options.operationProps
        : () => {};

    const entityEditorProp: string = (options.propNames && options.propNames.entityEditor) || "entityEditor";

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

                const originalOperations: Map<string, Function> = userConfig.get('operations');
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
                    .then(this.onOperationSuccess(actionProps), this.onOperationError(actionProps));
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

            onOperationSuccess({onSuccess}): any {
                return (result) => {
                    if(!this.componentIsMounted) {
                        return;
                    }
                    onSuccess && onSuccess(result);
                    return this.props.workflow.next("onSuccess", this.props.workflow.end);
                }
            }

            onOperationError({onError}): any {
                return (result) => {
                    if(!this.componentIsMounted) {
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
                    throw new Error(`EntityEditor error: A workflow must be defined on the config object for ${actionName}`);
                }
                this.props.workflow.start(workflow.toJS(), actionName, {actionProps});
            }

            getCurrentTask(props: ?Object = this.props): ?Object {
                return userConfig.getIn(['tasks', props.workflow.task]);
            }

            isCurrentTaskBlocking(props: ?Object = this.props): boolean {
                const currentTask: ?Object = this.getCurrentTask(props);
                return !!currentTask && !!currentTask.get('operate');
            }

            /*
             * prop calculation
             */

            entityEditorProps(statusProps: Object): Object {
                const actions: Object = userConfig
                    .get('actions', Map())
                    .map((actionConfig: Object, actionName: string) => (actionProps: Object) => {
                        if(!this.isCurrentTaskBlocking()) {
                            this.workflowStart(actionName, actionConfig, actionProps);
                        }
                    })
                    .toJS();

                const currentWorkflow: ?Object = this.getCurrentTask();
                const statusAsProps: boolean = !!currentWorkflow
                    && currentWorkflow.get('status')
                    && currentWorkflow.get('statusOutput') == "props";

                const status: ?Object = statusAsProps && currentWorkflow
                    ? currentWorkflow.get('status')(statusProps)
                    : null;

                var props: Object = {
                    actions,
                    status
                };

                return props;
            }

            /*
             * render
             */

            render() {
                const {workflow} = this.props;
                const statusProps: Object = {
                    editorState: this.getEditorState(),
                    ...userConfig.itemNames()
                };

                const props: Object = {
                    ...this.props,
                    [entityEditorProp]: this.entityEditorProps(statusProps)
                };

                return <div>
                    <ComposedComponent
                        {...props}
                    />
                    <PromptContainer
                        workflow={workflow}
                        userConfig={userConfig}
                        statusProps={statusProps}
                    />
                </div>;
            }
        }

        const withWorkflowHock: Function = WorkflowHock();
        return withWorkflowHock(EntityEditorHock);
    }
};
