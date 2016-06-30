import React from 'react'
import {
    PREPARED,
    IN_PROGRESS,
    COMPLETED,
    CANCELLED,
    REFRESHED,
    ENROLL,
    WAITLIST
} from 'trc-client-core/src/constants/learningEvent';

var eventMap = {
    [PREPARED]: 'Assigned',
    [IN_PROGRESS]: 'In Progress',
    [COMPLETED]: 'Completed',
    [CANCELLED]: 'Cancelled',
    [REFRESHED]: 'Refreshed',
    [ENROLL]: 'Enrolled',
    [WAITLIST]: 'Waitlisted'
}

var colorMap = {
    [PREPARED]: 'normal',
    [IN_PROGRESS]: 'yellow',
    [COMPLETED]: 'green',
    [CANCELLED]: 'red',
    [REFRESHED]: 'green',
    [ENROLL]: 'green',
    [WAITLIST]: 'yellow'
}

export default function LearningEvent(props) {
    var {latestProgress} = props.learningLifecycle;
    return <span className={`t-${colorMap[latestProgress]}`}>{eventMap[latestProgress]}</span>
}

LearningEvent.propTypes = {
    learningLifecycle: React.PropTypes.object.isRequired
}
