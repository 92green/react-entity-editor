# react-entity-editor

### Early stages of development, please prepare for large amounts of changes until version 1.0.0.

- [Examples and documentation](https://dxinteractive.github.io/react-entity-editor/)

React Entity Editor is a set of React components that makes it easy to set up user interfaces for listing, creating, editing and deleting items that correlate strongly with items in a database. These 'admin' user interfaces are superficially easy but can quickly increase in complexity.

React Entity Editor aims to provide a clear separation between the user interfaces that display or edit data, the actions that read or modify data, and the conditions, prompts and confirmation that can happen around each action.

It does not manage your form state for you, or even provide you with a form at all. It sits above your form / user input components, providing them with a useful set of props and actions, confirming the user's actions where necessary, and mapping the form's actions to your CRUD operations.

### Rewrite

Entity Editor is currently undergoing a re-write to also encompass listing entities (and editing in lists), better handle navigation, allow for easy user-defined actions and avoid code repetition by making heavier use of config files. The re-write is almost complete, and will be finalised over the next month.

## Installation

`npm install react-entity-editor`
