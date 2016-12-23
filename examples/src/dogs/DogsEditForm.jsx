import React, {Component} from 'react';
import {connect} from 'react-redux';
import {EntityEditorItem} from 'react-entity-editor';
import {fromJS} from 'immutable';

import DogsEntityEditorConfig from './DogsEntityEditorConfig';

class DogsEditForm extends Component {

    constructor(props) {
        super(props);
        const emptyForm = fromJS({
            name: "",
            toy: ""
        });
        this.state = {
            form: props.dogs_get || emptyForm,
            pristineForm: props.dogs_get || emptyForm
        };
        this.onChangeField = this.onChangeField.bind(this);
        this.save = this.save.bind(this);
        this.saveNew = this.saveNew.bind(this);
        this.delete = this.delete.bind(this);
    }

    onChangeField(field) {
        return (event) => {
            const form = this.state.form.set(field, event.target.value);
            this.setState({form});
            const dirty = !form.equals(this.state.pristineForm);
            this.props.entityEditor.actions.dirty({dirty});
        };
    }

    save() {
        const {
            entityEditor,
            entityEditorRoutes: {
                id
            },
            dispatch
        } = this.props;

        const payload = this.state.form.toJS();
        entityEditor.actions.save({id, dispatch, payload})
            .then(() => {
                this.setState({
                    pristineForm: this.state.form
                });
                this.props.entityEditor.actions.dirty({dirty: false});
            });
    }

    saveNew() {
        const {
            entityEditor,
            dispatch
        } = this.props;

        const payload = this.state.form.toJS();
        entityEditor.actions.saveNew({dispatch, payload});
    }

    delete() {
        const {
            entityEditor,
            entityEditorRoutes: {
                id
            },
            dispatch
        } = this.props;

        entityEditor.actions.delete({id, dispatch});
    }

    render() {
        const {
            dogs_get,
            entityEditor
        } = this.props;

        return <div>
            <p>
                <label htmlFor="name">Name</label>
                <input
                    value={this.state.form.get('name')}
                    onChange={this.onChangeField('name')}
                    id="name"
                />
            </p>
            <p>
                <label htmlFor="toy">Toy</label>
                <input
                    value={this.state.form.get('toy')}
                    onChange={this.onChangeField('toy')}
                    id="toy"
                />
            </p>
            <button className="Button" onClick={entityEditor.actions.goList}>Back</button>
            <button className="Button" onClick={this.save}>Save</button>
            <button className="Button" onClick={this.saveNew}>Save as new</button>
            <button className="Button" onClick={this.delete}>Delete</button>
        </div>;
    }
}

const withEntityEditor = EntityEditorItem(DogsEntityEditorConfig);
const withRedux = connect();
export default withEntityEditor(withRedux(DogsEditForm));
