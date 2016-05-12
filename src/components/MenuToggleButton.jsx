
var React = require('react');

var MenuToggleButton = React.createClass({
    displayName: 'MenuToggleButton',
    updateHash: true,
  mixins: [
        require('bd-stampy/mixins/ClassMixin')
    ],
    propTypes: {
        title: React.PropTypes.string,
        icon: React.PropTypes.number
    },
    getInitialState: function() {
        return {
            toggle: false
        };
    },
    toggleClick: function() {
        this.setState({toggle: !this.state.toggle});
    },
    render: function () {
        var classes = this.createClassName('Toggle')
            .modifier('blank')
            .is(this.state.toggle, 'active');

        return (
            <ul>
                <li className={classes.className}><a data-icon={String.fromCharCode(this.props.icon)} onClick={this.toggleClick}>{this.props.title}</a></li>
                <li>
                    <ul>{this.props.children}</ul>
                </li>
            </ul>
        );
    }
});

module.exports = MenuToggleButton;