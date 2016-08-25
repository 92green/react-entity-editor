import React from 'react';
import BasicEntityEditorForm from './BasicEntityEditorForm';

class BasicEditor extends React.Component {
    render() {
    	const {
            id,
            willCopy,
            onClose,
            onGotoEdit
        } = this.props;

        return <div>
            <h1>react-entity-editor basic example</h1>

            <BasicEntityEditorForm
                id={id}
                willCopy={willCopy}
                onClose={onClose}
                onGotoEdit={onGotoEdit} />

        </div>;
    }
}

BasicEditor.propTypes =  {
    // in this example, these come from routes via EntityEditorRouter
    id: React.PropTypes.any,
    willCopy: React.PropTypes.bool,
    onClose: React.PropTypes.func,
    onGotoEdit: React.PropTypes.func
};

export default BasicEditor;
