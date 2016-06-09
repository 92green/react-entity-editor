import React, { Component, PropTypes } from 'react';
import { fromJS, Map, List } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import AuthProvider from 'trc-client-core/src/auth/AuthProvider';

import UserStore from 'trc-client-core/src/user/UserStore';
import Permission from 'trc-client-core/src/constants/Permission';

const JavaAuthProvider = (props) => <div>{props.children}</div>;

const authProvider = AuthProvider((props) => {

    // polyfill permissions into the format expected by AuthProvider by reading the UserStore and matching them against commonly used user variables and the list of permissions
    const currentAuth = UserStore.state; // currentAuth is the raw auth object - avoid accessing this in components wherever possible
    if(!currentAuth) {
        return null;
    }
    
    const permissions = fromJS(Permission) // get all permissions defined in Permission
        .filter(func => func(UserStore)) // test this user against each and keep those that pass
        .keySeq() // get the names of those permissions
        .sort()
        .toList();

    // dont add user roles to permissions! While this polyfill exists it's better to infer new permissions from roles rather than add roles to the permissions list

    const currentUser = Map()
        .set('firstName',       currentAuth.get('firstName'))
        .set('fullName',        currentAuth.get('fullName'))
        .set('lastName',        currentAuth.get('lastName'))
        .set('participantId',   currentAuth.get('participantId'))
        .set('site',            currentAuth.get('site'))
        .set('username',        currentAuth.get('username'))
        .set('permissions',     permissions);

    return {
        currentAuth,
        currentUser
    };
});

export default authProvider(JavaAuthProvider);