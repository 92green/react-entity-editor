/*global location*/
var React = require('react');
var _ = require('lodash');
var moment = require('moment');
var User = require('../user/UserStore');
var CourseStore = require('../course/CourseStore');

var EnrollemntFormSingle = React.createClass({
    displayName: 'EnrollemntFormSingle',
    propTypes: {
        person: React.PropTypes.object.isRequired,
        courseData: React.PropTypes.object.isRequired
    },
    onUnenrol: function (id) {
        CourseStore.unenrolSingle({id: id, courseCode: this.props.courseData.course.courseCode});
    },
    onEnrol: function (id) {
        CourseStore.registerSingle(id, location.reload);
    },
    render: function () {
        var soItems = this.props.courseData.soItems;
        var course = this.props.courseData.course;
        var person = this.props.person;

        var registration = this.props.courseData.registrations[this.props.person.participantId + '-registration'];


        if(soItems.length && User.is("ROLE_MANAGER")) {
            var options = _.map(soItems, function(item, index) {
                return (
                    <tr>
                        <td>
                            <label className="Label">
                                <input
                                    defaultChecked={index === 0}
                                    type="radio"
                                    name="selectSoItem"
                                    value={item.soId + "-" + person.participantId}/>
                                {item.facility + "-" + moment(item.soStartDate).format("ddd DD MMMM YYYY HH:mm") + "-" + item.soRemainingSpots}
                            </label>
                        </td>
                        {this.renderCurrentEnrollments(registration, item)}
                    </tr>
                );

            }, this);
            return (
                <div>
                    <input type="hidden" name="selectCourse" value={course.courseCode} />
                    <div className="gamma p">Enrol</div>
                    <table className="Table Table-tight">{options}</table>
                    <p><em>{"By clicking the 'Enrol' button you agree to "}<a href="/terms" className="readmore">{"Toyota Institute Australia's Terms and Conditions."}</a></em></p>
                </div>
            );
        }
        return null;
    },
    renderCurrentEnrollments: function (registration, soItem) {
        var tds = [];
        if (registration && soItem.soId === registration.soData.soId) {

            var unenrol = <div className="Button Button-small w100" onClick={_.bind(this.onUnenrol, this, registration.id)}>Un-Enrol</div>;

            switch (registration.registrationProcess) {
                case 'ENROLL':
                    tds.push(<td className="w00 t-green"><span data-icon={String.fromCharCode(57363)} className="Icon Icon-small" title="Enrolled"></span></td>);
                    tds.push(<td>{unenrol}</td>);
                    break;

                case 'WAITLIST':
                    var enrolFromWaitlist = (soItem.soRemainingSpots !== 'FULL') ? <div className="Button Button-small Button-green w100" onClick={_.bind(this.onEnrol, this, registration.id)}>Enrol</div> : null;
                    tds.push(<td className="t-yellow w00"><span data-icon={String.fromCharCode(57379)} className="Icon Icon-small" title="Waitlisted"></span></td>);
                    tds.push(<td>{unenrol}{enrolFromWaitlist}</td>);
                    break;
            }
        }

        return tds;
    }
});

module.exports = EnrollemntFormSingle;
