/* @flow */

import React, {Component, PropTypes} from 'react';
import {fromJS} from 'immutable';

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
                const filteredProps: Object = fromJS(this.props)
                    .delete('fetch')
                    .delete('error')
                    .delete('fetchComponent')
                    .delete('errorComponent')
                    .toJS();

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
