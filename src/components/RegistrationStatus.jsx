import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import CourseMixin from 'trc-client-core/src/mixins/CourseMixin';

var RegistrationStatus = React.createClass({
    displayName: 'RegistrationStatus',
    mixins: [
        CourseMixin,
        PureRenderMixin
    ],
    propTypes: {
        status: React.PropTypes.string
    },
    render() {
        if (this.props.status) {
            return <span {...this.props}>{this.getPrettyStatus(this.props.status, this.props.tense)}</span>;                    
        } 
        return null;
    }
});

module.exports = RegistrationStatus;