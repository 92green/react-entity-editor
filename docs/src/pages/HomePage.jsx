import React from 'react';
import {Link} from 'react-router';

export default (props) => {
    return <div>
        <h1>react-entity-editor</h1>
        <h4>Early stages of development, please prepare for large amounts of changes until version 1.0.0.</h4>
        <p>React Entity Editor is a set of React components that makes it easy to set up user interfaces for listing, creating, editing and deleting items that correlate strongly with items in a database. These 'admin' user interfaces are superficially easy but can quickly increase in complexity.</p>
        <p>React Entity Editor aims to provide a clear separation between the user interfaces that display or edit data, the actions that read or modify data, and the conditions, prompts and confirmation that can happen around each action.</p>
        <p>It does not manage your form state for you, or even provide you with a form at all. It sits above your form / user input components, providing them with a useful set of props and actions, confirming the user's actions where necessary, and mapping the form's actions to your CRUD operations.</p>
        <h2>Demos</h2>
        <p>Start with the <Link to="dogs">standard setup with dogs</Link>.</p>
    </div>;
}
