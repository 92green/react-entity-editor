import React from 'react';
import {EntityEditorDefault} from 'react-entity-editor';

class BasicEntityEditorForm extends React.Component {

  //
  // set initial form state
  //

  constructor(props) {
    super(props);
    this.state = {
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
  // set form values if initialValues ever changes
  //

  componentWillMount() {
    this.initForm(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if(JSON.stringify(this.props.initialValues) != JSON.stringify(nextProps.initialValues)) {
      this.initForm(nextProps);
    }
  }

  initForm(props) {
    this.setState({
      form: {
          ...props.initialValues
      },
      formReset: {
          ...props.initialValues
      }
    });
  }

  //
  // keep form state
  //

  handleFirstNameChange(e) {
    var form = this.state.form;
    form.firstName = e.target.value;
    this.setState({ form });

    // tell entity editor that the form is dirty
    this.props.onDirty();
  }

  handleLastNameChange(e) {
    var form = this.state.form;
    form.lastName = e.target.value;
    this.setState({ form });

    // tell entity editor that the form is dirty
    this.props.onDirty();
  }

  //
  // form reset
  //

  resetForm() {
    console.log("reset doesn't work on new items >:(", this.state.formReset);
    this.setState({
        form: Object.assign({}, this.state.formReset),
        dirty: false
    });
  }

  //
  // form events calling entity editor callbacks
  //
  
  handleSubmit(e) {
    e.preventDefault();
    this.setState({
        formReset: Object.assign({}, this.state.form)
    });

    // ask entity editor to save (and set dirty to false)
    this.props.onSave(this.state.form);
  }

  handleSaveNew() {
    this.setState({
        formReset: Object.assign({}, this.state.form)
    });

    // ask entity editor to save as new copy (and set dirty to false)
    this.props.onSaveNew(this.state.form);
  }

  handleClose() {
    // ask entity editor to close
    this.props.onClose();
  }

  handleReset() {
    if(this.props.onReset) {
      // the form is responsible for resetting, but entity editor still wants to be asked first so it can handle confirmation behaviour
      // if an onReset prop has been supplied, then call it and wait for the promise to return to actually reset the form
      this.props.onReset().then(this.resetForm.bind(this), (error) => {});
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
        <span className="Button Button-small" onClick={this.handleSaveNew.bind(this)}>Save as new</span>
        <span className="Button Button-small" onClick={this.handleClose.bind(this)}>Close</span>
        {this.props.canReset &&
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