import React, { Children } from 'react';
import withSideEffect from 'react-side-effect';
import UserStore from 'trc-client-core/src/user/UserStore';

var Page = React.createClass({
    displayName: 'Page',
    propTypes: {
        title: React.PropTypes.string.isRequired,
        classes: React.PropTypes.string
    },
    render() {
        if (this.props.children) {
            return Children.only(this.props.children);
        } else {
            return null;
        }
    }
});

function defaultTitle() {
    switch(UserStore.get('site')) {
        case 'TOYOTA':
            return `TIA Training Resource Centre`

        case 'LEXUS':
            return 'Lexus Academy Training Resource Centre';

        default:
            return 'Training Resource Centre';
    }
}

function reducePropsToState(propsList) {
    var innermostProps = propsList[propsList.length - 1];
    if (innermostProps) {
        return innermostProps;
    }
}

function handleStateChangeOnClient(props = {}) {
    document.title = props.title ? `${props.title} - ${defaultTitle()}` : defaultTitle();
    if(props.classes) {
        document.body.className = props.classes;
    }
}

export default withSideEffect(
    reducePropsToState,
    handleStateChangeOnClient
)(Page);
