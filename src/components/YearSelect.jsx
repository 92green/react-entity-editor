
var React = require('react');
var moment = require('moment');
var _ = require('lodash');

var Select = require('trc-client-core/src/components/Select');

var YearSelect = React.createClass({
    displayName: 'Year Select',
    getDefaultProps: function() {
        var now = moment();
        return {
            name: 'year',
            from: now.year(),
            to: now.subtract(moment.duration(10, 'year')).year()
        };
    },
    render: function() {
        return <Select 
            queryString
            name={this.props.name}
            value={this.props.value}
            onChange={this.props.onChange}
            placeholder={this.props.placeholder}
            options={this.renderYears()}
        />;
    },
    renderYears: function () {
        return _.map(_.range(this.props.from, this.props.to - 1, -1), function (value) {
            var str = value.toString();
            return {
                value: str,
                label: this.renderLabel(value)
            };
        }, this);
    },
    renderLabel: function (value) {
        if(this.props.renderLabel) {
            return this.props.renderLabel(value);
        }
        return value;
    }

});

module.exports = YearSelect;