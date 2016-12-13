/* @flow */

import React, {Component, PropTypes} from 'react';
import {fromJS, Map} from 'immutable';
import {mergeWithBaseConfig, promptWithDefaults} from './Config';
import Modal from './Modal';
import {returnPromise} from './Utils';

export default (userConfig: Object = {}): HockApplier => {
    const  {
        promptComponent = () => <Modal />,
        preloadActionIds
    } = userConfig;

    return (ComposedComponent: ReactClass<any>): ReactClass<any> => {

        class EntityEditorHock extends Component {

            constructor(props: Object): void {
                super(props);
                this.state = {
                    dirty: false,
                    prompt: null,
                    promptOpen: false
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
                        this.openPrompt(prompt);
                    });
            }

            wrapActionWithPrompts(config: Object, action: Function, actionName: string, actionProps:Object): Function {
                const partialAction: Function = action(config);
                if(typeof partialAction != "function") {
                    throw `Entity Editor: action "${actionName} must be a function that returns an action function, such as (config) => (actionProps) => { /* return null, promise or false */ }"`;
                }

                const doNothing = () => {};

                // show confirmation prompt (if exists)
                return this.getPromptPromise(config, 'confirm', actionName, actionProps)
                    .then(
                        (actionProps) => {
                            // perform action
                            return returnPromise(partialAction(actionProps))
                                .then(
                                    (result) => {
                                        // show success prompt (if exists)
                                        return this.getPromptPromise(config, 'success', actionName, result)
                                            .then(this.callAfter, this.callAfter);
                                    },
                                    (result) => {
                                        // show error prompt (if exists)
                                        return this.getPromptPromise(config, 'error', actionName, result)
                                            .then(doNothing, doNothing);
                                    }
                                );
                        }, doNothing
                    );
            }

            wrapCallbackWithAfter(partialCallback: Function, key: string, callbacks: Object): Function {
                return (...args): Promise<*> => {
                    const after: ?Function = /^on/.test(key)
                        ? callbacks[key.replace(/^on/, 'after')]
                        : null;

                    return returnPromise(partialCallback(...args))
                        .then(response => ({response, after}));
                };
            }

            callAfter({response, after}: {response: Object, after: ?Function}): void {
                after && after(response);
            }

            getPreparedConfig(config): Object {
                var callbacks: Object = {};

                fromJS(config.callbacks)
                    .reduce((callbacks: Object, callback: Function, key: string): Object => {
                        // partially apply the callbacks so they have knowledge of the full set of callbacks and any other config they're allowed to receive
                        const partialCallback: Function = callback({
                            callbacks,
                            setEditorState: this.setEditorState()
                        });

                        // if not a function then this callback hasnt been set up correctly, error out
                        if(typeof partialCallback != "function") {
                            throw `Entity Editor: callback "${key} must be a function that returns a 'callback' function, such as (config) => (callbackProps) => { /* return null, promise or false */ }"`;
                        }

                        // wrap partialCallback in a function that takes the callback response and nests it in a new object,
                        // so we can also pass a reference to an 'after' function in the promise payload
                        // the 'after' function will be called after the user closes out of a success dialog
                        callbacks[key] = this.wrapCallbackWithAfter(partialCallback, key, callbacks);
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
                const state: Object = {
                    dirty: this.state.dirty
                };

                return {
                    actions,
                    state
                };
            }

            render() {
                const config: Object = mergeWithBaseConfig(this.context.entityEditorRoutes, userConfig);
                const {
                    prompt,
                    promptOpen
                } = this.state;

                return <div>
                    <ComposedComponent
                        {...this.props}
                        entityEditor={this.entityEditorProps(config)}
                        entityEditorRoutes={this.context.entityEditorRoutes}
                    />
                    {React.cloneElement(promptComponent(this.props), {
                        ...prompt,
                        open: promptOpen,
                        onRequestClose: this.closePrompt.bind(this)
                    })}
                </div>;
            }
        }

        EntityEditorHock.contextTypes = {
            entityEditorRoutes: PropTypes.object
        };

        return EntityEditorHock;
    }
};
