import {BaseConfig, ReactRouter4Config} from 'react-entity-editor';

//
// IMPORTANT:
// for proper react router integration you must merge in the react router 4 config
// see below
//

const AntsEntityEditorConfig = BaseConfig
    .merge(ReactRouter4Config)
    .merge({
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
                    // once created, navigate to the edit page for the new item
                    // the actionProps here accept a react-router location object
                    .then((result) => operations.go({
                        location: {
                            pathname: `/ants/item/${result.id}`
                        }
                    }));
            },
            update: ({props}) => ({id, payload}) => {
                return props.onUpdate(id, payload);
            },
            delete: ({props, operations}) => ({id}) => {
                return props.onDelete(id)
                    // once deleted, navigate to the list page
                    // the actionProps here accept a react-router location object
                    .then(() => operations.go({
                        location: {
                            pathname: `/ants`
                        }
                    }));
            }
        }
    });

export default AntsEntityEditorConfig;
