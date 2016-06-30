import React, { Component, PropTypes } from 'react';
import { List, Map, fromJS } from 'immutable';
import { reduxForm, initialize } from 'redux-form';

import EntityEditorTRC from 'trc-client-core/src/components/EntityEditorTRC';

import ErrorMessage from 'toyota-styles/lib/components/ErrorMessage';
import Button from 'toyota-styles/lib/components/Button';

import ErrorList from 'trc-client-core/src/components/ErrorList';

//
// EntityEditorReduxForm higher order component
//
// Provides a redux form shell that works with EntityEditor
// Use it like you would use the reduxForm higher order component
//

export default (reduxFormConfig) => (ComposedComponent) => {

    class EntityEditorReduxForm extends Component {

        setCurrentFormDataAsDefault() {
            const {
                values,
                fields,
                dispatch
            } = this.props;

            dispatch(initialize(reduxFormConfig.form, values, reduxFormConfig.fields));
        }

        //
        // event and click handlers
        //

        handleSubmitForm(values) {
            this.props
                .onSave(values)
                .then(
                    (data) => this.setCurrentFormDataAsDefault(),
                    (err) => {}
                );
        }

        handleCloseClick(ee) {
            this.props
                .onClose(this.props.dirty)
                .then(
                    (data) => {},
                    (err) => {}
                ); 
        }

        handleResetClick(ee) {
            if(this.props.onReset) {
                // if an onReset prop has been supplied, then call it and wait for the promise to return to actually reset the form
                this.props
                    .onReset()
                    .then(
                        (data) => this.props.resetForm(),
                        (err) => Promise.resolve()
                    );
            } else {
                // or else just reset the form
                this.props.resetForm();
            }
        }

        handleDeleteClick(ee) {
            this.props
                .onDelete()
                .then(
                    (data) => {},
                    (err) => {}
                ); 
        }

        //
        // render
        //

        render() {
            const {
                // props from entity editor - abilities
                willCreateNew,
                // own props
                topButtons,
                bottomButtons,
                // props required for redux form
                fields,
                // props provided by redux form
                errors

            } = this.props;

            return (
                <fieldset className="hug-bottom">
                    {topButtons && this.renderButtons()}
                    <ComposedComponent
                        {...this.props}
                        fields={fields}
                        willCreateNew={willCreateNew}
                    />
                    {bottomButtons && this.renderButtons()}
                </fieldset>
            );
        }

        renderButtons() {
            const {
                // props provided by redux form
                handleSubmit,
                dirty,
                // props from entity editor - data transation states
                deleting,
                saving,
                fetching,
                // props from entity editor - abilities
                willCreateNew,
                canSave,
                canDelete

            } = this.props;

            const canReset = !willCreateNew && dirty && !fetching;

            return (
                <div className="t-right margin-bottom">

                    {canReset &&
                        <span>
                            <Button
                                modifier="clear"
                                className="margin-right05"
                                onClick={this.handleResetClick.bind(this)}>Revert</Button>
                        </span>
                    }

                    {canDelete &&
                        <Button
                            modifier="clear"
                            className="margin-right05"
                            onClick={this.handleDeleteClick.bind(this)}>
                            {deleting ? "Deleting" : "Delete"}
                        </Button>
                    }

                    <Button
                        modifier="grey"
                        className="margin-right05"
                        onClick={this.handleCloseClick.bind(this)}
                    >Close</Button>

                    <Button
                        modifier="edit"
                        disabled={!canSave}
                        onClick={handleSubmit(this.handleSubmitForm.bind(this))}>
                        {saving ? "Saving" : "Save"}
                    </Button>

                </div>
            );
        }
    }

    EntityEditorReduxForm.propTypes = {
        // props from entity editor - abilities
        id: PropTypes.any,
        willCopy: PropTypes.bool,
        willCreateNew: PropTypes.bool,
        canSave: PropTypes.bool,
        canDelete: PropTypes.bool,
        // props from entity editor - data transaction states
        reading: PropTypes.bool,
        creating: PropTypes.bool,
        updating: PropTypes.bool,
        deleting: PropTypes.bool,
        saving: PropTypes.bool,
        fetching: PropTypes.bool,
        // permissions
        permitCreate: PropTypes.bool,
        permitUpdate: PropTypes.bool,
        permitDelete: PropTypes.bool,
        // props from entity editor - callbacks
        onRead: PropTypes.func,
        onCreate: PropTypes.func,
        onUpdate: PropTypes.func,
        onDelete: PropTypes.func,
        onClose: PropTypes.func.isRequired,
        // props from entity editor - after callbacks - fired on success, must each return a resolve promise
        afterRead: PropTypes.func,
        afterCreate: PropTypes.func,
        afterUpdate: PropTypes.func,
        afterDelete: PropTypes.func,
        afterClose: PropTypes.func,
        // props required for redux form
        form: PropTypes.string, // isRequired, but react never seems to recognise this
        fields: PropTypes.any.isRequired,
        validate: PropTypes.func,
        initialValues: PropTypes.object,
        // own props
        topButtons: PropTypes.bool,
        bottomButtons: PropTypes.bool
    };

    EntityEditorReduxForm.defaultProps = {
        topButtons: false,
        bottomButtons: true
    };

    const withReduxForm = reduxForm(reduxFormConfig, (state, props) => {
        return {
            initialValues: props.initialValues
        };
    })(EntityEditorReduxForm);

    return EntityEditorTRC()(withReduxForm);
};

