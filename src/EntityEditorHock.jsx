/* @flow */

import React, {Component, PropTypes} from 'react';
import {fromJS, Map, List} from 'immutable';
import {mergeWithBaseConfig, promptWithDefaults} from './Config';;
import {returnPromise} from './Utils';

export default (userConfig: Object = {}): Function => {
    const  {
        preloadActionIds,
        // group these under a propNames: {} object?
        entityEditorProp = "entityEditor",
        entityEditorRoutesProp = "entityEditorRoutes"
    } = userConfig;

    return (ComposedComponent) => {

        class EntityEditorHock extends Component {

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

            shouldComponentUpdate(nextProps: Object, nextState: Object): boolean {
                return fromJS(this.props).equals(fromJS(nextProps))
                    || fromJS(this.state).equals(fromJS(nextState));
            }

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

            setPending(actionName: string, pending: boolean): void {
                this.setState({
                    pending: Object.assign(
                        {},
                        this.state.pending,
                        {[actionName]: pending}
                    )
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

            getPromptPromise(config: Object, type: string, actionName: string, payload: Object): Promise<*> {
                var prompt: ?Object = promptWithDefaults(config, type, actionName, this.getEditorState());

                // special case: actions staring with "go" can fallback to use "go" prompts
                if(!prompt && /^go[A-Z]/.test(actionName)) {
                    prompt = promptWithDefaults(config, type, "go", this.getEditorState());
                }

                return !prompt
                    ? new Promise(resolve => resolve(payload))
                    : new Promise((resolve, reject) => {
                        prompt.onYes = () => resolve(payload);
                        prompt.onNo = () => reject(payload);
                        prompt.payload = payload;
                        this.openPrompt(prompt);
                    });
            }

            getSuccessAction(config: Object, actionName: string): Function {
                return (result) => {
                    var successAction = config.successActions && config.successActions[actionName];

                    // use default successAction if none explicitly provided
                    // which will call callbacks.after<ACTIONNAME> if it exists
                    if(!successAction) {
                        successAction = ({callbacks}) => (successActionProps) => {
                            const after = `after${actionName.charAt(0).toUpperCase()}${actionName.slice(1)}`;
                            callbacks[after] && callbacks[after](successActionProps);
                            return successActionProps;
                        };
                    }

                    const partialSuccessAction = successAction(config);
                    if(typeof partialSuccessAction != "function") {
                        throw `Entity Editor: successAction "${actionName} must be a function that returns a successAction function, such as (config) => (successActionProps) => {}"`;
                    }
                    return returnPromise(partialSuccessAction(result));
                };
            }

            wrapActionWithPrompts(config: Object, action: Function, actionName: string, actionProps: Object): Function {
                // partially apply actions, giving it a subset of config (at this point only callbacks are provided)
                const partialAction: Function = action({
                    callbacks: config.callbacks
                });

                if(typeof partialAction != "function") {
                    throw `Entity Editor: action "${actionName} must be a function that returns an action function, such as (config) => (actionProps) => { /* return null, promise or false */ }"`;
                }

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
                    this.setPending(actionName, true);
                    return actionProps;
                }

                const endPendingSuccess: Function = (result) => {
                    this.setPending(actionName, false);
                    return result;
                };

                const endPendingError: Function = (result) => {
                    this.setPending(actionName, false);
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

                const doSuccessAction: Function = this.getSuccessAction(config, actionName);

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
                return this.getPromptPromise(config, 'confirm', actionName, actionProps)
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

            getPreparedConfig(config): Object {
                const immutableConfig = fromJS(config);
                var callbacks: Object = {};

                immutableConfig
                    .get('callbacks')
                    .reduce((callbacks: Object, callback: Function, key: string): Object => {

                        // create arguments to be passed as config into each callback
                        const callbackArgsWithSuper: Function = (_super: ?Function) => {
                            return Map({
                                    callbacks,
                                    _super,
                                    setEditorState: this.setEditorState()
                                })
                                .filter(ii => ii)
                                .toObject();
                        };

                        // prepare object to pass as 'config' to every callback
                        // first prepare every super call and recusively insert these into each other
                        // so you can go config._super (and config._super._super) inside each
                        const superCalls: List<Function> = immutableConfig.getIn(['_super', 'callbacks', key], List());
                        const _super: Function = superCalls.reduce((reduction: ?Function, _super: Function) => {
                            return _super(callbackArgsWithSuper(_super));
                        });

                        // partially apply the callbacks so they have knowledge of the full set of callbacks and any other config they're allowed to receive
                        const partialCallback: Function = callback(callbackArgsWithSuper(_super));

                        // if not a function then this callback hasnt been set up correctly, error out
                        if(typeof partialCallback != "function") {
                            throw `Entity Editor: callback "${key} must be a function that returns a 'callback' function, such as (config) => (callbackProps) => { /* return null, promise or false */ }"`;
                        }

                        // wrap partialCallback in a function that forces the callback to always return a promise
                        callbacks[key] = (...args): Promise<*> => returnPromise(partialCallback(...args));
                        return callbacks;

                    }, callbacks);

                return fromJS(config)
                    .set('callbacks', callbacks)
                    .toJS();
            }

            entityEditorProps(config: Object): Object {
                const preparedConfig = this.getPreparedConfig(config);

                // wrap each of the actions in prompts so they can handle confirmation, success and error
                // also preload action props with their ids if required (such as with EntityEditorItem)
                const actions: Object = fromJS(config)
                    .get('actions', Map())
                    .map((action: Function, actionName: string) => (actionProps: Object) => {
                        if(preloadActionIds) {
                            actionProps.id = preloadActionIds(this.props);
                        }
                        return this.wrapActionWithPrompts(preparedConfig, action, actionName, actionProps);
                    })
                    .toJS();

                // choose state vars to pass down in a state prop
                // removed until use case is confirmed
                // const state: Object = {
                //    dirty: this.state.dirty
                // };

                // pending actions
                const pending: Object = this.state.pending;

                var props = {
                    actions,
                    //state,
                    pending
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

            renderPrompt(config) {
                const {
                    prompt,
                    promptOpen
                } = this.state;

                const promptAsProps: boolean = prompt && prompt.asProps;
                const Message = prompt && prompt.message;
                const Prompt = config.components.prompt;
                const PromptContent = config.components.promptContent;

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
                const config: Object = mergeWithBaseConfig(this.context.entityEditorRoutes, userConfig);
                const props: Object = {
                    ...this.props,
                    [entityEditorProp]: this.entityEditorProps(config),
                    [entityEditorRoutesProp]: this.context.entityEditorRoutes
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
