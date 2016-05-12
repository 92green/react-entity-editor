import React from 'react';
import Select from 'trc/components/Select';
import regions from 'trc/constants/Regions';

var RegionSelect = React.createClass({
    displayName: 'Region Select',
    getDefaultProps: function() {
        return {
            name: 'regionCode'
        };
    },
    render: function() {
        return (
            <Select 
                queryString
                defaultValue={this.props.defaultValue}
                name={this.props.name}
                value={this.props.value}
                options={regions}
                onChange={this.props.onChange}
                onBlur={this.props.onBlur}/>
        );
    }

});

module.exports = RegionSelect;