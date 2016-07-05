import React, { Component, PropTypes } from 'react';
import { List, Map, fromJS } from 'immutable';
import AuthConnect from 'trc-client-core/src/auth/AuthConnect';

//
// EntityEditorTRCPermissions higher order component
//
// Modifies permitted actions for an editor based on the current users permissions
//
// Give it a config like { apiPermission: 'USER' }
// customise it by setting any of {createPermission: 'FULL_PERMISSION_NAME', updatePermission, deletePermission }
//

export default (config) => (ComposedComponent) => {

    class EntityEditorTRCPermissions extends Component {

        render() {
            if(!config) {
                console.error('You must pass in a config object when using EntityEditorTRCPermissions');
                return null;
            }

            const {
                id,
                hasPermission
            } = this.props;

            // set permitCreate, permitUpdtae or permitDelete to be false if permissions don't exist for them

            const actions = ['Create','Update','Delete'];
            const newProps = actions
                .reduce((newProps, action) => {
                    const apiPermissionBase = config.apiPermission && config.apiPermission.toUpperCase();
                    const permission = config[`${action.toLowerCase()}Permission`] || (apiPermissionBase && `API_${apiPermissionBase}_${action.toUpperCase()}`);
                    if(permission == null) {
                        console.warn('You must set config.`${action.toLowerCase()}Permission` or config.apiPermission when using EntityEditorTRCPermissions');
                        return newProps;
                    }
                    return newProps.update(`permit${action}`, isPermitted => isPermitted && hasPermission(permission, id))
                }, Map(this.props))
                .toObject();

            return <ComposedComponent {...newProps} />;
        }
    }

    EntityEditorTRCPermissions.propTypes = {
        id: PropTypes.any,
        // permissions
        permitCreate: PropTypes.bool,
        permitUpdate: PropTypes.bool,
        permitDelete: PropTypes.bool
    };

    return AuthConnect()(EntityEditorTRCPermissions);
};
