import {BaseConfig} from 'react-entity-editor';

const DogsEntityEditorConfig = BaseConfig.merge({
    item: {
        /*
         * "Item" is where you can name your entities
         * it accepts "single" and "plural" strings
         * it plural is not set here, plural entities will be the single item with an "s" on the end
         * if nothing is specified here, the default name will be "item"
         */
        single: "dog"
    },
    operations: {
        /*
         * "Operations" is where you define what happens for each operations
         * We're basing our config off BaseConfig which provides most things for you already
         * but you'll need to provide create, update and delete functions for editing items
         * and a go function for navigating between views
         *
         * In each operation the first function signature provides an operationProps object.
         * This contains all the data modifing functions returned from operationProps
         * (and also all operation functions in this editor, which isn't used in this example)
         *
         * All operationProps functions return a promise, even when the original function does not.
         *
         * The second function signature provides an actionProps object.
         * This contains the data to use with your operations, passed from the original action function call
         *
         * Always return the promise from these functions if you have one!
         * If not, then returning nothing or true will be interpreted as a success,
         * or returning false will be interpreted as an error.
         */
        create: ({props, operations}) => ({payload}) => {
            return props.onCreate(payload)
                .then((result) => operations.go({ // once created, navigate to the edit page for the new item
                    id: result.id,
                    view: "item"
                }));
        },
        update: ({props}) => ({id, payload}) => {
            return props.onUpdate(id, payload);
        },
        delete: ({props, operations}) => ({id}) => {
            return props.onDelete(id)
                .then(() => operations.go({ // once deleted, navigate to the list page
                    id: null,
                    view: "list"
                }));
        },
        go: ({props}) => ({id, view}) => {
            return props.onGo({id, view});
        }
    }
});

export default DogsEntityEditorConfig;
