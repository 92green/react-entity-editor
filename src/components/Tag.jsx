import React from 'react';
import {History} from 'react-router';
import ClassMixin from 'bd-stampy/mixins/ClassMixin';
import NavigationActions from 'trc/global/NavigationActions';

var Tag = React.createClass({
    displayName: 'Tag',
    mixins: [ClassMixin, History],
    contextTypes: {
        history: React.PropTypes.object
    },
    propTypes: {
        name: React.PropTypes.string,
        onClick: React.PropTypes.func,
        size: React.PropTypes.string
    },
    onChangeTag(data) {
        // if(this.context.history.isActive('Qanda')) {
        //     NavigationActions.setQuery(data);            
        // } else {
        //     // ROUTEFIX / refers to the qanda root
        // }
        this.history.pushState(null, '/product/qanda/', data);
    },
    render: function() {
        var classes = this.createClassName('link').add(this.props.size);
        var props = {};

        if(this.props.href) {
            props.href = this.props.href;
        } else {
            props.onClick = this.onChangeTag.bind(null, {tag: this.props.name});
        }
        return <a {...props} role="button" className={classes.className}>
            {"#" + this.props.name.replace('_', ' ')}
        </a>;
    }
});

module.exports = Tag;