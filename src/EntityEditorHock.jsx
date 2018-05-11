/* @flow */

import React from 'react';
import type {ComponentType, Element} from 'react';
import PropTypes from 'prop-types';
import {Map} from 'immutable';
import Workflow from './Workflow';
import {EntityEditorConfig} from './config/EntityEditorConfig';
import {returnPromise} from './utils/Utils';

type Props = {
    entityEditorState: Object
};

type ChildProps = {
    entityEditor: Object
};

export default (config: EntityEditorConfig): Function => {
    const selectedOperationProps: Function = config.get('operationProps');

    return (Component: ComponentType<Props>): ComponentType<ChildProps> => {

        return class EntityEditorHock extends React.Component {

            static propTypes = {
                entityEditorState: PropTypes.object.isRequired
            };

            onOperationSuccess: Function;
            onOperationError: Function;
            setEditorState: Function;
            componentIsMounted: boolean;
            continueRouteChange: ?Function;

            constructor(props: Object) {
                super(props);
                this.componentIsMounted = false;
                this.nextProps = props;
            }

            /*
             * React lifecycle
             */

            componentWillMount() {
                this.componentIsMounted = true;
                this.nextProps = this.props;
                config.getIn(['lifecycleMethods', 'componentWillMount'], Map())
                    .forEach(fn => fn(this, config));

                this.startTask(this.props);
            }

            componentDidMount() {
                config.getIn(['lifecycleMethods', 'componentDidMount'], Map())
                    .forEach(fn => fn(this, config));
            }

            componentWillReceiveProps(nextProps: Object) {
                this.nextProps = nextProps;
                let thisWorkflow = this.getWorkflow(this.props);
                let nextWorkflow = this.getWorkflow(nextProps);

                // if changing to a new task...
                if(thisWorkflow.get('task') !== nextWorkflow.get('task')) {
                    this.startTask(nextProps);
                }

                config.getIn(['lifecycleMethods', 'componentWillReceiveProps'], Map())
                    .forEach(fn => fn(this, config, nextProps));
            }

            componentWillUnmount() {
                this.componentIsMounted = false;
                config.getIn(['lifecycleMethods', 'componentWillUnmount'], Map())
                    .forEach(fn => fn(this, config));
            }

            startTask = (props: Object) => {
                const currentTask: ?Map<string, any> = this.getCurrentTask(props);
                if(!currentTask) {
                    return;
                }

                // if skip() exists for this task and returns a string, then go there
                const skip: Function = currentTask.get('skip');

                if(skip) {
                    const skipProps: Object = {
                        editorState: this.getState(props).editor
                    };
                    const skipTo: ?string = skip(skipProps);
                    if(skipTo && typeof skipTo == "string") {
                        this.getWorkflow(props).next(skipTo);
                        return;
                    }
                }

                // if a task has something to do when new task is entered do it here...
                const operationName: string = currentTask.get('operation');
                if(operationName) {
                    this.operate(operationName, props);
                }
            };

            /*
             * editor state
             */

            getState = (props: Object): Object => {
                return props.entityEditorState;
            };

            setState = (newState: Object) => {
                this.props.entityEditorStateChange(newState);
            };

            setEditorState = (newState: Object) => {
                this.props.entityEditorStateChange({
                    editor: newState
                });
            };

            /*
             * operate
             */

            operate = (operationName: string, props: Object) => {
                const {actionProps} = this.getWorkflow(props).get('meta') || {};

                const operations: Object = this.partiallyApplyOperations(config.get('operations'), props);

                if(!operations.hasOwnProperty(operationName)) {
                    throw new Error(`Entity Editor: config.operations."${operationName}" does not exist`);
                }

                const partiallyAppliedOperation: Function = operations[operationName];
                if(typeof partiallyAppliedOperation != "function") {
                    throw new Error(`Entity Editor: "task.operate" must return a function`);
                }

                const currentTask: ?Map<string, any> = this.getCurrentTask(props);
                if(currentTask && currentTask.get('preSuccess')) {
                    this.onOperationSuccess(actionProps, this.props, props)();
                    partiallyAppliedOperation(actionProps);
                    return;
                }

                const result: Promiseable = partiallyAppliedOperation(actionProps);
                returnPromise(result).then(
                    this.onOperationSuccess(actionProps, props),
                    this.onOperationError(actionProps, props)
                );
            };

            partiallyApplyOperations = (operations: Map<string,Function>, props: Object): Object => {
                // TOD MEMOIZE THIS ON PROP CHANGE

                // create mutable operations object with the aim of passing a reference to it into each partial application
                var mutableOperations: Object = {};

                // get operation props passed through config, and make any functions return promises\
                const entityEditorProps: Object = Map(selectedOperationProps(props))
                    .map((ii: *): * => {
                        if(typeof ii !== "function") {
                            return ii;
                        }
                        return (...args) => returnPromise(ii(...args));
                    })
                    .toObject();

                operations.forEach((operation: Function, key: string) => {

                    // create operationsProps object to be passed into the first operation function
                    // it will contain a reference to mutableOperations which will be updated each iteration
                    const operationProps: Object = {
                        props: entityEditorProps,
                        operations: mutableOperations,
                        setEditorState: this.setEditorState
                    };

                    // partially apply the callbacks so they have knowledge of the full set of callbacks and any other config they're allowed to receive
                    const partialOperation: Function = operation(operationProps);

                    // if not a function then this callback hasn't been set up correctly, error out
                    if(typeof partialOperation != "function") {
                        throw new Error(`Entity Editor: callback "${key} must be a function that returns a 'callback' function"`);
                    }

                    // wrap partialOperation in a function that forces the callback to always return a promise
                    mutableOperations[key] =  (...args): Promise<*> => returnPromise(partialOperation(...args));
                });

                return mutableOperations;
            };

            onOperationSuccess = ({onSuccess}: ActionProps, prevProps: Object, thisProps: ?Object): any => {
                return (result: any) => {
                    let prevWorkflow = this.getWorkflow(prevProps);
                    let thisWorkflow = this.getWorkflow(thisProps || this.props);

                    if(!this.componentIsMounted || thisWorkflow.get('name') !== prevWorkflow.get('name')) {
                        return;
                    }

                    onSuccess && onSuccess(result);
                    thisWorkflow.next("onSuccess", (meta) => ({...meta, result}));
                };
            };

            onOperationError = ({onError}: ActionProps, props: Object): any => {
                return (result: any) => {
                    let prevWorkflow = this.getWorkflow(props);
                    let thisWorkflow = this.getWorkflow(this.props);

                    if(!this.componentIsMounted || thisWorkflow.get('name') !== prevWorkflow.get('name')) {
                        return;
                    }

                    onError && onError(result);
                    thisWorkflow.next("onError", (meta) => ({...meta, result}));
                };
            };

            /*
             * workflow
             */

            getWorkflow = (props: Object): Object => {
                return Workflow(
                    this.getState(props).workflow,
                    (workflow) => this.setState({workflow})
                );
            };

            workflowStart = (actionName: string, actionConfig: Object, actionProps: Object = {}) => {
                let workflow = this.getWorkflow(this.props);

                if(this.isCurrentTaskBlocking()) {
                    const {name, task} = workflow.get();
                    console.warn(`Entity Editor: cannot start new "${actionName}" action while "${name}" action is blocking with task "${task}".`);
                    return;
                }

                const workflowData: Object = actionConfig.get('workflow');
                if(!workflowData) {
                    throw new Error(`Entity Editor: A workflow must be defined on the config object for ${actionName}`);
                }

                workflow.start(workflowData.toJS(), actionName, {actionProps});
            };

            getCurrentTask = (props: Object): ?Object => {
                return config.getIn(['tasks', this.getWorkflow(props).get('task')]);
            };

            getNextSteps = (props: Object): ?Object => {
                let workflow = this.getWorkflow(props);
                let nextSteps = workflow.get('nextSteps') || [];

                let onYes = nextSteps.includes('onYes')
                    ? (metaUpdater: Function = ii => ii) => workflow.next('onYes', metaUpdater)
                    : () => workflow.end();

                let onNo = nextSteps.includes('onNo')
                    ? (metaUpdater: Function = ii => ii) => workflow.next('onNo', metaUpdater)
                    : () => workflow.end();

                return {
                    onYes,
                    onNo
                };
            };

            isCurrentTaskBlocking = (props: ?Object): boolean => {
                if(!props) {
                    props = this.props;
                }
                const currentTask: ?Object = this.getCurrentTask(props);
                if(!currentTask) {
                    return false;
                }
                return currentTask.get('blocking', !!currentTask.get('operation'));
            };

            /*
             * prop calculation
             */

            entityEditorProps = (): Object => {

                const actions: Object = config
                    .get('actions', Map())
                    .map((actionConfig: Object, actionName: string) => (actionProps: Object) => {
                        this.workflowStart(actionName, actionConfig, actionProps);
                    })
                    .toObject();

                const actionable: boolean = !this.isCurrentTaskBlocking();
                const currentTask: ?Object = this.getCurrentTask(this.props);
                const names: Object = config.itemNames();
                const nextSteps: Object = this.getNextSteps(this.props);
                const operations: Object = this.partiallyApplyOperations(config.get('operations'), this.props);
                const {result} = (this.getWorkflow(this.props).get('meta') || {});
                const state: Object = this.getState(this.props).editor;
                const status: ?Object = currentTask && currentTask.get('status')
                    ? currentTask.get('status')({
                        ...names,
                        nextSteps,
                        result,
                        state
                    })
                    : null;

                return {
                    actions,
                    actionable,
                    names,
                    nextSteps,
                    operations,
                    state,
                    status
                };
            };

            /*
             * render
             */

            render(): Element<*> {
                let {
                    entityEditorState,
                    ...rest
                } = this.props;

                return <Component
                    {...rest}
                    entityEditor={this.entityEditorProps()}
                />;
            }
        }
    };
};
