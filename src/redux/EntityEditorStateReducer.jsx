/* @flow */

export default function EntityEditorStateReducer(state: Object = {}, action: Object) {
    if(action.type === "ENTITY_EDITOR_SET") {
        return {
            ...state,
            [action.payload.editorKey]: action.payload.state
        };
    }
    return state;
}
