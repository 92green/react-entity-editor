import React from 'react';
import ErrorMessage from 'trc-client-core/src/components/ErrorMessage';

var ErrorView = React.createClass({
    displayName: 'ErrorView',
    render() {
        return <ErrorMessage code={404} {...this.props.location.query}/>;
    }
});

module.exports = ErrorView;
