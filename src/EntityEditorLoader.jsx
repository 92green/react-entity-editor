/* @flow */

import React, {Component, PropTypes} from 'react';

export default (config: ?Object = null): HockApplier => {

    return (ComposedComponent: ReactClass<any>): ReactClass<any> => {

        class EntityEditorLoader extends Component {

            render() {
                const {
                    fetch,
                    error
                } = this.props;

                const receivedWhen: ?Function = this.props.receivedWhen
                    || (config && config.receivedWhen);

                if(fetch) {
                    return <p>Loading</p>;
                }

                if(error) {
                    return <p>Error</p>;
                }

                if(receivedWhen && !receivedWhen(this.props)) {
                    return null;
                }

                // todo: use RemoveProps
                // todo: accept components as props for fetch and error
                return <ComposedComponent {...this.props} />;
            }
        }

        EntityEditorLoader.propTypes = {
            fetch: PropTypes.bool,
            error: PropTypes.object,
            receivedWhen: PropTypes.func
        };

        return EntityEditorLoader;
    }
};
