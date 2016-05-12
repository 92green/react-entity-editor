import React from 'react';
import Fullscreen from 'trc-client-core/src/utils/Fullscreen';

export default (ComposedComponent) => {
    const component = React.createClass({
        displayName: 'Fullscreen',
        onFullscreen(DOMNode) {
            if (Fullscreen.enabled) {
                if (Fullscreen.active()) {
                    Fullscreen.exit();
                    // this.setState({fullscreen: false});
                } else {
                    Fullscreen.request(DOMNode);
                    // this.setState({fullscreen: true});
                }
            }
        },
        render() {
            return (
                <ComposedComponent
                    {...this.props}
                    {...this.state}
                    onFullscreen={this.onFullscreen}
                />
            );
        }
    });

    return component;
};
