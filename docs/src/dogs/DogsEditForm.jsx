import React, {Component} from 'react';
import {connect} from 'react-redux';
import {EntityEditorItem} from 'react-entity-editor';

import DogsEntityEditorConfig from './DogsEntityEditorConfig';

class DogsEditForm extends Component {

    constructor(props) {
        super(props);

        // set up initial form state with any values from dogs_get
        const fields = ['name', 'toy'];
        var form = {};
        fields.forEach(field => {
            form[field] = (props.dogs_get && props.dogs_get[field]) || "";
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

            // tell entity editor that the form is now dirty
            // note that you must pass in an object with a boolean property of 'dirty'
            this.props.entityEditor.actions.dirty({dirty: true});
        };
    }

    save() {
        // the save action is supplied via the entityEditor prop
        const save = this.props.entityEditor.actions.save;
        // the id is provided by the entityEditorRoutes props in this example
        // as we are using react router
        const id = this.props.entityEditorRoutes.id;
        // we're using redux in this example, and the callbacks defined in DogsEntityEditorConfig
        // require the dispatch function to be passed to them
        const dispatch = this.props.dispatch;
        // when saving, the data to save should be on a property called payload
        const payload = this.state.form;

        // call the entity editor action, passing in:
        // + the id (which wont exist for new items)
        // + the payload containing the updated dog
        // + redux's dispatch prop so redux actions can be dispatched
        // + an optional onSuccess function, which will be called immediately after the action has succeeded
        save({
            id,
            dispatch,
            payload,
            onSuccess: () => {
                // on success, mark the form as being clean and up-to-date with underlying data
                this.setState({dirty: false});
                this.props.entityEditor.actions.dirty({dirty: false});
            }
        });
    }

    delete() {
        const del = this.props.entityEditor.actions.delete;
        const id = this.props.entityEditorRoutes.id;
        const dispatch = this.props.dispatch;
        del({id, dispatch});
    }

    render() {
        const {
            dogs_get,
            entityEditor
        } = this.props;

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
            <button className="Button Button-grey" onClick={entityEditor.actions.goList}>Back</button>
            <button className="Button" onClick={this.save}>Save</button>
            {/*<button className="Button" onClick={this.delete}>Delete</button>*/}
        </div>;
    }
}

// the DogsEditForm component must be decorated by the EntityEditorItem higher order component
// so it will get the entityEditor prop passed to it
const withEntityEditor = EntityEditorItem(DogsEntityEditorConfig);

// react-redux connect is used here so the DogsEditForm component is passed dispatch
const withRedux = connect();
export default withEntityEditor(withRedux(DogsEditForm));
