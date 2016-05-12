var React = require('react');
var moment = require('moment-timezone');

var Time = React.createClass({
    displayName: 'Time',
    propTypes: {
        type: React.PropTypes.string,
        format: React.PropTypes.string,
        duration: React.PropTypes.oneOf(['milliseconds', 'seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years']),
        durationFormat: React.PropTypes.string
    },
    getDefaultProps: function () {
        return {
            type: 'long',
            durationFormat: null,
            nullValue: 'Null Date'
        };
    },
    getFormatString() {
        var FORMAT_MAP = {
            full: 'DD/MM/YYYY HH:mma z',
            date: 'DD/MM/YYYY',
            long: 'MMMM Do YYYY HH:mma z',
            medium: 'MMMM Do YYYY',
            short: 'MMM Do',
            humanShort: 'MMM DD \'YY'
        };

        return (this.props.format) ? this.props.format : FORMAT_MAP[this.props.type];
    },
    render: function () {
        var value = this.props.children || this.props.value;
        var renderString;
        var duration;

        if(!value) {
            return <span {...this.props}>{this.props.nullValue}</span>;
        }

        if(this.props.duration) {
            duration = moment.duration(value, this.props.duration);

            if(this.props.durationFormat) {
                renderString = duration.format(this.props.durationFormat);
            } else {
                renderString = duration.humanize();
            }
        } else {
            if(this.props.tz) {
                renderString = moment.tz(new Date(value), this.props.tz).format(this.getFormatString());
            } else {
                renderString = moment(new Date(value)).format(this.getFormatString());
            }
        }

        return (
            <span {...this.props}>{renderString}</span>
        );
    }
});

module.exports = Time;

