# react-entity-editor

*Almost ready!™*

### Early stages of development, please prepare for large amounts of changes until version 1.0.0.

- [Examples](https://dxinteractive.github.io/react-entity-editor/)

React Entity Editor is a small set of React components that make it easier and cleaner to set up editor UIs, by abstracting away several patterns that commonly occur in editors.

It doesn't give you any UI components like forms. Instead it sits above your user input components, providing them with actions that the user can trigger, adding user interaction flow such as confirmation prompts and success messages, and mapping those actions to operations on the underlying data. It's also fully compatible with redux.

## What does it help with?

- ### User actions and UI flow
  You'll usually want to ensure that the user is warned before deleting an item, or that they receive visual feedback after an item has been successfully saved. React Entity Editor provides an easy, declarative way of configuring the series of confirmations and status notifications involved with each type of user action, and comes with a default configuration that should suit most editors. Read more about actions, workflows and tasks TODO.

- ### Declarative configuration
  Each editor is configured almost entirely in a single config file, including the definition of all operations that may take place in your editor (e.g. requests to create, update or delete items), and any parts of the configuration can be added to or overridden as needed. Read more about EntityEditorConfig TODO.

- ### Keeping track of requests
  React Entity Editor keeps knowledge of the state of each async operation, whether they are pending, successful or have errored, and makes this available to you via props. And regardless of whether an operation is synchronous or asynchronous, the code you write for React Entity Editor doesn't have to change.

- ### Prompts and modals
  React Entity Editor comes with a modal (using react-modal TODO) that already works with the UI flow setup, just add CSS for it. Or if you need more control you can provide your own, or choose to work with its props directly.


## Installation

`yarn add react-entity-editor` or `npm install react-entity-editor`

## Getting Started

Most of entity editor's functionality is applied to your editor component via the EntityEditor higher order component.

```js
import React, {Component} from 'react';
import {EntityEditor} from 'react-entity-editor';
import Config from './ExampleEntityEditorConfig';

class ExampleEditor extends Component {
    render() {
        return <div>Your editor goes here</div>;
    }
}

const withEntityEditor = EntityEditor(Config);
export default withEntityEditor(ExampleEditor);

```

All functions that you want to be able to call from Entity Editor's `operation`s must be passed to this component via props, which will probably include methods to fetch and modify data, and methods to change routes.

The EntityEditor higher order component will pass down an extra `entityEditor` prop to your component, which contains action functions to call and renderable info you can use in your editor. More info [here](#thing) TODO.

The EntityEditor higher order component must be given an `EntityEditorConfig`. This config is where you provide your app-specific behaviour. In particular this is where you provide the implementation of your `operation`s.

## Defining our terms

 - **action**

    Action are functions that the user can trigger with the UI, such as `save` or `delete`. Each action contains a `workflow`, and calling an action will start its workflow. Only one action can be in progress at a time.

 - **workflow**

    Workflows are a series of `tasks` that conditionally follow one another. The workflow progresses to subsequent tasks either by user choices or by data changes.
 
 - **task**

    Tasks are possible states in a workflow, such as `confirm`ing with the user if an operation should be performed, or `operate`-ing when a data operation is in progress. Tasks may include an `operation`, and / or may include a `status`.

 - **operation**
 
    Operations are functions that "do things" within your editor, usually firing off requests, changing data or modify the state of the UI. For example, when items are `create`d or `update`d, or when the user `go`es to another view in the editor.

 - **status**
 
    Statuses are functions that "show things" within your editor - they make the `task` renderable by returning an object of strings and JSX elements (although they can return whatever you like). For example, they are used to ask for user input, or notify the user about the status of requests. By default they appear in a customizeable modal, but can be configured to be passed down as props for more specific rendering.

## Entity Editor props

The `EntityEditor` higher order component passes down a single `entityEditor` prop. It is an object that contains the following:

  - **entityEditor.actions** `:Object<ActionTriggerFunction>`

    An object containing editor actions to be called in response to user interactions. ActionTriggerFunctions accept a single argument, an object of data to pass to the action.
  
  - **entityEditor.abilities** `Object<boolean>`

    An object with action names for keys and booleans for values. Each boolean indicates if the action is able to be started, which is useful for conditionally disabling buttons.
  
  - **entityEditor.status** `Object<any>|null`

    If a task is in progress this will be an object containing renderable info about the current task. The exact contents of this object come from the config being used, e.g. `config.tasks.<currentTask>.status`

## Entity Editor Config

TODO
