import React from 'react';
import Markdown from 'trc/components/Markdown';

var ErrorBanner = React.createClass({
    displayName: 'ErrorBanner',
    render() {
        return (
            <div className="BannerError">
                <Markdown html={this.props.error}/>
            </div>
        );
    }
});

module.exports = ErrorBanner;
