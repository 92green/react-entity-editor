import React from 'react';
import {connect} from 'react-redux';
import {withSettings} from 'trc-client-core/src/settings/SettingsSelector';

var Wrapper = React.createClass({
    displayName: 'Wrapper',
    getFullscreen() {
        return (this.props.settings.get('fullscreen').get(this.props.pathname)) ? 'is-fullscreen' : '';
    },
    render() {
        return (
           <div className={`l-wrapper ${this.getFullscreen()}`}>{this.props.children}</div>
        );
    }
});

export default connect(withSettings)(Wrapper);