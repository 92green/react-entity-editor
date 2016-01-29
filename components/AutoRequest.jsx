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
            nextProps = fromJS(nextProps);

            var booleanTest = propKeys
                .map(ii => {
                    var keyPath = ii.split('.');
                    return thisProps.getIn(keyPath) !== nextProps.getIn(keyPath);
                })
                .indexOf(true)

            if(booleanTest !== -1) {
                outputFunction(nextProps.toJS());
            }
        }
        render() {
            return <ComposedComponent {...this.props} />;
        }
    }
}
