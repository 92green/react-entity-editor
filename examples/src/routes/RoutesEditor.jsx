import React from 'react';
import RoutesEntityEditorForm from './RoutesEntityEditorForm';

class RoutesEditor extends React.Component {
    render() {
    	const {
            id,
            willCopy,
            onClose,
            onGotoEdit
        } = this.props;

        return <div>
            <h1>react-entity-editor routes example</h1>

            <RoutesEntityEditorForm
                id={id}
                willCopy={willCopy}
                onClose={onClose}
                onGotoEdit={onGotoEdit} />

        </div>;
    }
}

RoutesEditor.propTypes =  {
    // in this example, these come from routes via EntityEditorRouter
    id: React.PropTypes.any,
    willCopy: React.PropTypes.bool,
    onClose: React.PropTypes.func,
    onGotoEdit: React.PropTypes.func
};

export default RoutesEditor;
