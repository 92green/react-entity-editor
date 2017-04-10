# react-entity-editor

### Early stages of development, please prepare for large amounts of changes until version 1.0.0.

- [Examples and documentation](https://dxinteractive.github.io/react-entity-editor/)

React Entity Editor is a small set of React components that provide a clean, customisable interface for handling user interactions and CRUD operations in editors.

Confirmation prompts and status messages can be easily applied around various user actions. So by default the user will be warned before deleting an item, or discarding unsaved changes, and notified of the success or failure of any operations they perform.

Each editor is configured almost entirely in a single config file, including the definition of all operations that may take place in your editor, so even complex editors with many actions still remain organised. And any parts of the configuration can be added to or overridden as needed.

## Installation

`yarn add react-entity-editor` or `npm install react-entity-editor`

## Getting Started

Most of entity editor's functionality is applied to your editor component via the EntityEditor higher order component.

Example here. TODO

All functions that you want to be able to call from Entity Editor's `operation`s must be passed to this component via props, which will probably include methods to fetch and modify data, and methods to change routes.

The EntityEditor higher order component will pass down an extra `entityEditor` prop to your component, which contains action functions to call and renderable info you can use in your editor. More info [here](#thing) TODO.

The EntityEditor higher order component must be given an `EntityEditorConfig`. This config is where you provide your app-specific behaviour. In particular this is where you provide the implementation of your `operation`s.

## Words you might like to know

  - **actions** are functions that the user can trigger with the UI, such as `save` or `delete`. Each action contains a `workflow`, and calling an action will start its workflow.
  - **workflows** are a series of `tasks` that conditionally follow one another. The workflow progresses to subsequent tasks either by user choices or by data changes.
  - **tasks** are possible states in a workflow, such as `confirm`ing with the user if an operation should be performed, or `operate`-ing when an operation is in progress. Tasks may include an `operation`, and / or may include a `status` and `statusOutput`.
  - **operations** are functions that "do things" within your editor, usually firing off requests, changing data or modify the state of the UI. For example, when items are `create`d or `update`d, or when the user `go`es to another view in the editor.
  - **statuses** are functions that "show things" within your editor - they make the `task` renderable by returning an object of strings and JSX elements (although they can return whatever you like). For example, they are used to ask for user input, or notify the user about the status of requests. By default they appear in a modal, but can be configured to be passed down as props for more specific rendering.

## Entity Editor props

The `EntityEditor` higher order component passed down a single `entityEditor` prop. It is an object that contains the following:

  - **entityEditor.actions** *:Object<ActionTriggerFunction>* An object containing editor actions to be called in response to user interactions. ActionTriggerFunctions accept a single argument, an object of data to pass to the action.
  - **entityEditor.abilities** *Object<boolean>* An object with action names for keys and booleans for values. Each boolean indicates if the action is able to be started, which is useful for conditionally disabling buttons.
  - **entityEditor.status** *Object<any>|null* If a task is in progress this will be an object containing renderable info about the current task. The exact contents of this object come from the config being used, e.g. *config.actions.<currentAction>.tasks.<currentTask>.status*

## Entity Editor Config


