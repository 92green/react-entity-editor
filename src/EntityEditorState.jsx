/* @flow */

import React from 'react';
import StateHock from 'stampy/lib/hock/StateHock';
import Compose from 'stampy/lib/util/Compose';

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

export const initialState = (config: EntityEditorConfig) => ({
    editor: config.get('initialEditorState'),
    workflow: null
});

export default function EntityEditorState(config: EntityEditorConfig): Function {
    return Compose(
        StateHock({
            valueProp: () => 'entityEditorState',
            onChangeProp: () => 'entityEditorStateChange',
            initialState: () => initialState(config)
        }),
        ShallowMergeChanges
    );
}
