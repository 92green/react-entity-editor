import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ClassMixin from 'bd-stampy/mixins/ClassMixin';

var Grid = React.createClass({
    displayName: 'Grid',
    mixins: [
        ClassMixin,
        PureRenderMixin
    ],
    render() {
        var classes = this.createClassName('grid');
        return <div className={classes.className}>{this.props.children}</div>;
    }
});

export default Grid;