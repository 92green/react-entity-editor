import React, {Component} from 'react';
import {connect} from 'react-redux';
import {EntityEditorItem} from 'react-entity-editor';
import {Button} from 'stampy';
import {fromJS} from 'immutable';

import TagsEntityEditorConfig from './TagsEntityEditorConfig';

class TagsEditForm extends Component {

    constructor(props) {
        super(props);
        const emptyForm = fromJS({
            name: "",
            match: ""
        });
        this.state = {
            form: props.tags_get || emptyForm,
            pristineForm: props.tags_get || emptyForm
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
            tags_get,
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
                <label htmlFor="match">Match</label>
                <input
                    value={this.state.form.get('match')}
                    onChange={this.onChangeField('match')}
                    id="match"
                />
            </p>
            <Button onClick={entityEditor.actions.goList}>Back</Button>
            <Button onClick={this.save}>Save</Button>
            <Button onClick={this.saveNew}>Save as new</Button>
            <Button onClick={this.delete}>Delete</Button>
        </div>;
    }
}

const withEntityEditor = EntityEditorItem(TagsEntityEditorConfig);
const withRedux = connect();
export default withEntityEditor(withRedux(TagsEditForm));
