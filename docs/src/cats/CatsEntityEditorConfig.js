import {BaseConfig} from 'react-entity-editor';

const CatsEntityEditorConfig = BaseConfig.merge({
    item: {
        single: "cat"
    },
    operations: {
        onCreate: ({onCreateCat}) => ({payload}) => {
            return onCreateCat(payload);
        },
        onUpdate: ({onUpdateCat}) => ({id, payload}) => {
            return onUpdateCat(id, payload);
        },
        onDelete: ({onDeleteCat}) => ({id}) => {
            return onDeleteCat(id);
        },
        onGo: ({onGoCat}) => ({id, name}) => {
            return onGoCat({id, name});
        }
    }
});

export default CatsEntityEditorConfig;
