import {BaseConfig} from 'react-entity-editor';

const CatsEntityEditorConfig = BaseConfig.merge({
    item: {
        single: "cat"
    },
    operations: {
        onCreate: () => ({payload, catModifier}) => {
            // catModifier methods return a promise, so make sure you return it
            return catModifier.create(payload);
        },
        onUpdate: () => ({id, payload, catModifier}) => {
            return catModifier.update(id, payload);
        },
        onDelete: () => ({id, catModifier}) => {
            return catModifier.delete(id);
        },
        onGo: () => ({id, name, onGo}) => {
            onGo({id, name});
        }
    }
});

export default CatsEntityEditorConfig;
