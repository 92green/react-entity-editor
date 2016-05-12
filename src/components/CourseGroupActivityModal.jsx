import React from 'react';
import ModalView from 'trc/components/ModalView';
import LearningSegment from 'trc/components/LearningSegment';
import Icon from 'trc/components/Icon';
import Button from 'bd-stampy/components/Button';
import history from 'trc/global/history';


class CourseGroupActivityModal extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'CourseGroupActivityModal';
    }
    onClick(course) {
        history.push(`/course/${course.get('courseCode')}`);
        this.props.onClose();
    }
    render() {
        var {course, name} = this.props;
            // <Icon modifier="inline" hexCode={course.get('courseIcon')} />

        return <ModalView title={`${name}'s Training Activity Summary`}>
            <h3 className="hug-top">
                {course.get('workshopName')}
            </h3>
            <div className="Widget margin-bottom2 column-flush2 padding2">
                <LearningSegment courses={this.props.courses} onClick={this.onClick.bind(this)}/>
            </div>
            <Button className="right" onClick={this.props.onClose}>okay</Button>
        </ModalView>;
    }
}

export default CourseGroupActivityModal;
