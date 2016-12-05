/* @flow */

import React, {Component, PropTypes} from 'react';
import EntityEditorLoader from './EntityEditorLoader';

export default (config: ?Object = null): HockApplier => {
    return (ComposedComponent: ReactClass<any>): ReactClass<any> => {

        class EntityEditorList extends Component {

            render() {
                const {
                    list
                } = this.props;

                const entityEditorProps: Object = {
                    actions: {
                        save: (data: Object) => {},
                        saveNew: (data: Object) => {},
                        delete: (id: string) => {},
                        goList: () => {},
                        goNew: () => {},
                        goEdit: (id: string) => {},
                        /* reset? */
                        publish: (id: string) => {} /* be able to define your own macros! */
                    }
                };

                return <ComposedComponent
                    {...this.props}
                    entityEditor={entityEditorProps}
                    entityEditorRoutes={this.context.entityEditorRoutes}
                />;
            }
        }

        EntityEditorList.propTypes = {
            list: PropTypes.any,
            fetch: PropTypes.bool,
            error: PropTypes.object,
            // for EntityEditorLoader
            receivedWhen: PropTypes.func
        };

        EntityEditorList.contextTypes = {
            entityEditorRoutes: PropTypes.object
        };

        return EntityEditorLoader({
            receivedWhen: (props) => !!props.list
        })(EntityEditorList);
    }
};
