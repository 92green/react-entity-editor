import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { Map, List, Iterable, fromJS } from 'immutable';

//
// ErrorList is used to show all redux form errors in a list, and can cope with nested fields and field arrays
// pass in all props from your redux form: e.g. <ErrorList {...this.props} />
//

class ErrorList extends Component {

    flattenErrors(errors) {
        return errors.reduce((list, errorMessage, key) => {

            // if the error is iterable, then recursively call flattenErrors to get all inner errors
            if(Iterable.isIterable(errorMessage)) {
                // turn lists into maps and remove empty elements
                const iterableErrors = errorMessage
                    .toMap()
                    .filter(ii => typeof ii != "undefined");

                // concatenate new errors to exiting ones, and in each add the current key to each error's list of keys
                return list.concat(
                    this.flattenErrors(iterableErrors)
                    .map(ii => ii.update('keys', kk => kk.unshift(key)))
                );
            }

            // new error message, push it to current list
            return list.push(fromJS({
                keys:[key],
                errorMessage
            }));

        }, List());
    }

    render() {
        const { errors, submitFailed, modifier, className } = this.props;

        if(!submitFailed || Object.keys(errors).length === 0) {
            return null;
        }

        var classNames = classnames(
            'InfoBox',
            'InfoBox-error',
            'margin-row',
            modifier.split(' ').map(cc => `InfoBox-${cc}`),
            className
        );

        var errorList = this.flattenErrors(fromJS(errors)).map((ee, ii) => {

            /*
            ee.get('keys') allows you to get a List of the nested error object keys
            e.g. ['courses', '2', 'name']
            it's not used yet because while the keys can help show the origin of a generic error message, it only uses field names from code and in some cases this isn't helpful to the user
            */

            const message = ee.get('errorMessage');
            return (
                <li key={ii}>
                    {message}
                </li>
            );
        });

        return (
            <div className={classNames}>
                <ul>
                    {errorList}
                </ul>
            </div>
        );
    }
}

ErrorList.propTypes = {
    errors: PropTypes.any,
    modifier: PropTypes.string
};

ErrorList.defaultProps = {
    modifier: ""
};

export default ErrorList;