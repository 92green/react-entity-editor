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

            constructor(props) {
                super(props);
                this.state = {
                    dirty: false,
                    prompt: null,
                    promptOpen: false
                };
            }

            componentWillMount() {
                const {
                    entityEditorRoutes: {
                        onLeaveHook
                    }
                } = this.context;

                if(onLeaveHook) {
                    onLeaveHook((a,b) => {
                        /*if(this.allowLeave) {
                            return true;
                        }
                        try a generic "go" action
                        return false;*/
                    });
                }
            }

            componentWillUnmount() {
                this.closePrompt();
            }

            shouldComponentUpdate(nextProps, nextState) {
                return fromJS(this.props).equals(fromJS(nextProps))
                    || fromJS(this.state).equals(fromJS(nextState));
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
                const editorData: Object = {
                    dirty: this.state.dirty
                };

                var prompt: ?Object = promptWithDefaults(config, type, actionName, editorData);

                // special case: actions staring with "go" can fallback to use "go" prompts
                if(!prompt && /^go[A-Z]/.test(actionName)) {
                    prompt = promptWithDefaults(config, type, "go", editorData);
                }

                return !prompt
                    ? new Promise(resolve => resolve(payload))
                    : new Promise((resolve, reject) => {
                        prompt.onYes = () => resolve(payload);
                        prompt.onNo = () => reject(payload);
                        this.openPrompt(prompt);
                    });
            }

            wrapActionInPrompts(config: Object, action: Function, actionName: string, actionProps:Object): Function {
                const partialAction: Function = action(config);
                if(typeof partialAction != "function") {
                    throw `Entity Editor: action "${actionName} must be a function that returns an action function, such as (config) => (actionProps) => { /* return null, promise or false */ }"`;
                }

                // show confirmation prompt (if exists)
                return this.getPromptPromise(config, 'confirm', actionName, actionProps)
                    .then(
                        (actionProps) => {
                            return returnPromise(partialAction(actionProps))
                                .then(
                                    (result) => {
                                        // show success prompt (if exists)
                                        this.getPromptPromise(config, 'success', actionName, result).catch(() => {});
                                    }, (result) => {
                                        // show error prompt (if exists)
                                        this.getPromptPromise(config, 'error', actionName, result).catch(() => {});
                                    }
                                );
                        }, () => {}
                    );
            }

            entityEditorProps(config: Object): Object {
                const modifiedConfig = {
                    ...config,
                    callbacks: {
                        ...config.callbacks,
                        onDirty: ({dirty}) => {
                            if(this.state.dirty != dirty) {
                                this.setState({dirty});
                            }
                        }
                    }
                };

                const actions: Object = fromJS(config)
                    .get('actions', Map())
                    .map((action: Function, actionName: string) => (actionProps: Object) => {
                        if(preloadActionIds) {
                            actionProps.id = preloadActionIds(this.props);
                        }
                        return this.wrapActionInPrompts(modifiedConfig, action, actionName, actionProps);
                    })
                    .toJS();

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
