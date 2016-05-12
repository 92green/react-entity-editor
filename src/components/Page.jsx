import React, { Children } from 'react';
import withSideEffect from 'react-side-effect';
import UserStore from 'trc/user/UserStore';

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
    var name = (UserStore.get('site') === 'TOYOTA') ? 'TIA' : 'Lexus Academy';
    return `${name} Training Resource Centre`;
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
