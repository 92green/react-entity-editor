import React from 'react';
import {EntityEditor} from 'react-entity-editor';

class RoutesEntityEditorForm extends React.Component {
  render() {
    return <div>
    	<form>
    		<p>
    			<label>First name</label>
    			<input type="text" value="..." />
    		</p>
    		<p>
    			<label>Last name</label>
    			<input type="text" value="..." />
    		</p>
    		<p>
    			<label>ID</label>
    			<input type="text" value="..." disabled />
    		</p>
    		<input type="submit" value="Save" />
    	</form>
    </div>;
  }
}

RoutesEntityEditorForm.defaultProps = {
};

export default EntityEditor()(RoutesEntityEditorForm);