import React from 'react';
import {EntityEditorDefault} from '../../../dist/index'; // normally this would be "from 'react-entity-editor'"

class BasicEntityEditorForm extends React.Component {

    //
    // set initial form state
    //

    constructor(props) {
        super(props);
        this.state = {};
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
        const form = this.state.form;
        this.setState({
            form: {
                ...form,
                firstName: e.target.value
            }
        });
  
        // tell entity editor that the form is dirty
        this.props.onDirty();
    }

    handleLastNameChange(e) {
        const form = this.state.form;
        this.setState({
            form: {
                ...form,
                lastName: e.target.value
            }
        });

        // tell entity editor that the form is dirty
        this.props.onDirty();
    }

    handleUserTypeChange(e) {
        const form = this.state.form;
        const userType = e.target.value;

        this.props.onCustomConfirm(() => ({
            type: "confirm",
            title: "Warning",
            message: `Are you sure you want to change the user type to "${userType}"?`,
            yes: "Yes",
            no: "Cancel"
        })).then(() => {
            this.setState({
                form: {
                    ...form,
                    userType
                }
            });

            // tell entity editor that the form is dirty
            this.props.onDirty();
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
        // onResetConfirm will get entity editor to handle confirmation behaviour and resolves its returned promise if the user chooses to reset
        this.props.onResetConfirm().then(() => {
            this.setState({
                form: Object.assign({}, this.state.formReset)
            });
        });
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
        if(this.props.isSaving) {
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
                <p>
                    <label>User type</label>
                    <select value={this.state.form.userType} onChange={this.handleUserTypeChange.bind(this)}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </p>
                {this.state.form.id && 
                    <p>
                        <label>ID</label>
                        <input type="text" value={this.state.form.id} disabled />
                    </p>
                }
                {this.props.canSave &&
                    <input className="Button" type="submit" value={saveText} />
                }
                {this.props.canSaveNew &&
                    <span className="Button Button-small" onClick={this.handleSaveNew.bind(this)}>Save as new copy</span>
                }
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