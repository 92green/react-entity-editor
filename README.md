# react-entity-editor

A modular set of React components that makes it easy to set up user interfaces for creating, editing and deleting items.

- Maps CRUD operations to standard user actions, e.g."saving" a form will either "create" or "update" an entity.
- Modular UI so any aspect of the user interface can be customised.
- Route creation when used with react-router.
- A standard and customiseable set of confirmation messages and success notifications.

Implementation of the user interface of the editor is left to the developer, which offers great flexibility
and can be therefore used by forms including redux-form, drag and drop interfaces or any other React UI editor.

Early stages of development, please prepare for large amounts of changes until version 0.1.0.

See [examples/src](/examples/src) for examples. Both the `basic` and `router` examples ar
 currently in development but they should give an indication on how to use them.

## Example

```jsx
import {EntityEditorDefault} from 'react-entity-editor';

// in your component you provide data (id and initialValues) and callbacks (read, create, update, delete, close)

return <EntityEditorDefault
    id={userId}
    initialValues={currentUserData || {}}
    onRead={this.handleRead}
    onCreate={this.handleCreate}
    onUpdate={this.handleUpdate}
    onDelete={this.handleDelete}
    onClose={this.handleClose}
    entityName="user"
>
    <YourForm />
</EntityEditorDefault>
```

Or you can use EntityEditorDefault as a higher order component on your form.

```jsx
// in your form component file

class YourForm extends React.Component {
    ...
}

export default EntityEditorDefault()(YourForm);

// usage

return <YourForm
    id={userId}
    initialValues={currentUserData || {}}
    onRead={this.handleRead}
    onCreate={this.handleCreate}
    onUpdate={this.handleUpdate}
    onDelete={this.handleDelete}
    onClose={this.handleClose}
    entityName="user"
/>
```

Then in your form you will get access to a set of new props from Entity Editor.
See [examples/src](/examples/src) for examples. Both the `basic` and `router` examples are
 currently in the middle of development but their code should give an indication on how to use them.

## Installation

`npm install react-entity-editor`


## Components summary

- **EntityEditor** - this is the component that provides the logic for the UI flow, but provides no UI.
It's a higher order component that you use on a UI specific entity editor component, such as `EntityEditorDefault`.
- **EntityEditorDefault** - this is an example of a UI-specific entity editor. It uses the `EntityEditor` higher order component.
It's responsible for rendering the common UI elements you'll might want on all entity editors in your project, such as loading state,
user prompts such as modals. It also passing text and word manipulation methods into `EntityEditor`s config.
As it contains UI components you'll almost certainly want to customise this for your own projects and name it accordingly e.g. `EntityEditorMyProject`.
    - **TextDefaults** - provides a useful set of text defaults for prompts and word manipulations.
  If you want to customise these you can either extend from these defaults or write your own completely.
- **YourForm** - Your form component (or other kind of input) can then use `EntityEditorDefault` or your own UI-specific entity editor as a higher order component,
or simply pass your form in as a child of your `EntityEditorDefault`.
It will be provided with data props and callback props for interacting with the entity editor.

### EntityEditor

#### Accepted props

This can take the following props.

| Prop              | Required | Description    
| ----------------- | -------- | ---------------- |
| id                | Yes      | The id of the item / entity to be edited, or `null` if a new entity is to be created.
| initialValues     | Yes      | The object containing the data fo the entity you want to edit. This is passed through to the form.
| onRead            | Yes      | A callback that will be called when `EntityEditor` wants to read data into itself.<br/>It is passed a single argument, the id of the entity to be read.<br/><br/>Your callback can optionally return either a `Promise` or an object, which will be passed to your `afterRead` callback after a successful operation if you've supplied an `afterRead` prop.
| onCreate          | Yes      | A callback that will be called when `EntityEditor` wants to create an entity.<br/>It is passed a single argument, the `dataObject` containing the new entity to be created.<br/><br/>Your callback can optionally return either a `Promise` or an object, which will be passed to your `afterCreate` callback after a successful operation if you've supplied an `afterCreate` prop.<br/><br/>If you want entity editor to automatically take users to the edit page after a new entity is created using `onGotoEdit`, make sure you return the new id of the created entity in your returned object / your resolved `Promise`s data, for example:<br/>`(dataObject) => {var newId = create(dataObject); return { newId: newId };}` 
| onUpdate          | Yes      | A callback that will be called when `EntityEditor` wants to update an entity.<br/>It is passed two arguments, the `id` of the entity to update, and a `dataObject` containing updated values.<br/><br/>Your callback can optionally return either a `Promise` or an object, which will be passed to your `afterUpdate` callback after a successful operation if you've supplied an `afterUpdate` prop.
| onDelete          |          | A callback that will be called when `EntityEditor` wants to delete an entity.<br/>It is passed a single argument, the `id` of the entity to delete.<br/><br/>Your callback can optionally return either a `Promise` or an object, which will be passed to your `afterDelete` callback after a successful operation if you've supplied an `afterDelete` prop.
| onClose           | Yes      | A callback that will be called when `EntityEditor` wants to stop editing an entity.<br/>It is passed no arguments.<br/><br/> - **EntityEditorRouter:** If you're using EntityEditorRouter then EntityEditorRouter provides this prop for you.
| onGotoEdit        |          | A callback that will be called when `EntityEditor` wants to take the user to see the edit page / component for an entity.<br/>It is passed a single argument, the `id` of the entity to edit.<br/><br/> - **EntityEditorRouter:** If you're using EntityEditorRouter then EntityEditorRouter provides this prop for you.
| onLeaveHook       |          | A function that can be called externally when it is detected that the user has tried to leave the edit view. If present, `EntityEditor` passes this a function parameter so it can be consulted when the user wants to leave. It will return a boolean to the external function indicating if the user should be allowed to leave.<br/><br/> - **EntityEditorRouter:** If you're using EntityEditorRouter then EntityEditorRouter provides this prop for you.
| entityName        |          | A string of the type of entity to edit. All lowercase is preferred so text modifiers will be able to alter case. Defaults to "item".
| entityNamePlural  |          | A string of the plural of the entity. You only need to provide this if the plural is not simply `entityName` + "s".
| isReading /<br/>isCreating /<br/>isUpdating/<br/>isDeleting | | Booleans that you can use to indicate to `EntityEditor` if async data transations are taking place. This can be used to prevent certain form controls from having effect until transactions are done.<br/><br/>Synchronous data changes will not need to use these.
| allowRead /<br/>allowCreate /<br/>allowUpdate /<br/>allowDelete / | | Passing false to any of these will prohibit certain actions, and can be used to hide buttons and form controls for disallowed actions.
| errorOnRead /<br/>errorOnCreate /<br/>errorOnUpdate /<br/>errorOnDelete / | | **Experimental.** Optional objects that tell `EntityEditor` what to display when errors occur. These are triggered if any `Promises` in onRead / onCreate / onUpdate / onDelete are rejected.
| afterRead /<br/>afterCreate /<br/>afterUpdate /<br/>afterDelete /<br/>afterClose /<br/> | | Optional callbacks to be called after actions are successful. These are often passed arguments, see onRead / onCreate / onUpdate / onDelete. 

#### Props passed to children (e.g. your form)

When used by `EntityEditorDefault`, it provides the following props down to your form.

| Prop | Type | Description
| ---- | ---- | ------------ |
| id                  | Any     | The id of the entity to be edited.
| isNew               | Boolean | If the entity is new i.e. not saved anywhere yet.
| canDelete /<br/>canReset /<br/>canSave /<br/>canSaveNew | Boolean | Booleans that can be used in your form to show and hide and style depending on the user's current abilities.
| isReading /<br/>isCreating /<br/>isUpdating/<br/>isDeleting /<br/>isSaving /<br/>isWriting /<br/>isWaiting | Boolean | Booleans that you can use to indicate to `EntityEditor` if async data transations are taking place.<br/><br/>**isSaving** is true whenever isCreating or isUpdating is true.<br/>**isWriting** is true whenever isCreating, isUpdating or isDeleting is true.<br/>**isSaving** is true whenever isReading, isCreating, isUpdating or isDeleting is true.
| onSave(newDataObject)  | Function | A callback that your form can call when the user wants to save. Accepts a single argument, an object containing the data to save.
| onSaveNew  (newDataObject)         | Function | A callback that your form can call when the user wants to save an existing entity as a new entity. Accepts a single argument, an object containing the data to save.
| onClose()             | Function | A callback that your form can call when the user wants to close the edit view. Accepts no arguments.
| onDelete()            | Function | A callback that your form can call when the user wants to delete the entity. Accepts no arguments.
| onResetConfirm()      | Function | A callback that your form can call when the user wants to reset the form, losing all changes since last save. It's the form's responsibity to reset itself to its initial state, so `onResetConfirm()` returns a `Promise` that will be resolved when the user says they are sure that they want to reset. See the basic example for more info.
| onCustomConfirm(promptFunction)     | Function | A callback that your form can call when you want to dusplay a custom confirmation. Accepts a function that will be called, and expects an object to be returned, see the basic example for more info on what the function receives and what it expects in return.
| onDirty(isDirty = true)      | Function | A callback that your form can call when the user changes something on the form. `EntityEditor` will use this info to determine when certain confirmations must take place. Called with no arguments or `true` this will mark the form as dirty, or you can pass `false` to mark the form as clean.
| entityName()          | Function | A function that returns the name of the current entity. Pass this strings as arguments to modify the text e.g. `entityName('first')` will return the entity name with the first letter capitalised.
| actionName()          | Function | A function that returns the name of the current action, such as "add new" or "edit". Pass this strings as arguments to modify the text e.g. `actionyName('first')` will return the action name with the first letter capitalised.


### EntityEditorRouter

Additionally there is an optional integration with react-router 2.4.0+.
`EntityEditorRouter` provides functions to auto-generate routes and passes extra props for hooking in with router behaviour.
In your routes file this is used like so:
```jsx
import {createEditorRoutes} from 'react-entity-editor';

const editorRoutes = createEditorRoutes({
    component: ExampleUserEditPage,
    path: "users"
});

return <Route>
    <Route path="users" component={ExampleUserList} />
    {editorRoutes}
</Route>
```

This will create routes at `users/new` and `users/:id/edit`, and will also provide the `id`, `onClose`, `onGotoEdit` and `onLeaveHook` props for use by `EntityEditor`.

## License

The MIT License

Copyright (c) 2016+ Damien Clarke / Blueflag

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
