var developmentTools;

if (!process.env.NODE_ENV) {
    window.perf = require('react-addons-perf');
    window.perf.wasted = function() {
        window.perf.stop();
        window.perf.printWasted();
    }
    var { DevTools, DebugPanel, LogMonitor } = require('redux-devtools/lib/react');

    var debugOverrideStyles = {
        fontSize: 12,
        lineHeight: '1.8', 
        WebkitFontSmoothing: 'subpixel-antialiased',
        boxShadow: 'none'
    };

    developmentTools = React.createClass({
        displayName: 'DevTools',
        render() {
            return <DebugPanel left top  bottom style={debugOverrideStyles}>
                <DevTools store={this.props.store} monitor={LogMonitor} visibleOnLoad={false} />
            </DebugPanel>;            
        }
    });
} else {
    // Production null shell
    developmentTools = React.createClass({
        render() {
            return null;            
        }
    });   
}

module.exports = developmentTools
