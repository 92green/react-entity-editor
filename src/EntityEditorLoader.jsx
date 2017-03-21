/* @flow */

import React, {Component, PropTypes} from 'react';
import {EntityEditorConfig} from './config/EntityEditorConfig';

type EntityEditorLoaderOptions = {
    config: EntityEditorConfig,
    actionName?: string,
    passThroughWhen?: Function,
    receivedWhen?: Function
};

export default (options: EntityEditorLoaderOptions): HockApplier => {

    const {
        config,
        actionName,
        passThroughWhen = null,
        receivedWhen = null
    } = options;

    const loaderComponent: ReactClass<any> = config.getIn(['components', 'loader']);
    const errorComponent: ReactClass<any> = config.getIn(['components', 'error']);

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
                    } = fullConfig.prompt(actionName, "error");

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
