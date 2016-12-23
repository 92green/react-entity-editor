import React, {Component} from 'react';
import {connect} from 'react-redux';
import {EntityEditorItem} from 'react-entity-editor';

import DogsEntityEditorConfig from './DogsEntityEditorConfig';

class DogsEditForm extends Component {

    constructor(props) {
        super(props);

        var form = {};
        for(var key in props.dogs_get) {
            form[key] = props.dogs_get[key] || "";
        }
        this.state = {form};

        this.onChangeField = this.onChangeField.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
    }

    onChangeField(field) {
        return (event) => {
            var form = Object.assign({}, this.state.form);
            form[field] = event.target.value;
            this.setState({form});
            this.props.entityEditor.actions.dirty({dirty: true});
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

        const payload = this.state.form;
        entityEditor.actions.save({id, dispatch, payload})
            .then(() => {
                this.setState({
                    pristineForm: this.state.form
                });
                this.props.entityEditor.actions.dirty({dirty: false});
            });
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
            <button className="Button" onClick={entityEditor.actions.goList}>Back</button>
            <button className="Button" onClick={this.save}>Save</button>
            <button className="Button" onClick={this.delete}>Delete</button>
        </div>;
    }
}

const withEntityEditor = EntityEditorItem(DogsEntityEditorConfig);
const withRedux = connect();
export default withEntityEditor(withRedux(DogsEditForm));
