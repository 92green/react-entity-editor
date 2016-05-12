import React, { Component, PropTypes } from 'react';
import CodeEditor from 'trc-client-core/src/components/CodeEditor';

require('codemirror/mode/javascript/javascript');

/*

// value prop should be a string, not a JSON object
// options prop (if provided) should be an options object of settings for CodeMirror

Would be cool to use jsonlint, but the jsonlint package tries to include file system stuff on the client if process is defined
https://rawgit.com/zaach/jsonlint/79b553fb65c192add9066da64043458981b3972b/lib/jsonlint.js

Parked for now
import jsonlint from 'jsonlint';
require('codemirror/addon/lint/lint.js');
require('codemirror/addon/lint/json-lint.js');
require('codemirror/addon/lint/lint.css');

and use these options:
            gutters: ["CodeMirror-lint-markers"],
            lint: true
*/

class JSONEditor extends Component {

    /*constructor(props) {
        super(props);
        this.state = {
            error: null
        };
    }*/

    handleChange(newJSON) {
        /*var error = this.validateJSON(newJSON);

        this.setState({ error });*/ 
        this.props.onChange && this.props.onChange(newJSON);
    }

    /*validateJSON(json) {
        try {
            JSON.parse(json);
            return null;
        } catch (e) {
            return e.toString();
        }
    }*/

    render() {
        var { options, onChange, value, ...props } = this.props;

        // deep merge defaultProps
        var newOptions = {};
        var defaultOptions = {
            lineNumbers: true,
            lineWrapping: true,
            readOnly: false
        };
        Object.assign(newOptions, defaultOptions, options);

        if(!newOptions.mode) {
            newOptions.mode = {
                name: "javascript",
                json: true
            }
        }

        //var isValid = this.state.error == null;
        //var validityMessage = isValid ? "Valid JSON" : this.state.error;

        return (
            <div>
                <CodeEditor options={newOptions} {...props} value={value} />
            </div>
        );

        // onChange={this.handleChange.bind(this)}
    }
}


export default JSONEditor;