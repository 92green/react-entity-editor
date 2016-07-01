import React, { Component, PropTypes } from 'react';
import {fromJS} from 'immutable';

export default (propKeys, outputFunction) => (ComposedComponent) => {
    return class AutoRequest extends Component {
        constructor(props, context) {
            super(props, context);
        }
        componentWillMount() {
            outputFunction(this.props);
        }
        componentWillReceiveProps(nextProps) {
            // make props immutable Maps
            var thisProps = fromJS(this.props);
            otherProps = fromJS(nextProps);
            var booleanTest = propKeys
                .map(ii => {
                    var keyPath = ii.split('.');

                    return thisProps.getIn(keyPath) !== otherProps.getIn(keyPath);
                })
                .indexOf(true)

            if(booleanTest !== -1) {
                outputFunction(nextProps);
            }
        }
        render() {
            return <ComposedComponent {...this.props} />;
        }
    }
}
