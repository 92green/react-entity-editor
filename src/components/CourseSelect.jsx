import React, { Component, PropTypes } from 'react';
import Select from 'trc-client-core/src/components/Select';

class CourseSelect extends Component {

    getOptions() {
        var { courses } = this.props;
        var coursesJS = courses
            .toList()
            .sortBy(ii => ii.get('workshopName'))
            .toJS()
            .map(ii => ({
                value: ii.courseCode,
                label: ii.courseCode+' - '+ii.workshopName
            }));

        return coursesJS;
    }

    render() {
        var options = this.getOptions();
        var placeholder = options.length==0 ? "Loading..." : this.props.placeholder;

        return (
            <Select {...this.props} options={options} placeholder={placeholder} />
        );
    }
}

CourseSelect.propTypes = {
    courses: PropTypes.object // immutable list
};

export default CourseSelect;