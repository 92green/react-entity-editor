
var React = require('react');
var moment = require('moment');

var CourseMixin = require('../mixins/CourseMixin');

var statusSentenceTable = {
    // Local Status
    ELIGIBLE:               'is eligible to attend',
    INELIGIBLE:             'is ineligible to attend',

    // LMS Status
    ATTENDED:               'attended',
    PARTIALLY_ATTENDED:     'partially attended',
    CREDIT:                 'was credited for',
    ENROLLED:               'is enrolled in',
    ENROLL:                 'is enrolled in',
    PENDING:                'is pending',
    CANCELLED:              'has been cancelled',
    NO_SHOW:                'a no show',
    WAITLISTED:             'has been waitlisted',
    XC:                     'XC'
};



var CourseStatus = React.createClass({
    displayName: 'CourseStatus',
    mixins: [CourseMixin],
    propTypes: {
        course: React.PropTypes.object.isRequired,
        person: React.PropTypes.object.isRequired
    },
    render: function() {
        var person = this.props.person;
        var course = this.props.course;
        return <span>{person.firstName} {this.renderStatusSentence(course)} {course.courseCode} {this.renderDate(course)}</span>;        
    },
    renderDate: function (course) {
        if (course.completeDate) {
            return 'on ' + moment(course.completeDate).format('MMM Do YYYY');
        }
    },
    renderStatusSentence: function(course) {
        var status = statusSentenceTable[this.getCourseStatus(course)];
        if (status) {
            return status;
        } else {
            return 'STATUS NOT FOUND';
        } 
    }
});

module.exports = CourseStatus;