import {BaseConfig} from 'react-entity-editor';

const AntsEntityEditorConfig = BaseConfig.merge({
    item: {
        /*
         * "Item" is where you can name your entities
         * it accepts "single" and "plural" strings
         * it plural is not set here, plural entities will be the single item with an "s" on the end
         * if nothing is specified here, the default name will be "item"
         */
        single: "ant"
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
        onCreate: ({antCreate, antGo}) => ({payload}) => {
            return antCreate(payload)
                .then((result) => antGo({ // once created, navigate to the edit page for the new item
                    id: result.id,
                    view: "item"
                }));
        },
        onUpdate: ({antUpdate}) => ({id, payload}) => {
            return antUpdate(id, payload);
        },
        onDelete: ({antDelete, antGo}) => ({id}) => {
            return antDelete(id)
                .then(() => antGo({ // once deleted, navigate to the list page
                    id: null,
                    view: "list"
                }));
        },
        onGo: ({antGo}) => ({id, view}) => {
            return antGo({id, view});
        }
    },
    operationProps: (props) => {
        /*
         * "OperationProps" allows you to pass selected function props from your editor component
         * and make them always available from within your operations.
         * Here we have all write functions and navigation functions given by the AntsStore.
         */

        return {
            antCreate: props.onCreate,
            antUpdate: props.onUpdate,
            antDelete: props.onDelete,

            /*
             * This example uses a router instead of the props.onGo used by other examples
             * so we map our "go" actionProps to the routers methods
             */

            antGo: ({view, id}) => {
                if(view == "item" && id) {
                    return props.history.push(`/ants/item/${id}`);
                }
                if(view == "item" && !id) {
                    return props.history.push(`/ants/item`);
                }
                if(view == "list") {
                    return props.history.push(`/ants`);
                }
            }
        }
    }
});

export default AntsEntityEditorConfig;
