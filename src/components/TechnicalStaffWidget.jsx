import React from 'react';
import {Link} from 'react-router';
import Reflux from 'reflux';
import StoreMixin from 'reflux-immutable/StoreMixin';
import ParticipantStore from 'trc-client-core/src/participant/ParticipantStore';
import ParticipantActions from 'trc-client-core/src/participant/ParticipantActions';


var TechnicalStaffWidget = React.createClass({
    displayName: 'TechnicalStaffWidget',
    mixins: [
        StoreMixin,
        Reflux.listenTo(ParticipantStore, 'onStoreChange')
    ],
    getStoreState() {
        return {
            staff: ParticipantStore.get('technicalStaff')
        };
    },
    componentDidMount() {
        ParticipantActions.fetchTechnicalStaff();
    },
    render() {
        return (
            <ul className="clearfix Widget">{this.state.staff.map(this.renderStaff)}</ul>
        );
    },
    renderStaff(staff) {
        var classes = (this.props.type === 'column') ? 'w25 left' : '';
        return <li className={classes}>
           <Link className="t-capitalise" to={`/learning-plan/technical_career_plan`} query={{participantId: staff.get('participantId')}}>{staff.get('firstName')} {staff.get('lastName')}</Link>
        </li>;
    }
});

module.exports = TechnicalStaffWidget;
