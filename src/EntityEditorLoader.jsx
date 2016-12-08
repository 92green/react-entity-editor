/* @flow */

import React, {Component, PropTypes} from 'react';

export default (config: Object = {}): HockApplier => {

    return (ComposedComponent: ReactClass<any>): ReactClass<any> => {

        class EntityEditorLoader extends Component {

            render() {
                const {
                    fetch,
                    error,
                    fetchComponent,
                    errorComponent,
                    passThroughWhen,
                    receivedWhen
                } = this.props;

                if(passThroughWhen && passThroughWhen(this.props)) {
                    return this.renderComposedComponent();
                }
                if(fetch) {
                    return fetchComponent(this.props);
                }
                if(error) {
                    return errorComponent(this.props);
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
                delete filteredProps.fetchComponent;
                delete filteredProps.errorComponent;
                delete filteredProps.passThroughWhen;
                delete filteredProps.receivedWhen;

                return <ComposedComponent {...filteredProps} />;
            }
        }

        EntityEditorLoader.propTypes = {
            fetch: PropTypes.bool,
            error: PropTypes.object,
            fetchComponent: PropTypes.func,
            errorComponent: PropTypes.func,
            passThroughWhen: PropTypes.func,
            receivedWhen: PropTypes.func
        };

        EntityEditorLoader.defaultProps = {
            fetch: false,
            error: null,
            fetchComponent: config.fetchComponent ? config.fetchComponent : () => <p>Loading...</p>,
            errorComponent: config.errorComponent ? config.errorComponent : () => <p>Error</p>,
            passThroughWhen: config.passThroughWhen || null,
            receivedWhen: config.receivedWhen || null
        };

        return EntityEditorLoader;
    }
};
