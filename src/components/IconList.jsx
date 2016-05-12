import React from 'react';

var IconList = React.createClass({
    displayName: 'IconList',
    mixins: [
        require('bd-stampy/mixins/ClassMixin')
    ],
    render() {
        var classes = this.createClassName('IconList');
        return (
            <ul className={classes.className}>{this.props.children}</ul>
        );
    }
});

module.exports = IconList;
