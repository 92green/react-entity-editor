import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { List, Map, fromJS } from 'immutable';

import Textarea from 'bd-stampy/components/Textarea';
import Fieldset from 'bd-stampy/components/Fieldset';
import InputRow from 'bd-stampy/components/InputRow';

import EntityEditorReduxForm from 'trc-client-core/src/components/EntityEditorReduxForm';
import UserEntityEditorConnect from 'trc-client-core/src/user/UserEntityEditorConnect';
import {getFields, getValidate} from 'trc-client-core/src/utils/reduxFormFieldMap';
import OrganizationEntityEditorForm from 'trc-client-core/src/organization/OrganizationEntityEditorForm';
import Permission from 'trc-client-core/src/auth/Permission';

import AutosuggestInput from 'toyota-styles/lib/components/AutosuggestInput';
import Button from 'toyota-styles/lib/components/Button';
import ErrorMessage from 'toyota-styles/lib/components/ErrorMessage';
import FormError from 'toyota-styles/lib/components/FormError';
import { IconRemove } from 'toyota-styles/lib/components/Icon';
import Input from 'toyota-styles/lib/components/Input';
import Label from 'toyota-styles/lib/components/Label';
import Select from 'toyota-styles/lib/components/Select';
import Widget from 'toyota-styles/lib/components/Widget';


const userFieldMap = {
    userId: false,
    firstName: "Please enter a first name",
    lastName: "Please enter a last name",
    email: "Please enter a valid email address",
    mobile: "Please enter a valid mobile number",
    jobTitle: "Please enter a job title", // todo autocomplete
    organizationId: "Please select an organisation",
    'address.streetAddress': false,
    'address.suburb': false,
    'address.state': false,  // todo select
    'address.postcode': false
};

class UserEntityEditorForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            addingOrganization: false
        };
    }

    getOrganizationOptions() {
        return this.props.organizations
            .map(ii => Map({
                label: ii.get('name'),
                value: ii.get('_id')
            }))
            .sortBy(ii => ii.get('label'))
            .toJS();
    }

    handleClickAddOrganization() {
        this.setState({
            addingOrganization: true
        });
    }

    handleCloseOrganization() {
        this.setState({
            addingOrganization: false
        });
    }

    afterCreateOrganization(data) {
        this.props.fields.organizationId.onChange(data.newId);
        return Promise.resolve(data);
    }

    render() {
        const {
            fields: {
                userId,
                firstName,
                lastName,
                email,
                mobile,
                jobTitle,
                organizationId,
                address: {
                    streetAddress,
                    suburb,
                    state,
                    postcode
                }
            },
            isNew,
            jobTitles

        } = this.props;

        return (
            <div>
                <InputRow label="First Name">
                    <Input type="text" {...firstName} />
                    <FormError {...firstName} />
                </InputRow>

                <InputRow label="Last Name">
                    <Input type="text" {...lastName} />
                    <FormError {...lastName} />
                </InputRow>

                <InputRow label="Email">
                    <Input type="email" {...email} disabled={!isNew} />
                    <FormError {...email} />
                </InputRow>

                {!isNew &&
                    <InputRow label="User ID">
                        <Input type="text" disabled {...userId} />
                        <FormError {...userId} />
                    </InputRow>
                }

                <InputRow label="Mobile">
                    <Input type="tel" {...mobile} />
                    <FormError {...mobile} />
                </InputRow>

                <InputRow label="Job Title">
                    <AutosuggestInput
                        {...jobTitle}
                        onChangeString
                        suggestions={jobTitles.sort().toJS()}
                        showSuggestionsWhenEmpty={true}
                        debounce
                        debounceTime={500}
                    />
                    <FormError {...jobTitle} />
                </InputRow>

                <InputRow label="Organisation">
                    <Select
                        {...organizationId}
                        onChangeString
                        options={this.getOrganizationOptions()}
                    />
                    <FormError {...organizationId} />
                </InputRow>

                <Permission has="API_ORGANIZATION_CREATE">
                    {!this.state.addingOrganization &&
                        <Button modifier="edit" className="float-right margin-bottom2" onClick={this.handleClickAddOrganization.bind(this)}>Add New Organisation</Button>
                    }

                    {this.state.addingOrganization &&
                        <Widget className="margin-bottom2 padding2">
                            <OrganizationEntityEditorForm
                                permitCreate={true}
                                onClose={this.handleCloseOrganization.bind(this)}
                                afterCreate={this.afterCreateOrganization.bind(this)}
                                headingTag="h3"
                            />
                        </Widget>
                    }
                </Permission>

                <InputRow label="Street Address">
                    <Input type="text" {...streetAddress} />
                    <FormError {...streetAddress} />
                </InputRow>

                <InputRow label="Suburb">
                    <Input type="text" {...suburb} />
                    <FormError {...suburb} />
                </InputRow>

                <InputRow label="State">
                    <Input type="text" {...state} />
                    <FormError {...state} />
                </InputRow>

                <InputRow label="Postcode">
                    <Input type="tel" {...postcode} />
                    <FormError {...postcode} />
                </InputRow>
            </div>
        );
    }
}

UserEntityEditorForm.propTypes = {
    // from routes via EntityEditorRouter
    id: PropTypes.any,
    willCopy: PropTypes.bool,
    onClose: PropTypes.func,
    onGotoEdit: PropTypes.func,
    // 
    fields: PropTypes.object,
    isNew: PropTypes.bool,
    organizations: ImmutablePropTypes.list,
    jobTitles: ImmutablePropTypes.list
};

const withEntityEditor = EntityEditorReduxForm({
    form: "trc/user/USER_EDITOR_FORM",
    fields: getFields(userFieldMap),
    validate: getValidate(userFieldMap)
})(UserEntityEditorForm);

const withEntityEditorConnect = UserEntityEditorConnect()(withEntityEditor);

export default withEntityEditorConnect;