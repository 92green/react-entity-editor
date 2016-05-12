
var React = require('react');

var Widget = React.createClass({
    displayName: 'Widget',
    mixins: [
        require('bd-stampy/mixins/ClassMixin')
    ],
    render: function () {
        var classes = this.createClassName('Widget');
        classes.modifier(this.props.color);
        return (
            <div className={classes.className} style={this.props.style}>{this.props.children}</div>
        );
    }
});

module.exports = Widget;