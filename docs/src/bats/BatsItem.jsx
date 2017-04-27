import React, {Component, PropTypes} from 'react';
import {EntityEditorPropType} from 'react-entity-editor';

class BatsItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            form: {}
        };

        // bind methods to this class
        this.onChangeField = this.onChangeField.bind(this);
        this.back = this.back.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentWillMount() {
        this.setupForm(this.props.bat);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.bat !== nextProps.bat) {
            this.setupForm(nextProps.bat);
        }
    }

    setupForm(bat) {
        // set up form
        const fields = ['name', 'diet'];
        var form = {};
        fields.forEach(field => {
            form[field] = bat ? bat[field] : "";
        });

        this.state = {
            form
        };
    }

    onChangeField(field) {
        return (event) => {
            // set the new state of the form
            var form = Object.assign({}, this.state.form);
            form[field] = event.target.value;
            this.setState({form});

            // tell entity editor that the form is now dirty,
            // so that it knows when to warn the user about unsaved changes.
            // we use the dirty operation for this, which you must pass in an object with a boolean property of 'dirty'
            this.props.entityEditor.operations.dirty({dirty: true});
        };
    }

    back() {
        // the go action in the bats example expects a view and an optional id
        const actionProps = {
            view: "list",
            id: null
        };
        this.props.entityEditor.actions.go(actionProps);
    }

    save() {
        // the save action in the bats example expects a payload and an optional id
        // keep in mind that this.props.bat wont exist yet if you're making a new bat
        const actionProps = {
            payload: this.state.form,
            id: this.props.bat ? this.props.bat.id : null
        };

        // the save action is supplied via the entityEditor prop
        this.props.entityEditor.actions.save(actionProps);
    }

    delete() {
        // the delete action in the bats example expects an id
        const actionProps = {
            id: this.props.bat.id
        };
        this.props.entityEditor.actions.delete(actionProps);
    }

    render() {
        const {bat, entityEditor} = this.props;
        const {status, abilities} = entityEditor;

        return <div>
            <h3>{bat ? "Edit" : "New"} bat</h3>
            <div className="InputRow">
                <label htmlFor="name">Name</label>
                <input
                    value={this.state.form.name}
                    onChange={this.onChangeField('name')}
                    id="name"
                />
            </div>
            <div className="InputRow">
                <label htmlFor="diet">Diet</label>
                <input
                    value={this.state.form.diet}
                    onChange={this.onChangeField('diet')}
                    id="diet"
                />
            </div>
            <button className="Button Button-secondary" onClick={this.back} disabled={!abilities.go}>Back</button>
            <button className="Button" onClick={this.save} disabled={!abilities.save}>Save</button>
            {this.props.bat && // only show delete button when we have an item
                <button className="Button" onClick={this.delete} disabled={!abilities.delete}>Delete</button>
            }
        </div>;
    }
}

BatsItem.propTypes = {
    bat: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        diet: PropTypes.string
    }),
    entityEditor: EntityEditorPropType.isRequired
};

export default BatsItem;
