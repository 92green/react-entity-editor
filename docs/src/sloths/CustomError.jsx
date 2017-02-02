import React from 'react';

function CustomError(props) {
    // this may be displayed in page, when loading a list or item has failed
    // or within a prompt (usually a modal) when saving, editing or deleting has failed
    return <div>
        <p><strong>Custom error</strong></p>
        <p><em>"{props.error.message}"</em></p>
    </div>;
}

export default CustomError;
