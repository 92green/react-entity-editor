# react-entity-editor

### Early stages of development, please prepare for large amounts of changes until version 1.0.0.

React Entity Editor is a modular set of React components that makes it easy to control user flow when editing data, such as showing confirmation and warning messages, navigation between views and handling loading and error views.
This does **not** manage your form state for you, or even provide you with a form at all. It sits above your form, providing your form with a useful set of props and callbacks, confirming the user's actions where necessary, and mapping the form's actions to your CRUD operations.

In fact it doesn't even need a form. Implementation of the user interface of the editor is left to the developer, which offers great flexibility
and can be therefore used by forms including `redux-form`, drag and drop interfaces or any other React UI editor.

- Maps CRUD operations to standard user actions, e.g."saving" a form will either "create" or "update" an entity.
- Route creation when used with react-router.
- A standard and customiseable set of confirmation messages and success notifications.
- Loading and error views

### Rewrite

Entity Editor is currently undergoing a re-write to also encompass listing entities (and editing in lists), better handle navigation, allow for easy user-defined actions and avoid code repetition by making heavier use of config files. Internally classes will have more clearly defined roles, will make use of flow types, and a proper documentation site will be generated.

Because of this the examples are now out of date, but will be updated shortly.

## Installation

`npm install react-entity-editor`
