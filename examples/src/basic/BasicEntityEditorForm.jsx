import React from 'react';
import {EntityEditor} from 'react-entity-editor';

class BasicEntityEditorForm extends React.Component {
  render() {
    console.log(this.props);
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

BasicEntityEditorForm.defaultProps = {
};

export default EntityEditor()(BasicEntityEditorForm);