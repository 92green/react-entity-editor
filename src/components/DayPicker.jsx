import React from 'react';
import ReactDayPicker, { DateUtils } from "react-day-picker";
import moment from 'moment';

var DayPicker = React.createClass({
    displayName: 'DayPicker',
    propTypes: {
        format: React.PropTypes.string
    },
    getDefaultProps() {
        return {
            value: moment()
        };
    },
    getOutput(date) {
        if(this.props.format === 'timestamp') {
            return date.getTime();
        } else if (this.props.format) {
            return moment(new Date(date)).format(this.props.format);
        } else {
            return date;
        }
    },
    onChange(e, date) {
        if(this.props.onChange) {
            this.props.onChange({
                key: this.props.name,
                value: this.getOutput(date)
            });
        }
    },
    render() {
        var format = (this.props.format === 'timestamp') ? null : this.props.format;
        var value = moment(this.props.value, format).toDate();

        return (
            <ReactDayPicker
                {...this.props}
                onDayClick={this.onChange}
                initialMonth={value}
                modifiers={{
                    ...this.props.modifiers,
                    selected: (day) => DateUtils.isSameDay(value, day)
                }}
            />
        );
    }
});

module.exports = DayPicker;
