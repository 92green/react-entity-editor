import React from 'react';
import Auth from 'trc/components/Auth';
import UserStore from 'trc/user/UserStore';
import {STATIC_ASSETS} from 'trc/constants/url';
import DepartmentSidebarDefault from 'trc/components/DepartmentSidebarDefault';
const SITE = UserStore.get('site');
import IconList from 'trc/components/IconList';
import IconListItem from 'trc/components/IconListItem';
import {fromHexCode} from 'trc/utils/Strings';

var ServiceSidebar = React.createClass({
    displayName: 'ServiceSidebar',
    render() {
        return <DepartmentSidebarDefault department="service">
            <Auth site="TOYOTA">
                <IconList modifier="service">
                    <IconListItem icon={fromHexCode('e271')} to="/service/warranty">Warranty</IconListItem>
                    <IconListItem icon={fromHexCode('e161')} to="/service/technical-support-system">Technical Support System</IconListItem>
                </IconList>
            </Auth>            
            <Auth isntJob="Service Advisor" component="div">
                <a href="/#/service-advisor" className="row">
                    <img src={`${STATIC_ASSETS}img/content/widget/widget4x-serviceAdvisor@${SITE}.jpg`} width="100%"/>
                    <div className="Widget Widget-service">Become Certified as a <span className="t-capitalize">{SITE.toLowerCase()}</span> Service Advisor.</div>
                </a>
            </Auth>
            <Auth isJob="Service Advisor" component="div">
                <img src={`${STATIC_ASSETS}img/content/widget/widget4x-serviceAdvisor@${SITE}.jpg`} width="100%"/>
                <div className="Widget Widget-service">Become Certified as a <span className="t-capitalize">{SITE.toLowerCase()}</span> Service Advisor.</div>
            </Auth>
            <div className="push-top">
                <a  href="/#/technical/fixitright"><img src={`${STATIC_ASSETS}img/content/technical/fixitright/logo.png`} width="100%" alt="" /></a>
            </div>
        </DepartmentSidebarDefault>
    }
});

export default ServiceSidebar;
