/*
* ErrorMessage.jsx
* Element for displaying error messages
*
* Contents can be set by the following props: code, message, errorTable
* If message prop is set then it's used
* If not then the "code" prop will be used to display a default error message
* The default error messages defined in this file will be used unless a errorTable prop is supplied
* containing any alternate error messages you wish to use
*
*/

import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

//
// Default error messages
//

var errorTable = {
    '?': {
        title: 'Error',
        message: <span>Something broke unexpectedly. <br/>In the interim try double checking the URL, refresh the page or even load it in a different browser</span>
    },
    500: {
        title: 'Server Error',
        message: 'We had problems processing your request. Double check the URL and try again.'
    },
    403: {
        title: 'Insufficient Privileges',
        message: 'You don\'t have the correct permissions to see this page.'
    },
    404: {
        title: 'Page Not Found',
        message: 'The page you requested could not be found. Double check the URL and try again.'
    },
    400: {
        title: 'Bad Request',
        message: 'Check network logs.'
    },
    429: {
        title: 'Too Many Requests',
        message: 'You are querying this service too much.'
    },
    202: {
        title: 'Accepted',
        message: 'The request has been accepted for processing, but the processing has not been completed.'
    }
};

//
// ErrorMessage class
//

class ErrorMessage extends Component {
    render() {
        var title = this.props.title;
        var message = this.props.message;
        var className = classnames("ErrorMessage", this.props.className);
        var errors = {
            ...errorTable,
            ...this.props.errorTable
        };

        if(errors[this.props.code]) {
            title = title || errors[this.props.code].title;
            message = message || errors[this.props.code].message;
        }

        return (
            <div className={className}>
                <h1 className="ErrorMessage_title">{title}</h1>
                <div className="ErrorMessage_message">{message}</div>
                <div className="ErrorMessage_code">{this.props.code}</div>
            </div>
        );
    }
}

ErrorMessage.propTypes = {
    errorTable: PropTypes.object,
    code: PropTypes.number,
    message: PropTypes.string,
    title: PropTypes.string
};

ErrorMessage.defaultProps = {
    errorTable: {},
    code: "?"
};

export default ErrorMessage;
