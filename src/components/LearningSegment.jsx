import React from 'react';
import CourseButton from 'trc/components/CourseButton';

class LearningSegment extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'LearningSegment';
    }
    render() {
        var {courses} = this.props;
        return <table className="Table hug">
            <tbody>
                {courses.map(this.renderRow.bind(this)).toJS()}
            </tbody>
        </table>;
    }

    renderRow(course, key) {
        if(course) {
            const {workshopName} = course.toObject();
            return <tr key={key}>
                <td>{workshopName}</td>
                <td><CourseButton course={course} onClick={this.props.onClick.bind(null, course)}/></td>
            </tr>
        }
    }
}

export default LearningSegment;
