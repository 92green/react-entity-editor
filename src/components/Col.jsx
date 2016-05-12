import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

var Col = React.createClass({
    displayName: 'Col',
    mixins: [
        PureRenderMixin
    ],
    propTypes: {
        width: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ])
    },
    getDefaultProps: function() {
        return {
            className: ''
        };
    },
    render: function() {
        var columnWidth = (this.props.width) ? `col--${this.props.width}` : 'col--';
        var className = `${columnWidth} ${this.props.className}`;
        return <div {...this.props} className={className}>{this.props.children}</div>;
    }
});

module.exports = Col;
