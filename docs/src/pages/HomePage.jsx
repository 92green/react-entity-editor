import React from 'react';
import {Link} from 'react-router';

export default (props) => {
    return <div>
        <h1>react-entity-editor</h1>
        <p>React Entity Editor is a small set of React components that make it easier to set up clean editor UIs, by abstracting away several patterns that commonly occur in editors.</p>
        <p>It doesn't give you any UI components like forms. Instead it sits above your user input components, providing them with actions that the user can trigger, adding user interaction flow such as confirmation prompts and success messages, and mapping those actions to operations on the underlying data.  It's also fully compatible with redux.</p>
        <h2>Examples</h2>
        <p>Start with the <Link to="dogs">standard demo with dogs</Link>.</p>
    </div>;
}
