import React, {PropTypes} from 'react';
import InputElement from 'bd-stampy/components/InputElement';
import { History } from 'react-router';
import {debounce} from 'lodash'

var Input = React.createClass({
    displayName: 'Input',
    mixins: [
        History
    ],
    contextTypes: {
        location: PropTypes.object
    },
    propTypes: {
        placeholder: PropTypes.string,
        name: PropTypes.string.isRequired,
        queryString: PropTypes.bool
    },
    getDefaultProps() {
        return {
            debounceAmmount: 250
        };
    },
    onChange(ee, data) {
        if(this.props.queryString) {
            var query = this.context.location.query;
            query[this.props.name] = data.value;
            this.history.pushState(null, this.context.location.pathname, query);
        }

        if (this.props.onChange) {
            this.props.onChange(data);
        }
    },
    componentWillMount() {
        if(this.props.debounce) {
            this.onChange = debounce(this.onChange, this.props.debounceAmmount);
        }
    },
    render() {
        var value = this.props.value;
        if(this.props.queryString && !this.props.value) {
            value = this.context.location.query[this.props.name];
        }

        return (
            <InputElement
                {...this.props}
                value={value}
                onChange={this.onChange}
            />
        );
    }
});

module.exports = Input;
