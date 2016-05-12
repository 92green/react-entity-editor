import React, {PropTypes} from 'react';
import ReactSelect from 'react-select';
import UrlStore from 'bd-stampy/utils/UrlStore';
import { History } from 'react-router'

var Select = React.createClass({
    displayName: 'Select',
    mixins: [
        require('bd-stampy/mixins/ClassMixin'),
        History
    ],
    contextTypes: {
        location: PropTypes.object
    },
    propTypes: {
        placeholder: PropTypes.string,
        name: PropTypes.string.isRequired,
        options: PropTypes.array,
        multiple: PropTypes.bool,
        queryString: PropTypes.bool
    }, 
    getDefaultProps() {
        return {
            clearable: false  
        };
    },
    getOptions(){
        var {children, options} = this.props;

        if(children && children.length) {
            if(!options && !children[0].value) {
                return children.map((item) => {
                    return {value: item.props.value, label: item.props.children};
                });
            }
        }        

        return this.props.options;
    },
    onChange(data) {     
        if(this.props.queryString) {
            var query = this.context.location.query;
            query[this.props.name] = data.value;
            this.history.pushState(null, this.context.location.pathname, query);
            // UrlStore.setQueryParams(query);            
        }        

        if (this.props.onChange) {
            // boolean for redux form
            if(this.props.onChangeString) {
                if(this.props.multi) {
                    this.props.onChange(data.map(ii => ii.value));
                } else {
                    this.props.onChange(data.value);                    
                }
            } else {
                this.props.onChange(null, {
                    key: this.props.name,
                    value: data.value,
                    valueArray: data
                });                
            }
        }
    },
    render() {

        return (
            <ReactSelect
                {...this.props}
                onChange={this.onChange}
                options={this.getOptions()}
                value={this.props.value || this.props.initialValue}
            />
        );
    }
});

module.exports = Select;