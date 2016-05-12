var React = require('react');
var processes = require('trc/constants/CourseProcess');

var CourseProcess = React.createClass({
    displayName: 'CourseProcess',
    render() {
        return (
            <span className={this.props.className}>{processes[this.props.data]}</span>
        );
    }
});

module.exports = CourseProcess;