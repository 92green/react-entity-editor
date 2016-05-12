var React = require('react');
var _ = require('lodash');
var moment = require('moment');
var Select = require('trc-client-core/src/components/Select');

var MonthSelect = React.createClass({
    displayName: 'Month Select',
    getDefaultProps: function() {
        return {
            name: 'month'
        };
    },
    render: function() {
        return <Select 
            queryString
            name={this.props.name}
            value={this.props.value}
            onChange={this.props.onChange}
            options={this.renderMonths()}
        />;
    },
    renderMonths: function () {
        var range = _.range(1, 13);
        if(this.props.reverse) {
            range = range.reverse();
        }
        return range.map(value => {
            var str = value.toString();
            var monthName = moment().month(parseInt(value, 10) - 1).format("MMM");
            return {
                value: str,
                label: this.renderLabel(monthName)
            };
        });
    },
    renderLabel: function (value) {
        if(this.props.renderLabel) {
            return this.props.renderLabel(value);
        }
        return value;
    }

});

module.exports = MonthSelect;