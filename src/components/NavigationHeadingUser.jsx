import React from 'react';
import {Link} from 'react-router';
import UserStore from 'trc/user/UserStore';
import Icon from 'trc/components/Icon';
import Auth from 'trc/components/Auth';
import NavigationHeading from 'trc/components/NavigationHeading';
import {connect} from 'react-redux';
import {trainingActivitySummaryRequest} from 'trc/participant/DealerActions';

var NavigationHeadingUser = React.createClass({
    displayName: 'NavigationHeadingUser',
    getInitialState() {
        return {
            data: null
        };
    },
    componentDidMount() {
        if(UserStore.isnt('ROLE_MEGA_ADMIN')){
            this.fetchData(this.props);
        }
    },
    fetchData() {
        this.props.dispatch(trainingActivitySummaryRequest());
    },
    render() {
        return (
            <NavigationHeading>
                <ul className="NavigationView_heading_userBar">
                    <li>{(UserStore.get('isSwitched')) ? <Icon modifier="small shift" hexCode="E110"/> : ''}</li>
                    <li><Link to="/portal">{UserStore.get('fullName')}</Link><Auth isPermission="TRAINING_ACTIVITY_SUMMARY">{this.renderRequestCount()}</Auth></li>

                    {this.renderSwitchDealership()}
                    <li><Link to="/portal">My {UserStore.get('site') === 'TOYOTA' ? 'TIA' : 'Academy'}</Link></li>
                    <li>{this.renderSwitchUserOrLogout()}</li>
                </ul>
            </NavigationHeading>
        );
    },
    renderRequestCount() {
        var colorClass = '';
        var notifications = '';
        var data = this.props;

        if(data){
            var evalRequests = 0
            var requestList = 0

            if(data.evaluationRequests){
                evalRequests = data.evaluationRequests.size;
            }

            if(data.evaluationRequests){
                requestList = data.requestList.size;
            }

            var requestCount = evalRequests + requestList;

            if(requestCount > 0 || requestCount === null){
                colorClass = 't-red';
                notifications = requestCount;
            }

            return <Link to="/portal/training_activity_summary" className={`${colorClass} margin-left05`}>
                <Icon modifier="small" className="shift-3 margin-right05" hexCode={String.fromCharCode(9993)}/>
                {notifications}
            </Link>;
        }  else {
            return null
        }

    },

    renderSwitchDealership() {
        var branches = UserStore.get('dealershipBranches');
        if(branches.size < 2 || !UserStore.isAny(['ROLE_MANAGER', 'ROLE_TECH_MANAGER'])) {
            return null;
        }

        function isCurrent(branch) {
            return branch.get('code') === UserStore.get('currentBranchCode');
        }

        function isntCurrent(branch) {
            return !isCurrent(branch);
        }

        return (
            <li className="Dropdown">
                <a className="Dropdown_button" href="/">
                    {branches.filter(isCurrent).map(bb => <span key={bb.get('code')}>{bb.get('name')}</span>)}
                    <span key="arrow" className="Icon Icon-small Icon-shift margin-left05" data-icon={String.fromCharCode(57620)}></span>
                </a>

                <ul className="Dropdown_list" id="dealer_select_options">
                    {branches.filter(isntCurrent).map(bb => <a key={bb.get('code')}
                        href={`http://${bb.get('url')}/admin/switch-dealer-branch?dealer=${bb.get('code')}&j_username=${UserStore.get('participantId')}`}
                        title={bb.get('name')}>{bb.get('name')}</a>)}
                </ul>
            </li>
        );
    },
    renderSwitchUserOrLogout() {
        if(UserStore.get('isSwitched')) {
            return <a className="Button Button-small Button-grey" href="/admin/tmca/switch-user-exit" title="Switch Back">Switch Back</a>;
        } else {
            return <a href="/sso/saml/logout">Log Out</a>;
        }
    }
});

export default connect(
    (state) => {
        return {
            evaluationRequests: state.dealer.trainingActivitySummary.get('evaluationRequests'),
            requestList: state.dealer.trainingActivitySummary.get('requestList')
        }
    }
)(NavigationHeadingUser);
