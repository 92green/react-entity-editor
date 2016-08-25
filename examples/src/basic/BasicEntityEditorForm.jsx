import React from 'react';
import {EntityEditor} from 'react-entity-editor';

class BasicEntityEditorForm extends React.Component {
  render() {
    return <div>
    	<p>Form goes here</p>
    </div>;
  }
}

BasicEntityEditorForm.defaultProps = {
};

export default EntityEditor()(BasicEntityEditorForm);