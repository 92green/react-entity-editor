import React from 'react';
import Auth from 'trc-client-core/src/components/Auth';
import UserStore from 'trc-client-core/src/user/UserStore';
import {STATIC_ASSETS} from 'trc-client-core/src/constants/url';
import DepartmentSidebarDefault from 'trc-client-core/src/components/DepartmentSidebarDefault';
const SITE = UserStore.get('site');
import IconList from 'trc-client-core/src/components/IconList';
import IconListItem from 'trc-client-core/src/components/IconListItem';
import {fromHexCode} from 'trc-client-core/src/utils/Strings';

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
