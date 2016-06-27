import React from 'react';
import ConditionalChildren from 'trc-client-core/src/components/ConditionalChildren';
import {State} from 'react-router';

var RouteIsActive = React.createClass({
    displayName: 'RouteIsActive',
    mixins: [State],
    contextTypes: {
        history: React.PropTypes.object
    },
    propTypes: {
        path: React.PropTypes.string.isRequired
    },
    render() {
        if (this.context.history.isActive(this.props.path)) {
            return this.props.safelyRenderChildren();
        }
        return null;
    }
});

export default ConditionalChildren()(RouteIsActive);
