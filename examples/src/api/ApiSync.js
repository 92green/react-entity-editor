import React, {Component, cloneElement} from 'react';
import {connect} from 'react-redux';
import {fromJS} from 'immutable';
import {
    SelectItem,
    SelectList,
    SelectRequestState
} from './Select';

const syncMethods = fromJS({
    get: SelectItem,
    list: SelectList
});

function createSync(action, methodName, type) {
    return (argFunction) => {
        const callArgFunction = (props) => {
            var res = {
                arg: null,
                requested: false
            };
            argFunction(props, aa => {
                res.arg = aa;
                res.requested = true;
            });
            return res;
        };
        return (ComposedComponent) => {
            class ApiSync extends Component {
                componentWillMount() {
                    if(!argFunction) {
                        this.props.dispatch(action());
                        return;
                    }
                    const thisArg = callArgFunction(this.props);
                    if(thisArg.requested) {
                        this.props.dispatch(action(thisArg.arg));
                    }
                }
                componentWillReceiveProps(nextProps: Object) {
                    if(!argFunction) {
                        return;
                    }
                    const thisArg = callArgFunction(this.props);
                    const nextArg = callArgFunction(nextProps);
                    if(nextArg.requested && thisArg.arg != nextArg.arg) {
                        this.props.dispatch(action(nextArg.arg));
                    }
                }
                render() {
                    return <ComposedComponent {...this.props} />;
                }
            }

            const withRedux = connect((state, props) => {
                const syncMethod = syncMethods.get(methodName);
                if(!syncMethod) {
                    return {};
                }
                return {
                    [`${type}_${methodName}`]: syncMethod(state, type, argFunction && callArgFunction(props).arg),
                    ...SelectRequestState(state, type, methodName)
                };
            });

            return withRedux(ApiSync);
        };
    }
}

export default function ApiSync(apiActions) {
    return fromJS(apiActions)
        .map((actionSet, type) => {
            return actionSet
                .filter((action, methodName) => syncMethods.keySeq().includes(methodName))
                .map((action, methodName) => createSync(action, methodName, type));
        })
        .toJS();
}
