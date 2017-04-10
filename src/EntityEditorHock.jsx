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
                const {task, end} = nextProps.workflow;
                const workflowTask: ?Map<string, any> = userConfig.getIn(['tasks', task]);

                // if changing to a new task...
                if(workflowTask && this.props.workflow.task !== nextProps.workflow.task) {

                    // if skip() exists for this task and returns a string, then go there
                    const skip: Function = workflowTask.get('skip');
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
                    const taskFunction: Function = workflowTask.get('operate');
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
                    throw new Error(`Entity Editor: task of type "operate" must be a function`);
                }

                const originalOperations: Map<string, Function> = userConfig.get('operations');
                const partiallyAppliedOperations: Map<string, Function> = this.partiallyApplyOperations(originalOperations, props);

                const nextWorkflow = props.workflow;
                const {actionProps} = nextWorkflow.meta;

                // TODO ambigious duplicate function call!
                const partiallyAppliedOperateFunction: Function = operateFunction({
                    operations: partiallyAppliedOperations.toObject(),
                    editorState: this.getEditorState()
                });

                returnPromise(partiallyAppliedOperateFunction(actionProps))
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

            /*
             * prop calculation
             */

            entityEditorProps(promptProps: Object): Object {
                const {workflow} = this.props;

                const actions: Object = userConfig
                    .get('actions', Map())
                    .map((actionConfig: Object, actionName: string) => (actionProps: Object) => {
                        // TODO get workflow as of right now!
                        this.workflowStart(actionName, actionConfig, actionProps);
                    })
                    .toJS();

                const workflowTask: ?Object = userConfig.getIn(['tasks', workflow.task]);
                const promptAsProps: boolean = !!workflowTask
                    && workflowTask.get('status')
                    && workflowTask.get('statusStyle') == "props";

                const prompt: ?Object = promptAsProps && workflowTask
                    ? workflowTask.get('status')(promptProps)
                    : null;

                var props: Object = {
                    actions,
                    prompt
                };

                return props;
            }

            /*
             * render
             */

            render() {
                const {workflow} = this.props;
                const promptProps: Object = {
                    editorState: this.getEditorState(),
                    ...userConfig.itemNames()
                };

                const props: Object = {
                    ...this.props,
                    [entityEditorProp]: this.entityEditorProps(promptProps)
                };

                return <div>
                    <ComposedComponent
                        {...props}
                    />
                    <PromptContainer
                        workflow={workflow}
                        userConfig={userConfig}
                        promptProps={promptProps}
                    />
                </div>;
            }
        }

        const withWorkflowHock: Function = WorkflowHock();
        return withWorkflowHock(EntityEditorHock);
    }
};
