import React, {Component} from 'react';
import {connect} from 'react-redux';
import {EntityEditorItem} from 'react-entity-editor';

import SlothsEntityEditorConfig from './SlothsEntityEditorConfig';

class SlothsEditForm extends Component {

    constructor(props) {
        super(props);

        // set up initial form state with any values from sloths_get
        const fields = ['name', 'speed'];
        var form = {};
        fields.forEach(field => {
            form[field] = (props.sloths_get && props.sloths_get[field]) || "";
        });
        this.state = {form};

        // bind methods to this class
        this.onChangeField = this.onChangeField.bind(this);
        this.save = this.save.bind(this);
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
        // we're using redux in this example, and the callbacks defined in SlothsEntityEditorConfig
        // require the dispatch function to be passed to them
        const dispatch = this.props.dispatch;
        // when saving, the data to save should be on a property called payload
        const payload = this.state.form;

        // call the entity editor action
        save({id, dispatch, payload}).then((data) => {
            // on success, mark the form as being clean / up to date with underlying data
            this.setState({dirty: false});
            this.props.entityEditor.actions.dirty({dirty: false});
        });
    }

    render() {
        const {
            sloths_get,
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
                <label htmlFor="speed">Speed (km/h)</label>
                <input
                    value={this.state.form.speed}
                    onChange={this.onChangeField('speed')}
                    id="speed"
                />
            </div>
            <button className="Button Button-grey" onClick={entityEditor.actions.goList}>Back</button>
            <button className="Button" onClick={this.save}>Save</button>
            {entityEditor.pending.save && <em>Saving...</em>}
            {entityEditor.pending.delete && <em>Deleting...</em>}
        </div>;
    }
}

// the SlothsEditForm component must be decorated by the EntityEditorItem higher order component
// so it will get the entityEditor prop passed to it
const withEntityEditor = EntityEditorItem(SlothsEntityEditorConfig);

// react-redux connect is used here so the SlothsEditForm component is passed a dispatch prop
const withRedux = connect();
export default withEntityEditor(withRedux(SlothsEditForm));
