import React from 'react';
import CourseCalendar from 'trc-client-core/src/course/CourseCalendar';

var DepartmentPage = React.createClass({
    displayName: 'DepartmentPage',
    render(){
        return (
            <div>
                <h1 className="t-capitalize">{this.props.department} Department</h1>
                <CourseCalendar {...this.props} />
            </div>
        );
    }
});

module.exports = DepartmentPage;