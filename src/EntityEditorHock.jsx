/* @flow */

import React, {Component, PropTypes} from 'react';
import {fromJS, Map, List} from 'immutable';
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
                    prompt: null,
                    promptOpen: false,
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

            componentWillUnmount(): void {
                this.closePrompt();
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

            openPrompt(prompt: Object): void {
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
            }

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

            entityEditorProps(config: EntityEditorConfig): Object {
                // wrap each of the actions in prompts so they can handle confirmation, success and error
                // also preload action props with their ids if required (such as with EntityEditorItem)
                const actions: Object = config
                    .data()
                    .get('actions', Map())
                    .map((action: Function, actionName: string) => (actionProps: Object) => {
                        if(preloadActionIds) {
                            actionProps.id = preloadActionIds(this.props);
                        }
                        return this.wrapActionWithPrompts(
                            config,
                            action,
                            actionName,
                            actionProps
                        );
                    })
                    .toJS();

                // pending actions
                //const pending: Object = this.getPending;

                var props: Object = {
                    actions,
                    //state,
                    pending: this.getPending
                };

                const {
                    prompt,
                    promptOpen
                } = this.state;

                if(promptOpen && prompt && prompt.asProps) {
                    props.prompt = Object.assign({}, prompt);
                }

                return props;
            }

            renderPrompt(config: EntityEditorConfig) {
                const {
                    prompt,
                    promptOpen
                } = this.state;

                const promptAsProps: boolean = prompt && prompt.asProps;
                const Message = prompt && prompt.message;
                const Prompt = config.getIn(['components','prompt']);
                const PromptContent = config.getIn(['components','promptContent']);

                return <Prompt
                    {...prompt}
                    open={promptOpen && !promptAsProps}
                    onRequestClose={this.closePrompt.bind(this)}
                >
                    {prompt &&
                        <PromptContent {...prompt}>
                            <Message {...prompt.item} />
                        </PromptContent>
                    }
                </Prompt>
            }

            render() {
                const config: EntityEditorConfig = userConfig
                    .merge(this.context.entityEditorRoutes.config);

                const props: Object = {
                    ...this.props,
                    [entityEditorProp]: this.entityEditorProps(config),
                    [entityEditorRoutesProp]: this.context.entityEditorRoutes.props
                };

                return <div>
                    <ComposedComponent {...props} />
                    {this.renderPrompt(config)}
                </div>;
            }
        }

        EntityEditorHock.contextTypes = {
            entityEditorRoutes: PropTypes.object
        };

        return EntityEditorHock;
    }
};
