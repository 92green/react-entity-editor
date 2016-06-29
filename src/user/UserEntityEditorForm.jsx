import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { List, Map, fromJS } from 'immutable';

import Textarea from 'bd-stampy/components/Textarea';
import Fieldset from 'bd-stampy/components/Fieldset';
import InputRow from 'bd-stampy/components/InputRow';

import EntityEditorReduxForm from 'trc-client-core/src/components/EntityEditorReduxForm';
import UserEntityEditorConnect from 'trc-client-core/src/user/UserEntityEditorConnect';
import {getFields, getValidate} from 'trc-client-core/src/utils/reduxFormFieldMap';

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
    organizationId: "Please select an organization",
    addressStreetAddress: false,
    addressSuburb: false,
    addressState: false,  // todo select
    addressPostcode: false
};

class UserEntityEditorForm extends Component {

    getOrganizationOptions() {
        return this.props.organizations
            .map(ii => Map({
                label: ii.get('name'),
                value: ii.get('_id')
            }))
            .toJS();
    }

    getJobTitleOptions() {
        return this.props.jobTitles.map(ii => Map({
                label: ii,
                value: ii
            }))
            .toJS();
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
                addressStreetAddress,
                addressSuburb,
                addressState,
                addressPostcode
            },
            willCreateNew

        } = this.props;

        return (
            <div>
                <InputRow label="First name">
                    <Input type="text" {...firstName} />
                    <FormError {...firstName} />
                </InputRow>

                <InputRow label="Last name">
                    <Input type="text" {...lastName} />
                    <FormError {...lastName} />
                </InputRow>

                <InputRow label="Email">
                    <Input type="email" {...email} disabled={!willCreateNew} />
                    <FormError {...email} />
                </InputRow>

                {!willCreateNew &&
                    <InputRow label="User ID">
                        <Input type="text" disabled {...userId} />
                        <FormError {...userId} />
                    </InputRow>
                }

                <InputRow label="Mobile">
                    <Input type="tel" {...mobile} />
                    <FormError {...mobile} />
                </InputRow>

                <InputRow label="Job title">
                    <Input type="text" {...jobTitle} />
                    <FormError {...jobTitle} />
                </InputRow>

                <InputRow label="Organization">
                    <Select {...organizationId} onChangeString options={this.getOrganizationOptions()} />
                    <FormError {...organizationId} />
                </InputRow>

                {/*}
                    {!this.state.addingOrganization &&
                        <Button modifier="edit" onClick={this.handleClickAddOrganization.bind(this)}>Add new organization</Button>
                    }  {this.renderAddOrganizationForm()} */ }

               

                <InputRow label="Street address">
                    <Input type="text" {...addressStreetAddress} />
                    <FormError {...addressStreetAddress} />
                </InputRow>

                <InputRow label="Suburb">
                    <Input type="text" {...addressSuburb} />
                    <FormError {...addressSuburb} />
                </InputRow>

                <InputRow label="State">
                    <Input type="text" {...addressState} />
                    <FormError {...addressState} />
                </InputRow>

                <InputRow label="Postcode">
                    <Input type="tel" {...addressPostcode} />
                    <FormError {...addressPostcode} />
                </InputRow>
            </div>
        );
    }
}

UserEntityEditorForm.propTypes = {
    fields: PropTypes.object,
    willCreateNew: PropTypes.bool,
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