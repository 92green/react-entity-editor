import React from 'react';

function CustomError(props) {
    // this may be displayed in page, when loading a list or item has failed
    // or within a prompt (usually a modal) when saving, editing or deleting has failed
    // it is passed an error prop containing the error object (or other data)
    // returned from the rejected promise
    return <div>
        <p><strong>Custom error ({props.error.get('status')})</strong></p>
        <p><em>"{props.error.get('message')}"</em></p>
    </div>;
}

export default CustomError;
