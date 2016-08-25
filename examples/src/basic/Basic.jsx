import React from 'react';

class Basic extends React.Component {
    render() {
    	const {
            id,
            willCopy,
            onClose,
            onGotoEdit
        } = this.props;

        return <div>
            <h1>react-entity-editor basic example</h1>
            <p>Add new button goes here</p>
            <p>List goes here</p>
        </div>;
    }
}

Basic.propTypes =  {
    // these will come from routes via EntityEditorRouter
    id: React.PropTypes.any,
    willCopy: React.PropTypes.bool,
    onClose: React.PropTypes.func,
    onGotoEdit: React.PropTypes.func
};

export default Basic;
