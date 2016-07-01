import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import {
    requestUserGet,
    requestUserList,
    requestUserCreate,
    requestUserUpdate,
    requestUserDelete,
    requestOrganizationList
} from 'trc-client-core/src/utils/APIActions';

import {
    TRC_USER_GET_FETCH,
    TRC_USER_GET_ERROR,
    TRC_USER_CREATE_FETCH,
    TRC_USER_CREATE_ERROR,
    TRC_USER_UPDATE_FETCH,
    TRC_USER_UPDATE_ERROR,
    TRC_USER_DELETE_FETCH,
    TRC_USER_DELETE_ERROR
} from 'trc-client-core/src/utils/APIActionTypes';

//
// UserEntityEditorConnect higher order component
// Provides connection with redux for user editor
//

export default (config) => (ComposedComponent) => {

	class UserEntityEditorConnect extends Component {

		componentWillMount() {
	        this.props.dispatch(requestOrganizationList());
        	this.props.dispatch(requestUserList());
	    }

	    handleRead(id) {
	        return this.props.dispatch(requestUserGet(id));
	    }

	    handleCreate(dataObject) {
	        return this.props
	            .dispatch(requestUserCreate(dataObject))
	            .then(
	                (data) => Promise.resolve(data.payload.userId) // always pass back new id
	            );
	    }

	    handleUpdate(id, dataObject) {
	        return this.props
	            .dispatch(requestUserUpdate(id, dataObject));
	    }

	    handleDelete(id) {
	        return this.props
	            .dispatch(requestUserDelete(id));
	    }

	    // no default close behaviour as it's specific to each form usage
	    // pass a close function in as an "onClose" prop

		render() {

			const {
				id,
	            users,
	            permitCreate,
        		permitUpdate,
        		permitDelete

	        } = this.props;

			const initialValues = users
	            ? users
	                .toMap()
	                .get(id, Map())
	                .toJS()
	            : {};

			return (
				<ComposedComponent
					{...this.props}
	                entityName="user"
	                initialValues={initialValues}
	                onRead={this.handleRead.bind(this)}
                	onCreate={permitCreate ? this.handleCreate.bind(this) : null}
                	onUpdate={permitUpdate ? this.handleUpdate.bind(this) : null}
                	onDelete={permitDelete ? this.handleDelete.bind(this) : null}
				/>
			);
		}
	}

	UserEntityEditorConnect.propTypes = {
		// from props list
		id: PropTypes.any,
		willCopy: PropTypes.bool,
	    permitCreate: PropTypes.bool,
        permitUpdate: PropTypes.bool,
        permitDelete: PropTypes.bool,
        // from redux
		dispatch: PropTypes.func,
	    history: PropTypes.object,
	    reading: PropTypes.bool,
	    creating: PropTypes.bool,
	    updating: PropTypes.bool,
	    deleting: PropTypes.bool
	};

	const connectWithRedux = connect(
	    (state) => ({
	        users: state.user.get('collection'),
	        reading: state.async.get(TRC_USER_GET_FETCH),
	        creating: state.async.get(TRC_USER_CREATE_FETCH),
	        updating: state.async.get(TRC_USER_UPDATE_FETCH),
	        deleting: state.async.get(TRC_USER_DELETE_FETCH),
	        readError: state.async.get(TRC_USER_GET_ERROR),
	        writeError: state.async.get(TRC_USER_CREATE_ERROR)
	            || state.async.get(TRC_USER_UPDATE_ERROR)
	            || state.async.get(TRC_USER_DELETE_ERROR),
	        organizations: state.organization.get('collection').toList(),
	        jobTitles: state.user.get('jobTitles').toList()
	    })
	);

	return connectWithRedux(UserEntityEditorConnect);
};
