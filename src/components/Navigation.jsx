import React from 'react';
import {Link} from 'react-router';
import UserStore from 'trc-client-core/src/user/UserStore';
import Auth from 'trc-client-core/src/components/Auth';
import Permissions from 'trc-client-core/src/user/Permissions';
import Col from 'trc-client-core/src/components/Col';
import Icon from 'trc-client-core/src/components/Icon';
import {STATIC_ASSETS, learningPlanUrl} from 'trc-client-core/src/constants/url';
import LearningPlanList from 'trc-client-core/src/learningPlan/LearningPlanList';

var Navigation = React.createClass({
    displayName: 'Navigation',
    contextTypes: {
        location: React.PropTypes.object
    },
    getInitialState() {
        return {
            hover: ''
        };
    },
    onTabOver(value) {
        this.setState({hover: value});
    },
    onTabOut() {
        this.setState({hover: null});
    },
    render() {
        var {hover} = this.state;
        var departmentUrl = this.context.location.pathname.match(/^\/(\w*)\/?/)[1];
        var departments = [
            {value:'sales',          label:'Sales',           permission:false},
            {value:'parts',          label:'Parts',           permission:false},
            {value:'service',        label:'Service',         permission:false},
            {value:'technical',      label:'Technical',       permission:'TECHNICAL'},
            {value:'product',        label:'Product',         permission:false},
            {value:'management',     label:'Management',      permission:false},
            {value:'body_and_paint', label:'Body & Paint',    permission:false},
            {value:'toyotaforlife',  label:'Toyota For Life', permission:false}
        ];

        function lexusTabs (department) {
            return !(UserStore.get('site') === 'LEXUS' &&
                (department.value === 'body_and_paint')
            );
        }

        function hasPermission(department) {
            if(Permissions.get('TMCA_STAFF') && !UserStore.is('ROLE_TMCA_ADMIN') && department.value !== 'toyotaforlife'  && department.value !== 'product') {
                return false;
            }
            return !department.permission || Permissions.get(department.permission);
        }

        return (
            <div className={`${(hover) ? '' : departmentUrl} ${hover}`}>
                <ul className={`NavigationView_bar`}>
                    <li
                        key="home"
                        className="NavigationView_dropdown"
                        onMouseOver={this.onTabOver.bind(null, 'hero')}
                        onMouseOut={this.onTabOut}
                    ><Link className="NavigationView_dropdown_link" to="/">Home</Link></li>
                    {departments.filter(lexusTabs).filter(hasPermission).map(this.renderTab)}
                    <li key="courses" className="NavigationView_dropdown is-right">
                        <Link className="NavigationView_dropdown_link" to="/course">All Courses</Link>
                    </li>
                </ul>
            </div>
        );

    },
    renderTab(department) {
        return (
            <li key={department.value} onMouseOver={this.onTabOver.bind(null, department.value)} onMouseOut={this.onTabOut}>
                <div className="NavigationView_dropdown">
                    <a href={this.renderPageUrl(department)} className="NavigationView_dropdown_link">{department.label}</a>
                    <ul className="NavigationView_dropdown_list">
                        <li className="grid">
                            {this.renderCol1(department)}
                            {this.renderCol2(department)}
                            <Col>
                                <Link to="/portal" className="NavigationView_dropdown_title">My {UserStore.get('site') === 'TOYOTA' ? 'TIA' : 'Academy'}</Link>
                                <Auth is="ROLE_MANAGER" isntAny={['ROLE_TMCA_ADMIN', 'ROLE_TMCA_INTERNAL']} component="div">
                                    <div><Link to="/portal/dealership">Dealership Details</Link></div>
                                    <div><Link to="/portal/training_activity_summary">Training Activity Summary</Link></div>
                                </Auth>
                                <div className="NavigationView_dropdown_title margin-top05">My Learning Plans</div>
                                <LearningPlanList linkClassName="Icon Icon-smallSize Icon-inline whitespace-nowrap" learningPlans={UserStore.get('learningPlans')}/>
                            </Col>
                        </li>
                    </ul>
                </div>
            </li>
        );
    },
    renderPageUrl(department) {
        return `/#/${department.value}`;
    },
    renderCol1(department) {
        function technical () {
            if(department.value === 'technical'){
                return (
                    <div>
                        <Auth site="TOYOTA"><li><a href="/#/technical/fixitright">Fix It Right</a></li></Auth>
                        <Auth site="TOYOTA"><li><a href="/#/technical/toyota-network-training">Toyota Network Training</a></li></Auth>
                        <li><Link to="/technical/technical-advisor-information">Technical Advisor Information</Link></li>
                    </div>
                );
            }
        }

        function product() {
            if(department.value === 'product'){
                return <li><ul>
                    <li><Link to="/product/vehicles">Vehicles</Link></li>
                    <li><Link to="/product/trainers">Our Team</Link></li>
                    <Auth site="TOYOTA" >
                        <ul>
                            <li><Link to="/product/the-toyota-edge">The Toyota Edge</Link></li>
                            <li><Link to="/product/toyotalink">Toyota Link</Link></li>
                        </ul>
                    </Auth>
                    <Auth site="LEXUS">
                        <li><Link to="/product/lexus-enform">Lexus Enform</Link></li>
                    </Auth>
                </ul></li>;
            }
        }

        function management() {
            if(department.value === 'management') {
                return <li><ul>
                    <li><Link to="/management/qualification">Management Qualifications</Link></li>
                    <Auth site="TOYOTA"><li><a href="/#/management/managers-toolbox">Manager&apos;s Toolbox</a></li></Auth>
                    <Auth is="ROLE_FDLP"><li><a href="/#/management/fdlp">Future Dealer Leader&apos;s Program</a></li></Auth>
                </ul></li>;
            }
        }


        return <ul className="col--">
            <li className="NavigationView_dropdown_title">General</li>
            <li><a href={this.renderPageUrl(department)}>Department Page</a></li>

            <Auth site="TOYOTA" bool={department.value === 'service'}>
                <li><a href="/#/service/warranty">Warranty</a></li>
                <li><a href="/#/service/technical-support-system">Technical Support System</a></li>
            </Auth>
            {technical()}
            {product()}
            {management()}
        </ul>;
    },
    renderCol2(department) {
        function calenders() {
            if(
                department.value !== 'product' &&
                department.value !== 'management' &&
                department.value !== 'body_and_paint' &&
                department.value !== 'toyotaforlife'
            ) {
                return <li><ul>
                    <li><Link to={`/training-calendars`} query={{page:department.value}}>Course Training Calendar</Link></li>
                    <Auth bool={department.value === 'technical'}>
                    <li><a href="/#/technical/videos">Training Videos</a></li>
                    </Auth>
                </ul></li>;
            }
        }

        function product() {
            if(department.value === 'product'){
                return <li><ul>
                    <Auth site="TOYOTA" component="li">
                        <ul>
                            <li><Link to="/product/factsheet">Fact Sheets</Link></li>
                            <li><Link to="/product/qanda">Q &amp; A</Link></li>
                        </ul>
                    </Auth>
                </ul></li>;
            }
        }


        return <ul className="col--">
            <li className="NavigationView_dropdown_title">Resources</li>
            <li><a href={`${STATIC_ASSETS}docs/Essential-Automotive-Terminology-062015.pdf`} target="_blank">Essential Terminology</a></li>
            <Auth perm="GAPREPORT_TFL">
                <li><Link to={`/portal/gapreport/toyota-for-life`}>Toyota for Life Gap Report</Link></li>
            </Auth>

            <Auth bool={department.value === 'technical'}>
                <li><ul>
                    <Auth perm="GAPREPORT_TECHNICAL">
                        <li><Link to={`/gapreport/technical_overview`}>Technical Gap Report</Link></li>
                    </Auth>
                    <li><a href={`${STATIC_ASSETS}docs/team21-training-curriculum.pdf`} target="_blank">TEAM21 Training Curriculum</a></li>
                </ul></li>
            </Auth>
            {calenders()}
            {product()}
        </ul>;
    }
});

module.exports = Navigation;
