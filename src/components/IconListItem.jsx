
var React = require('react');
var {Link} = require('react-router');

var IconListItem = React.createClass({
    displayName: 'IconListItem',
    mixins: [
        require('bd-stampy/mixins/ClassMixin')
    ],
    propTypes: {
        icon: React.PropTypes.string,
        href: React.PropTypes.string,
        className: React.PropTypes.string
    },
    render: function () {
        var link;

        if(this.props.label) {
            return <li className="IconList_label">{this.props.children}</li>
        }

        var defaultProps = {
            title: this.props.title || this.props.children,
            'data-icon': this.props.icon
        }

        if(this.props.to) {
            link = <Link {...defaultProps} to={this.props.to} query={this.props.query}>{this.props.children}</Link>;
        } else {
            link = <a {...defaultProps} href={this.props.href}>{this.props.children}</a>;
        }

        return (
            <li className={this.props.className} style={this.props.style}>{link}</li>
        );
    }
});

module.exports = IconListItem;
