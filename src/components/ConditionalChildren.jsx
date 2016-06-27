import React from 'react';
import PureRender from 'react-addons-pure-render-mixin';

const ConditionalChildren = (config) => (ComposedComponent) => React.createClass({
    mixins:[PureRender],
    displayName: 'ConditionalChildren',
    render() {
        return <ComposedComponent
            {...this.props}
            safelyRenderChildren={this.safelyRenderChildren}
        />;
    },
    safelyRenderChildren() {
        //
        // If the lower components porops.children is an
        // array we will need to wrap it in a singular component
        if(this.props.children && (this.props.children.length || this.props.component)) {
            return this.wrapChildrenInComponent();
        }
        return this.props.children;
    },
    wrapChildrenInComponent() {
        var Component = this.props.component || 'div';

        // check if we can just render a react component from a string
        if(typeof Component === 'string') {
            return <Component>{this.props.children}</Component>;
        }

        //
        // use function.length to tell if the user has bound a props object
        // to this.props.component. This way the user can bind or not bind
        // and the function will place the children in their correct position:
        //
        // func(props, children);
        return Component.apply(null, [{},this.props.children].slice(2 - Component.length));
    }
});

export default ConditionalChildren;
