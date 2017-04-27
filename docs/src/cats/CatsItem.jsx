import React, {Component, PropTypes} from 'react';
import {EntityEditorPropType} from 'react-entity-editor';
import ButtonDelete from '../buttons/ButtonDelete';
import ButtonGoList from '../buttons/ButtonGoList';
import ButtonSave from '../buttons/ButtonSave';

class CatsItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            form: {}
        };

        // bind methods to this class
        this.onChangeField = this.onChangeField.bind(this);
    }

    componentWillMount() {
        this.setupForm(this.props.cat);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.cat !== nextProps.cat) {
            this.setupForm(nextProps.cat);
        }
    }

    componentWillUnmount() {
        // tell entity editor that it is clean once leaving this component
        this.props.entityEditor.operations.dirty({dirty: false});
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

    render() {
        const {cat, entityEditor} = this.props;
        const {item} = entityEditor.names;
        const {status} = entityEditor;

        // keep in mind that this.props.dog wont exist yet if you're making a new dog
        const payload = this.state.form;
        const id = cat ? cat.id : null;

        const heading = `${cat ? "Edit" : "New"} ${item}`;

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
                <label htmlFor="toy">Toy</label>
                <input
                    value={this.state.form.toy}
                    onChange={this.onChangeField('toy')}
                    id="toy"
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
            {cat && // only show delete button when we have an item
                <ButtonDelete
                    children="Delete"
                    id={id}
                    entityEditor={entityEditor}
                />
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
