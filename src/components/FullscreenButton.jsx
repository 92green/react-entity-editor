
import React from 'react';

var FullscreenButton = React.createClass({
    displayName: 'FullscreenButton',
    mixins: [
        require('bd-stampy/mixins/ClassMixin')
    ],
    render: function () {
        var classes = this.createClassName("Button-fullscreen vertical-middle l-right t-muted");
        classes.is(this.props.value, 'active');
        return (
            <button onClick={this.props.dispatch} className={classes.className}></button>
        );
    }
});

module.exports = FullscreenButton;