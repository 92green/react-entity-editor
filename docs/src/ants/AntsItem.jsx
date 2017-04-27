import React, {Component, PropTypes} from 'react';
import {EntityEditorPropType} from 'react-entity-editor';
import ButtonDelete from '../buttons/ButtonDelete';
import ButtonGoList from '../buttons/ButtonGoList';
import ButtonSave from '../buttons/ButtonSave';

class AntsItem extends Component {

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
        this.setupForm(this.props.ant);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.ant !== nextProps.ant) {
            this.setupForm(nextProps.ant);
        }
    }

    componentWillUnmount() {
        // tell entity editor that it is clean once leaving this component
        this.props.entityEditor.operations.dirty({dirty: false});
    }

    setupForm(ant) {
        // set up form
        const fields = ['name', 'legs'];
        var form = {};
        fields.forEach(field => {
            form[field] = ant ? ant[field] : "";
        });

        this.state = {
            form
        };

        // tell entity editor that the form is clean
        this.props.entityEditor.operations.dirty({dirty: false});
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
        // the go action in the ants example expects a view and an optional id
        const actionProps = {
            view: "list",
            id: null
        };
        this.props.entityEditor.actions.go(actionProps);
    }

    save() {
        // the save action in the ants example expects a payload and an optional id
        // keep in mind that this.props.ant wont exist yet if you're making a new ant
        const actionProps = {
            payload: this.state.form,
            id: this.props.ant ? this.props.ant.id : null
        };

        // the save action is supplied via the entityEditor prop
        this.props.entityEditor.actions.save(actionProps);
    }

    delete() {
        // the delete action in the ants example expects an id
        const actionProps = {
            id: this.props.ant.id
        };
        this.props.entityEditor.actions.delete(actionProps);
    }

    render() {
        const {ant, entityEditor, isNew} = this.props;
        const {item} = entityEditor.names;

        // keep in mind that this.props.ant wont exist yet if you're making a new ant
        const payload = this.state.form;
        const id = ant ? ant.id : null;

        const heading = `${ant ? "Edit" : "New"} ${item}`;

        if(!isNew && !ant) {
            return <div>No ant with this id</div>;
        }

        return <div>
            <h3>{heading}</h3>
            <div className="InputRow">
                <label htmlFor="name">Name</label>
                <input
                    value={this.state.form.name}
                    onChange={this.onChangeField('name')}
                    id="name"
                />
            </div>
            <div className="InputRow">
                <label htmlFor="legs">Legs</label>
                <input
                    value={this.state.form.legs}
                    onChange={this.onChangeField('legs')}
                    id="legs"
                />
            </div>
            <ButtonGoList
                children="Back"
                className="Button-secondary"
                entityEditor={entityEditor}
            />
            <ButtonSave
                children="Save"
                id={id}
                payload={payload}
                entityEditor={entityEditor}
            />
            {ant && // only show delete button when we have an item
                <ButtonDelete
                    children="Delete"
                    id={id}
                    entityEditor={entityEditor}
                />
            }
        </div>;
    }
}

AntsItem.propTypes = {
    ant: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        legs: PropTypes.string
    }),
    isNew: PropTypes.bool,
    entityEditor: EntityEditorPropType.isRequired
};

AntsItem.defaultProps = {
    isNew: false
};

export default AntsItem;
