/* @flow */

import React from 'react';
import Compose from 'stampy/lib/util/Compose';
import {connect} from 'react-redux';
import {initialState} from '../EntityEditorState';

type Props = {};
type ChildProps = {
    entityEditorState: Object,
    entityEditorStateChange: Function
};

// this is required to be able to cope with multiple calls to entityEditorStateChange without a re-render
// makes entityEditorStateChange behave like setState normally does

function ShallowMergeChanges(Component) {
    return class ShallowMergeChanges extends React.Component {
        upToDateValue: Object;

        constructor(props: Object) {
            super(props);
            this.upToDateValue = props.entityEditorState;
        }

        componentWillReceiveProps({entityEditorState}: Object) {
            this.upToDateValue = entityEditorState;
        }

        render() {
            return <Component
                {...this.props}
                entityEditorStateChange={(payload) => {
                    this.props.entityEditorStateChange({
                        ...this.upToDateValue,
                        ...payload
                    });
                }}
            />;
        }
    }
}

export default function EntityEditorState(config: EntityEditorConfig): Function {
    let editorKey = "thing";
    return Compose(
        connect((state) => ({
            entityEditorState: state.entityEditor[editorKey] || initialState(config)
        })),
        (Component) => (props) => {
            return <Component
                {...props}
                entityEditorStateChange={(state) => props.dispatch({
                    type: "ENTITY_EDITOR_SET",
                    payload: {
                        editorKey,
                        state
                    }
                })}
            />;
        },
        ShallowMergeChanges
    );
}
