/* @flow */

import React, {Component, PropTypes} from 'react';
import {mergeWithBaseConfig, promptWithDefaults} from './Config';

export default (actionName: string, config: Object = {}): HockApplier => {
    const mergedConfig = mergeWithBaseConfig(config);
    const {
        loader: {
            passThroughWhen = null,
            receivedWhen = null
        } = {},
        components: {
            loader: loaderComponent,
            error: errorComponent
        }
    } = mergedConfig;

    return (ComposedComponent: ReactClass<any>): ReactClass<any> => {

        class EntityEditorLoader extends Component {

            render() {
                const {
                    fetch,
                    error,
                    loaderComponent,
                    errorComponent,
                    passThroughWhen,
                    receivedWhen
                } = this.props;

                if(passThroughWhen && passThroughWhen(this.props)) {
                    return this.renderComposedComponent();
                }
                if(fetch) {
                    return loaderComponent({});
                }
                if(error) {
                    const {
                        message,
                        title,
                        item
                    } = promptWithDefaults(mergedConfig, "error", actionName);

                    return errorComponent({
                        error,
                        Message: message,
                        title,
                        item
                    });
                }
                if(receivedWhen && !receivedWhen(this.props)) {
                    return null;
                }
                return this.renderComposedComponent();
            }

            renderComposedComponent() {
                const filteredProps: Object = Object.assign({}, this.props);
                delete filteredProps.fetch;
                delete filteredProps.error;
                delete filteredProps.loaderComponent;
                delete filteredProps.errorComponent;
                delete filteredProps.passThroughWhen;
                delete filteredProps.receivedWhen;

                return <ComposedComponent {...filteredProps} />;
            }
        }

        EntityEditorLoader.propTypes = {
            fetch: PropTypes.bool,
            error: PropTypes.object,
            loaderComponent: PropTypes.func,
            errorComponent: PropTypes.func,
            passThroughWhen: PropTypes.func,
            receivedWhen: PropTypes.func
        };

        EntityEditorLoader.defaultProps = {
            fetch: false,
            error: null,
            loaderComponent,
            errorComponent,
            passThroughWhen,
            receivedWhen
        };

        return EntityEditorLoader;
    }
};
