/* @flow */

import React, {Component, PropTypes} from 'react';
import {Map} from 'immutable';
import WorkflowHock from './workflow/WorkflowHock';
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
            promptOnYes: Function;
            promptOnNo: Function;
            componentIsMounted: boolean;

            constructor(props: Object): void {
                super(props);
                this.componentIsMounted = false;
                this.state = {
                    dirty: false,
                    pending: {}
                };
                this.onOperationSuccess = this.onOperationSuccess.bind(this);
                this.onOperationError = this.onOperationError.bind(this);
                this.promptOnYes = this.promptOnYes.bind(this);
                this.promptOnNo = this.promptOnNo.bind(this);
            }

            /*
             * React lifecycle
             */

            componentWillMount() {
                this.componentIsMounted = true;
            }

            componentWillReceiveProps(nextProps: Object): void {
                const {task, name, end} = nextProps.workflow;
                const workflowTask: ?Map<string, any> = userConfig.getWorkflowTask(task, name);

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

                    // if a task type has something to do onEnter, do it here...
                    const taskType: string = workflowTask.get('type');
                    if(taskType == "operate") {
                        const taskFunction: Function = workflowTask.get('operate');
                        this.operate(taskFunction, nextProps.workflow, nextProps);
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
             * pending
             */

             // TODO FIX THIS

            getPending(id: string, actionName: string): boolean {
                return !!this.state.pending[`${id}|${actionName}`];
            }

            setPending(id: string, actionName: string, pending: boolean): void {
                this.setState({
                    pending: Object.assign(
                        {},
                        this.state.pending,
                        {[`${id}|${actionName}`]: pending
                    })
                });
            }

            pendingProps(config: EntityEditorConfig): Function {
                return (id: string) => {
                    return config
                        .get('actions')
                        .map((action, actionName) => this.getPending(id, actionName))
                        .toObject();
                };
            }

            /*
             * operate
             */

            operate(operateFunction: Function, nextWorkflow: Object, props: Object) {
                if(typeof operateFunction != "function") {
                    throw new Error(`Entity Editor: task of type "operate" must be a function`);
                }

                const originalOperations: Map<string, Function> = userConfig.get('operations');
                const partiallyAppliedOperations: Map<string, Function> = this.partiallyApplyOperations(originalOperations, props);

                const {actionProps} = nextWorkflow.meta;

                // TODO ambigious duplocate function call!
                const partiallyAppliedOperateFunction: Function = operateFunction({
                    operations: partiallyAppliedOperations.toObject(),
                    editorState: this.getEditorState()
                });

                // TODO - do we force people to use the onSuccess and onError callbacks provided?
                // or use returnPromise and allow promises and booleans normally?

                returnPromise(partiallyAppliedOperateFunction(actionProps))
                    .then(this.onOperationSuccess(actionProps), this.onOperationError(actionProps));
            }

            partiallyApplyOperations(operations: Map<string,Function>, props: Object): Map<string,Function> {
                // create mutable operations object with the aim of passing a reference to it into each partial application
                var mutableOperations: Object = {};

                operations.forEach((operation: Function, key: string) => {

                    // create operationsProps object to be passed into the first operation function
                    // it will contain a reference to mutableOperations which will be updated each iteration
                    const operationProps: Object = Map({
                        ...additionalOperationProps(props),
                        operations: mutableOperations,
                        setEditorState: this.setEditorState() // TODO is this named correctly?
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
             * prompts
             */

            renderPrompt() {
                const {task, name} = this.props.workflow;
                const workflowTask: ?Object = userConfig.getWorkflowTask(task, name);
                const promptOpen: boolean = !!workflowTask && workflowTask.get('type') == "prompt";
                const prompt: ?Function = promptOpen && workflowTask ? workflowTask.get('prompt') : null;
                var promptDetails: ?Object = null;

                if(prompt) {
                    const promptProps: Object = {
                        editorState: this.getEditorState(),
                        ...userConfig.itemNames()
                    };
                    promptDetails = prompt(promptProps);
                }

                const Prompt: ReactClass<any> = userConfig.getIn(['components', 'prompt']);
                const PromptContent: ReactClass<any>  = userConfig.getIn(['components', 'promptContent']);

                return <Prompt
                    {...promptDetails}
                    open={promptOpen}
                    onYes={this.promptOnYes}
                    onNo={this.promptOnNo}
                >
                    {prompt &&
                        <PromptContent {...promptDetails}>
                            {promptDetails && promptDetails.message}
                        </PromptContent>
                    }
                </Prompt>
            }

            promptOnYes(): void {
                this.props.workflow.next("onYes", this.props.workflow.end);
            }

            promptOnNo(): void {
                this.props.workflow.next("onNo", this.props.workflow.end);
            }

            /*
             * prop calculation
             */

            entityEditorProps(): Object {
                const config = userConfig;

                // wrap each of the actions in prompts so they can handle confirmation, success and error
                // also preload action props with their ids if required (such as with EntityEditorItem)

                const actions: Object = userConfig
                    .get('actions', Map())
                    .map((actionConfig: Object, actionName: string) => (actionProps: Object) => {
                        //console.log(actionConfig);
                        //this.operation();
                        // THIS SHIT NEEDS TO HAPPEN IN COMPONENT WILL RECEIVE PROPS
                        this.workflowStart(actionName, actionConfig, actionProps);
                    })
                    .toJS();

                const prompt: Object = {};

                // pending actions
                var props: Object = {
                    actions,
                    prompt,
                    pending: {} // TODOthis.pendingProps(config)
                };

                return props;
            }

            /*
             * render
             */

            render() {
                const props: Object = {
                    ...this.props,
                    [entityEditorProp]: this.entityEditorProps()
                };

                return <div>
                    <ComposedComponent {...props} />
                    {this.renderPrompt()}
                </div>;
            }
        }

        const withWorkflowHock: Function = WorkflowHock();
        return withWorkflowHock(EntityEditorHock);
    }
};
