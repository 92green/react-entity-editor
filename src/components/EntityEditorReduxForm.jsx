import React, { Component, PropTypes } from 'react';
import { List, Map, fromJS } from 'immutable';
import { reduxForm, initialize } from 'redux-form';

import ErrorMessage from 'toyota-styles/lib/components/ErrorMessage';
import Button from 'toyota-styles/lib/components/Button';

import ErrorList from 'trc-client-core/src/components/ErrorList';

//
// EntityEditorReduxForm class
//
// Provides a redux form shell that works with EntityEditor
// Give it child props of your form fields
//

class EntityEditorReduxForm extends Component {

    setCurrentFormDataAsDefault() {
        const {
            formName,
            values,
            fields,
            dispatch
        } = this.props;
        dispatch(initialize(formName, values, fromJS(fields).keySeq().toJS()));
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
            // react props
            children,
            // own props
            topButtons,
            bottomButtons,
            // props required for redux form
            fields,
            // props provided by redux form
            handleSubmit,
            errors,
            // props from entity editor - callbacks
            onSave,
            onClose,
            onDelete,
            onReset,
            // props from entity editor - data
            fetching,
            willCreateNew

        } = this.props;

        const propsToAddToChildren = {
            fields,
            errors,
            willCreateNew
        };

        const childrenWithProps = React.Children.map(children, (child) => React.cloneElement(child, propsToAddToChildren));

        return (
            <form onSubmit={handleSubmit(this.handleSubmitForm.bind(this))}>
                {topButtons && this.renderButtons()}
                {childrenWithProps}
                {bottomButtons && this.renderButtons()}
            </form>
        );
    }

    renderButtons() {
        const {
            // props provided by redux form
            dirty,
            // props from entity editor - data transation states
            deleting,
            saving,
            fetching,
            // props from entity editor - abilities
            canSave,
            canDelete

        } = this.props;

        const canReset = dirty && !fetching;

        return (
            <div className="t-right margin-bottom">

                {canReset &&
                    <span>
                        <Button
                            modifier="clear"
                            className="margin-right05"
                            onClick={this.handleResetClick.bind(this)}>Reset</Button>
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
                    type="submit"
                    disabled={!canSave}>
                    {saving ? "Saving" : "Save"}
                </Button>

            </div>
        );
    }
}

EntityEditorReduxForm.propTypes = {
    // own props
    topButtons: PropTypes.bool,
    bottomButtons: PropTypes.bool,
    // props required for redux form
    form: PropTypes.string, // isRequired, but react never seems to recognise this
    fields: PropTypes.any.isRequired,
    validate: PropTypes.func,
    // props from entity editor - callbacks
    onSave: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onReset: PropTypes.func,
    // props from entity editor - data transaction states
    reading: PropTypes.bool,
    creating: PropTypes.bool,
    updating: PropTypes.bool,
    deleting: PropTypes.bool,
    saving: PropTypes.bool,
    fetching: PropTypes.bool,
    // props from entity editor - abilities
    willCopy: PropTypes.bool,
    canSave: PropTypes.bool,
    canDelete: PropTypes.bool
};

EntityEditorReduxForm.defaultProps = {
    topButtons: false,
    bottomButtons: true
};

export default reduxForm({},
(state, props) => {
    return {
        initialValues: props.initialValues
    };
})(EntityEditorReduxForm);
