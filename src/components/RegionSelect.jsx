import React from 'react';
import Select from 'trc-client-core/src/components/Select';
import regions from 'trc-client-core/src/constants/Regions';

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