import React from 'react';
import {EntityEditorDefault} from 'react-entity-editor';

class BasicEntityEditorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        loaded: false,
        dirty: false,
        form: {
            firstName: '',
            lastName: '',
            id: ''
        },
        formReset: {
            firstName: '',
            lastName: '',
            id: ''
        }
    };
  }

  //
  // these need to actually compare initialFGValues and update the form if they've changed :(
  //

  componentWillMount() {
    this.initForm(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.initForm(nextProps);
  }

  initForm(props) {
    if(props.initialValues && !this.state.loaded) {
      this.setState({
        form: {
            ...props.initialValues
        },
        formReset: {
            ...props.initialValues
        },
        loaded: true
      });
    }
  }

  handleFirstNameChange(e) {
    var form = this.state.form;
    form.firstName = e.target.value;
    this.setState({
        form,
        dirty: true
    });
  }

  handleLastNameChange(e) {
    var form = this.state.form;
    form.lastName = e.target.value;
    this.setState({
        form,
        dirty: true
    });
  }

  resetForm() {
    this.setState({
        form: Object.assign({}, this.state.formReset),
        dirty: false
    });
  }

  //
  // entity editor callbacks
  //
  
  handleSubmit(e) {
    e.preventDefault();
    this.setState({
        dirty: false,
        formReset: Object.assign({}, this.state.form)
    });

    // ask entity editor to save
    this.props.onSave(this.state.form);
  }

  handleClose() {
    // ask entity editor to close
    // onClose accepts a boolean that sets whether the for is dirty (has changed since last save)
    this.props.onClose(this.state.dirty);
  }

  handleReset() {
    if(this.props.onReset) {
        // the form is responsible for resetting, but entity editor still wants to be asked first so it can handle confirmation behaviour
        // if an onReset prop has been supplied, then call it and wait for the promise to return to actually reset the form
        this.props.onReset(this.state.dirty).then(this.resetForm.bind(this), (error) => {});
    } else {
        // or else just reset the form
        this.resetForm.bind(this);
    }
  }

  handleDelete() {
    // ask entity editor to delete
    this.props.onDelete();
  }

  //
  // render
  //

  render() {

    var saveText;
    if(!this.props.canSave) {
        saveText = `Saving`;
    } else if(this.props.willCopy) {
        saveText = `Save new copy`;
    } else if(this.props.isNew) {
        saveText = `Create new`;
    } else { 
        saveText = `Save`;
    }

    return <div>
    	<form onSubmit={this.handleSubmit.bind(this)}>
    		<p>
    			<label>First name</label>
    			<input type="text" value={this.state.form.firstName} onChange={this.handleFirstNameChange.bind(this)}/>
    		</p>
    		<p>
    			<label>Last name</label>
    			<input type="text" value={this.state.form.lastName} onChange={this.handleLastNameChange.bind(this)}/>
    		</p>
    		{this.state.form.id && 
                <p>
    			    <label>ID</label>
    			    <input type="text" value={this.state.form.id} disabled />
    		    </p>
            }
    		<input className="Button" type="submit" value={saveText} />
            <span className="Button Button-small" onClick={this.handleClose.bind(this)}>Close</span>
            {this.state.dirty &&
                <span className="Button Button-small" onClick={this.handleReset.bind(this)}>Reset</span>
            }
            {this.props.canDelete &&
                <span className="Button Button-small" onClick={this.handleDelete.bind(this)}>Delete</span>
            }
    	</form>
    </div>;
  }
}

BasicEntityEditorForm.defaultProps = {
};

export default EntityEditorDefault()(BasicEntityEditorForm);