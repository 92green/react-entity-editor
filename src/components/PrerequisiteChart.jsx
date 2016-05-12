import React from 'react';
import {Map, List} from 'immutable';
import {Link} from 'react-router';
import Widget from 'trc/components/Widget';
import Grid from 'trc/components/Grid';
import Col from 'trc/components/Col';
import {IconPlus} from 'trc/components/Icons';

class PrerequisiteChart extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'PrerequisiteChart';
    }

    mergeLeftRight(left, right) {
        var prerequisites = List();
        prerequisites = (List.isList(left)) ? prerequisites.concat(left) : prerequisites.push(left);
        prerequisites = (List.isList(right)) ? prerequisites.concat(right) : prerequisites.push(right);
        return prerequisites;
    }

    flattenPrerequisites(branch, parentType) {
        // If there are no prerequisites exit early with branch
        if(!branch.get('prerequisite1')) {
            return branch;
        }

        const type = branch.get('type');
        const left = this.flattenPrerequisites(branch.get('prerequisite1'), type);
        const right = this.flattenPrerequisites(branch.get('prerequisite2'), type);

        // If the parentType and type are equal return the recusion as a list
        // this lets us flatten our recursion to a single point.
        if (parentType === type) {
            return this.mergeLeftRight(left, right);
        }

        // The main case grabs the left and right cases. Then if the case is a list
        // generated from the above clause affect a flatten by concatenating instead of pushing.
        else {
            return Map({
                type: type,
                prerequisites: this.mergeLeftRight(left, right)
            });
        }
    }

    render() {
        if(this.props.prerequisite.getIn(['prerequisite','type']) === "NONE"){
            return null
        }
        var flatPrerequisites = this.flattenPrerequisites(this.props.prerequisite.get('prerequisite'));
        var prerequisites = this.renderPrequisitesRecursively(flatPrerequisites);
        return <section className="margin-row2">
            {(flatPrerequisites.has('prerequisites')) ? prerequisites : <Widget modifier="clear">{prerequisites}</Widget>}
        </section>;
    }

    renderPrequisitesRecursively(branch, key) {
        var {courseCode, prerequisites} = branch.toObject();
        var course = this.props.prerequisite
            .get('prerequisiteCourses')
            .filter(ii => ii.get('courseCode') === courseCode)
            .get(0);

        if (!branch.get('prerequisites')) {
            return <Link key={key} to={`/course/${course.get('courseCode')}`}>
                <Widget>
                    <span>{course.get('workshopName')}</span>
                    <span>{(branch.get('type') === 'COURSE_ENROLLED') ? ' (Enrolled)' : null}</span>
                </Widget>
            </Link>
        }

        if(branch.get('type') === 'AND') {
            var ands = prerequisites.map(this.renderPrequisitesRecursively.bind(this)).interpose(<IconPlus className="margin-row05" size="small" />)
            return <Widget modifier="clear" className="t-center">
                {ands.map((ii, key) => <div key={key}>{ii}</div>)}
            </Widget>
        } else {
            return <Widget modifier="clear" className="t-center" key={key}>
                <div className="margin-bottom">Either</div>
                <Grid modifier="tight">
                    {prerequisites.map((pp, key) => {
                        return <Col key={key}>{this.renderPrequisitesRecursively(pp)}</Col>
                    })}
                </Grid>
            </Widget>
        }
    }

}

export default PrerequisiteChart;
