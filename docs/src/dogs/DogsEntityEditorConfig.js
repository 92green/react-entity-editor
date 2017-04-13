import {BaseConfig} from 'react-entity-editor';

/*
 *
 */

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
         * Wer'e basing this config off of BaseConfig, so you need to provide onCreate, onUpdate, onDelete for editing items
         * and onGo for navigating between views
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
        onCreate: ({dogCreate, dogGoItem}) => ({payload}) => {
            return dogCreate(payload)
                .then((result) => dogGoItem(result.id)); // once created, navigate to the edit page for the new item
        },
        onUpdate: ({dogUpdate}) => ({id, payload}) => {
            return dogUpdate(id, payload);
        },
        onDelete: ({dogDelete, dogGoList}) => ({id}) => {
            return dogDelete(id)
                .then(() => dogGoList()); // once deleted, navigate to the list page
        },
        onGo: ({dogGo}) => ({id, view}) => {
            return dogGo({id, view});
        }
    },
    operationProps: (props) => {
        /*
         * "OperationProps" allows you to pass selected function props from your editor component
         * and make them always available from within your operations.
         * Here we have all write functions and navigation functions given by the DogsStore.
         */
        return {
            dogCreate: props.onCreate,
            dogUpdate: props.onUpdate,
            dogDelete: props.onDelete,
            dogGo: props.onGo,

            // you can also define new functions with specific behaviour
            dogGoList: () => props.onGo({id: null, view: "list"}),
            dogGoNew: () => props.onGo({id: null, view: "item"}),
            dogGoItem: (id) => props.onGo({id, view: "item"})
        }
    }
});

export default DogsEntityEditorConfig;
