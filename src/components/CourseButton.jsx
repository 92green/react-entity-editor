import React from 'react';
import classnames from 'classnames';
import UserStore from 'trc-client-core/src/user/UserStore';

export default function CourseButton(props) {
    var {course} = props;
    var participantId = props.participantId || UserStore.get('participantId');

    if(!course) {
        return <div className={`Button Button-grey w100 ${props.className}`} disabled />
    }

    var classes = classnames(
        'CourseButton w100',
        course.get('completionProcess'),
        course.get('type'),
        props.courseType,
        {
            'nearlyExpired': course.get('nearlyExpired'),
            'INELIGIBLE': !course.get('eligible'),
            'is-manager': participantId !== UserStore.get('participantId'),
            'QUIZ': course.get('courseCode').indexOf('_EVAL') >= 0
        }
    )
    return <button
        className={classes}
        onClick={props.onClick}
        children={props.children}
    />
}
