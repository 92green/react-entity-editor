import React, {Component} from 'react';

class CatsItemForm extends Component {

    constructor(props) {
        super(props);

        // set up initial form state with any values from cat
        const fields = ['name', 'toy'];
        var form = {};
        fields.forEach(field => {
            form[field] = props.cat ? props.cat[field]) : "";
        });
        this.state = {form};

        // bind methods to this class
        this.onChangeField = this.onChangeField.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
    }

    onChangeField(field) {
        return (event) => {
            // set the new state of the form
            var form = Object.assign({}, this.state.form);
            form[field] = event.target.value;
            this.setState({form});

            // tell entity editor that the form is now dirty,
            // so that it knows when to warn the user about unsaved changes.
            // note that you must pass in an object with a boolean property of 'dirty'
            const actionProps = {
                dirty: true
            };
            this.props.entityEditor.actions.dirty(actionProps);
        };
    }

    save() {
        // the save action expects a payload and an optional id
        // keep in mind that this.props.cat wont exist yet if you're making a new cat
        const actionProps = {
            payload: this.state.form,
            id: this.props.cat ? this.props.cat.id : null
        };

        // the save action is supplied via the entityEditor prop
        this.props.entityEditor.actions.save(actionProps);
    }

    delete() {
        // the delete action expects an id
        const actionProps = {
            id: this.props.cat.id
        };
        this.props.entityEditor.actions.delete(actionProps);
    }

    render() {
        const {entityEditor} = this.props;
        return <div>
            <div className="InputRow">
                <label htmlFor="name">Name</label>
                <input
                    value={this.state.form.name}
                    onChange={this.onChangeField('name')}
                    id="name"
                />
            </div>
            <div className="InputRow">
                <label htmlFor="toy">Toy</label>
                <input
                    value={this.state.form.toy}
                    onChange={this.onChangeField('toy')}
                    id="toy"
                />
            </div>
            <button className="Button Button-grey" onClick={entityEditor.actions.go.bind(this, {name: "list"})}>Back</button>
            <button className="Button" onClick={this.save}>Save</button>
            {this.props.cat && // only show delete button when we have an item
                <button className="Button" onClick={this.delete}>Delete</button>
            }
            {entityEditor.status && // if a status comes down as props, render it
                <em>{entityEditor.status.title}</em>
            }
        </div>;
    }
}

// TODO  props validation

export default CatsItemForm;
