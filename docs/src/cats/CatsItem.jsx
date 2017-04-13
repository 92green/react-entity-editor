import React, {Component, PropTypes} from 'react';
import {EntityEditorPropType} from 'react-entity-editor';

class CatsItem extends Component {

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
        this.setupForm(this.props.cat);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.cat !== nextProps.cat) {
            this.setupForm(nextProps.cat);
        }
    }

    setupForm(cat) {
        // set up form
        const fields = ['name', 'toy'];
        var form = {};
        fields.forEach(field => {
            form[field] = cat ? cat[field] : "";
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
            // note that you must pass in an object with a boolean property of 'dirty'
            const actionProps = {
                dirty: true
            };
            this.props.entityEditor.actions.dirty(actionProps);
        };
    }

    back() {
        // the go action in the cats example expects a view and an optional id
        const actionProps = {
            view: "list",
            id: null
        };
        this.props.entityEditor.actions.go(actionProps);
    }

    save() {
        // the save action in the cats example expects a payload and an optional id
        // keep in mind that this.props.cat wont exist yet if you're making a new cat
        const actionProps = {
            payload: this.state.form,
            id: this.props.cat ? this.props.cat.id : null
        };

        // the save action is supplied via the entityEditor prop
        this.props.entityEditor.actions.save(actionProps);
    }

    delete() {
        // the delete action in the cats example expects an id
        const actionProps = {
            id: this.props.cat.id
        };
        this.props.entityEditor.actions.delete(actionProps);
    }

    render() {
        const {cat, entityEditor} = this.props;
        const {status, abilities} = entityEditor;

        return <div>
            <h3>{cat ? "Edit" : "New"} cat</h3>
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
            <button className="Button Button-grey" onClick={this.back} disabled={!abilities.go}>Back</button>
            <button className="Button" onClick={this.save} disabled={!abilities.save}>Save</button>
            {this.props.cat && // only show delete button when we have an item
                <button className="Button" onClick={this.delete} disabled={!abilities.delete}>Delete</button>
            }
            {status && // if a status comes down as props, render it
                <em>{status.title}</em>
            }
        </div>;
    }
}

CatsItem.propTypes = {
    cat: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        toy: PropTypes.string
    }),
    entityEditor: EntityEditorPropType.isRequired
};

export default CatsItem;
