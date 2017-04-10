import {BaseConfig} from 'react-entity-editor';

const CatsEntityEditorConfig = BaseConfig.merge({
    item: {
        single: "cat"
    },
    tasks: {
        saveOperate: {
            statusOutput: "props"
        },
        saveSuccess: {
            statusOutput: "props"
        }
    },
    operations: {
        onCreate: ({onCreateCat, onGoItem}) => ({payload}) => {
            return onCreateCat(payload)
                // once created, navigate to the edit page for the new item
                .then((result) => onGoItem(result.id));
        },
        onUpdate: ({onUpdateCat}) => ({id, payload}) => {
            return onUpdateCat(id, payload);
        },
        onDelete: ({onDeleteCat, onGoList}) => ({id}) => {
            return onDeleteCat(id)
                // once deleted, navigate to the list page
                .then(() => onGoList());
        },
        onGo: ({onGoCat}) => ({id, name}) => {
            return onGoCat({id, name});
        }
    }
});

export default CatsEntityEditorConfig;
