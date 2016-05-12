import React from 'react';
import Codemirror from 'react-codemirror';
require('codemirror/mode/markdown/markdown');

export default React.createClass({
    getInitialState: function() {
        return {
            code: this.props.defaultValue || ''
        };
    },
    getDefaultProps() {
        return {
            options: {
                lineNumbers: true,
                lineWrapping: true,
                readOnly: false,
                mode: 'markdown'
            },
            height: '300px'
        };
    },
    updateCode: function(newCode) {
        this.setState({
            code: newCode
        });

        if(this.props.onChange) {
            this.props.onChange(newCode);
        }
    },
    render: function() {
        return <Codemirror 
            className={this.props.className} 
            value={this.props.value || this.state.code} 
            onChange={this.updateCode} 
            options={this.props.options} />;
    }
});
