var React = require('react');
var Select = require('trc-client-core/src/components/Select');

var YearTypeSelect = React.createClass({
    displayName: 'YearTypeSelect',
    render() {
        return (
            <Select 
                {...this.props}
                name="year_type" 
                queryString 
                options={[
                {label: 'Japanese Fiscal', value: 'jp_fiscal'},
                {label: 'Calendar', value: 'calendar'}
            ]}/>
        );
    }
});

module.exports = YearTypeSelect;