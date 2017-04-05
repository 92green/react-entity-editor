/* @flow */

import React, {Component, PropTypes} from 'react';
import {fromJS, Map, List} from 'immutable';
import WorkflowHock from './workflow/WorkflowHock';
import {EntityEditorConfig} from './config/EntityEditorConfig';
import {returnPromise} from './Utils';

type PropNames = {
    entityEditor?: string,
    entityEditorRoutes?: string
};

type EntityEditorHockOptions = {
    config: EntityEditorConfig,
    preloadActionIds?: Function,
    propNames?: PropNames
};

export default (options: EntityEditorHockOptions): Function => {
    const {
        config: userConfig,
        preloadActionIds,
        propNames = {}
    } = options;

    const entityEditorProp = propNames.entityEditor || "entityEditor";
    const entityEditorRoutesProp = propNames.entityEditorRoutes || "entityEditorRoutes";

    return (ComposedComponent: ReactClass<any>): ReactClass<any> => {

        class EntityEditorHock extends Component {

            state: Object;

            constructor(props: Object): void {
                super(props);
                this.state = {
                    dirty: false,
                    /*prompt: null,
                    promptOpen: false,*/
                    pending: {}
                };
            }

            /*componentWillMount() {
                const {
                    entityEditorRoutes: {
                        onLeaveHook
                    }
                } = this.context;

                if(onLeaveHook) {
                    onLeaveHook((a,b) => {
                        if(this.allowLeave) {
                            return true;
                        }
                        try a generic "go" action
                        return false;
                    });
                }
            }*/

            componentWillReceiveProps(nextProps: Object): void {
                const {task, name} = nextProps.workflow;
                if(nextProps.workflow.task == "operation") {
                    const taskFunction: Function = this.getWorkflowTask(task, name);
                    if(typeof taskFunction != "function") {
                        throw new Error(`Entity Editor: task of type "operation" must be a function`);
                    }
                    console.log("OPERATION!", taskFunction);
                }
            }

            componentWillUnmount(): void {
                //this.closePrompt();
            }

            /*shouldComponentUpdate(nextProps: Object, nextState: Object): boolean {
                return fromJS(this.props).equals(fromJS(nextProps))
                    || fromJS(this.state).equals(fromJS(nextState));
            }*/

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

            getConfig(): EntityEditorConfig {
                return userConfig.merge(this.context.entityEditorRoutes.config);
            }

            /*openPrompt(prompt: Object): void {
                this.setState({
                    prompt,
                    promptOpen: true
                });
            }

            closePrompt() {
                const{
                    prompt,
                    promptOpen
                } = this.state;

                if(!prompt || !promptOpen) {
                    return;
                }

                this.setState({
                    promptOpen: false
                });
            }*/

            getPromptPromise(config: EntityEditorConfig, type: string, actionName: string, payload: Object): Promise<*> {
                var prompt: ?Object = config.prompt(actionName, type, this.getEditorState());
                if(!prompt) {
                    return new Promise(resolve => resolve(payload));
                }

                return new Promise((resolve, reject) => {
                    prompt.onYes = () => resolve(payload);
                    prompt.onNo = () => reject(payload);
                    prompt.payload = payload;
                    this.openPrompt(prompt);
                });
            }

            wrapActionWithPrompts(config: EntityEditorConfig, action: Function, actionName: string, actionProps: Object): Function {

                // partially apply actions, giving it a subset of config (at this point only operations are provided)
                const partialAction: Function = action({
                    operations: config.partiallyApplyOperations({
                        setEditorState: this.setEditorState()
                    })
                });

                if(typeof partialAction != "function") {
                    throw `Entity Editor: action "${actionName} must be a function that returns an action function, such as (config) => (actionProps) => { /* return null, promise or false */ }"`;
                }

                const getSuccessAction: Function = (config: EntityEditorConfig, actionName: string): Function => {
                    return (...args) => {};

                    /*
                    return (result) => {
                        var successAction = config.getIn(['successActions', actionName]);

                        // use default successAction if none explicitly provided
                        // which will call operations.after<ACTIONNAME> if it exists
                        if(!successAction) {
                            successAction = ({operations}) => (successActionProps) => {
                                const after = `after${actionName.charAt(0).toUpperCase()}${actionName.slice(1)}`;
                                operations[after] && operations[after](successActionProps);
                                return successActionProps;
                            };
                        }

                        const partialSuccessAction = successAction(config);
                        if(typeof partialSuccessAction != "function") {
                            throw `Entity Editor: successAction "${actionName} must be a function that returns a successAction function, such as (config) => (successActionProps) => {}"`;
                        }
                        return returnPromise(partialSuccessAction(result));
                    };*/
                };

                // create promises for onConfirm, onSuccess and onError, and simply pass through where they don't exist
                const {
                    onConfirm,
                    onSuccess,
                    onError
                } = actionProps;

                const callOnConfirm: Function = (actionProps) => {
                    onConfirm && onConfirm(actionProps);
                    return actionProps;
                };

                const beginPending: Function = (actionProps) => {
                    if(!config.getIn(['excludePending', actionName])) {
                        this.setPending(actionProps.id, actionName, true);
                    }
                    return actionProps;
                }

                const endPendingSuccess: Function = (result) => {
                    if(!config.getIn(['excludePending', actionName])) {
                        this.setPending(actionProps.id, actionName, false);
                    }
                    return result;
                };

                const endPendingError: Function = (result) => {
                    this.setPending(actionProps.id, actionName, false);
                    throw result;
                };

                const callOnSuccess: Function = (result) => {
                    onSuccess && onSuccess(result);
                    return result;
                };

                const callOnError: Function = (result) => {
                    onError && onError(result);
                    throw result;
                };

                const doNothing: Function = () => {};

                const doSuccessAction: Function = getSuccessAction(config, actionName);

                const showSuccessPrompt: Function = (result) => {
                    return this.getPromptPromise(config, 'success', actionName, result)
                        .then(doSuccessAction, doSuccessAction);
                };

                const showErrorPrompt: Function = (result) => {
                    console.error(result);
                    return this.getPromptPromise(config, 'error', actionName, result)
                        .then(doNothing, doNothing);
                };

                // show confirmation prompt (if exists)
                this.getPromptPromise(config, 'confirm', actionName, actionProps)
                    .then(callOnConfirm)
                    .then(beginPending)
                    .then(
                        (actionProps) => {
                            // perform action and continue promise chain
                            return returnPromise(partialAction(actionProps))
                                .then(endPendingSuccess, endPendingError)
                                .then(callOnSuccess, callOnError)
                                .then(showSuccessPrompt, showErrorPrompt);
                        },
                        doNothing
                    );
            }

            pendingProps(config: EntityEditorConfig): Function {
                return (id: string) => {
                    return config
                        .get('actions')
                        .map((action, actionName) => this.getPending(id, actionName))
                        .toObject();
                };
            }

            getWorkflowTask(task, name): any {
                task = task || this.props.workflow.task;
                name = name || this.props.workflow.name;
                return this.getConfig().getIn(['actions', name, 'tasks', task]);
            }

            workflowStart(actionName: string, actionConfig: Object): void {
                const workflow: Object = actionConfig.get('workflow');
                if(!workflow) {
                    throw new Error(`EntityEditor error: A workflow must be defined on the config object for ${actionName}`);
                }
                this.props.workflow.start(workflow.toJS(), actionName);
            }

            workflowNext(nextTask: string): void {
                this.props.workflow.next(nextTask);
            }

            workflowEnd(): void {
                this.props.workflow.end();
            }

            entityEditorProps(): Object {
                const config = this.getConfig();
                const preloadedActionId: ?string = preloadActionIds && preloadActionIds(this.props);

                // wrap each of the actions in prompts so they can handle confirmation, success and error
                // also preload action props with their ids if required (such as with EntityEditorItem)

                const actions: Object = this.getConfig()
                    .get('actions', Map())
                    .map((actionConfig: Object, actionName: string) => (actionProps: Object) => {
                        if(preloadActionIds) {
                            actionProps.id = preloadedActionId;
                        }

                        this.workflowStart(actionName, actionConfig);
                        /*

                        return (...args) => {
                            console.log(actionName, "!!!", args);
                        };

                        /*
                        return this.wrapActionWithPrompts(
                            config,
                            action,
                            actionName,
                            actionProps
                        );*/
                    })
                    .toJS();



                // pending actions
                var props: Object = {
                    actions,
                    //state,
                    pending: this.pendingProps(config)
                };

                if(preloadActionIds) {
                    props.pending = props.pending(preloadedActionId);
                }

                const {
                    prompt,
                    promptOpen
                } = this.state;

                if(promptOpen && prompt && prompt.asProps) {
                    props.prompt = Object.assign({}, prompt);
                }

                return props;
            }

            renderPrompt() {
                const config = this.getConfig();
                const {nextSteps} = this.props.workflow;

                const workflowTask: ?Object = this.getWorkflowTask();
                const promptOpen: boolean = workflowTask && workflowTask.get('type') == "prompt";
                const prompt: ?Function = promptOpen ? workflowTask.get('prompt') : null;
                var promptDetails: ?Object = null;

                if(prompt) {
                    promptDetails = prompt({item: "???", Item: "???"});
                }

                const Prompt: ReactClass<any> = config.getIn(['components', 'prompt']);
                const PromptContent: ReactClass<any>  = config.getIn(['components', 'promptContent']);

                console.log('nextSteps', nextSteps);

                const onYes = () => {
                    this.workflowNext("onYes");
                };

                const onNo = () => {
                    this.workflowEnd();
                };



                return <Prompt
                    {...promptDetails}
                    open={promptOpen}
                    onYes={onYes}
                    onNo={onNo}
                >
                    {prompt &&
                        <PromptContent {...promptDetails}>
                            {promptDetails && promptDetails.message}
                        </PromptContent>
                    }
                </Prompt>
            }

            render() {
                const props: Object = {
                    ...this.props,
                    [entityEditorProp]: this.entityEditorProps(),
                    [entityEditorRoutesProp]: this.context.entityEditorRoutes.props
                };

                return <div>
                    <ComposedComponent {...props} />
                    {this.renderPrompt()}
                </div>;
            }
        }

        EntityEditorHock.contextTypes = {
            entityEditorRoutes: PropTypes.object
        };

        const withWorkflowHock: Function = WorkflowHock();
        return withWorkflowHock(EntityEditorHock);
    }
};
