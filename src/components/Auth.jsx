import React from 'react';
import Permissions from 'trc/user/Permissions';
import {ConditionalChildren} from 'trc/components/ConditionalChildren';
import AuthMap from 'trc/constants/AuthMap';

var Auth = React.createClass({
    displayName: 'Auth',

    render() {
        //
        //  Loop through authMap tests and render nothing if any fail

        const authMap = AuthMap(this.props) 

        for (var key in authMap) {
            if (authMap.hasOwnProperty(key) && this.props[key] && !authMap[key]()) {
                return null;
            }
        }
        
        //
        //  Allow for adhoc boolean tests
        if(this.props.bool === false) {
            return null;
        }
        
        return this.props.safelyRenderChildren();
    }
});

export default ConditionalChildren(Auth);