import React from 'react';
import Auth from 'trc-client-core/src/components/Auth';
import UserStore from 'trc-client-core/src/user/UserStore';
import {STATIC_ASSETS} from 'trc-client-core/src/constants/url';
import DepartmentSidebarDefault from 'trc-client-core/src/components/DepartmentSidebarDefault';

var SalesSidebar = React.createClass({
    displayName: 'SalesSidebar',
    render() {
        return <DepartmentSidebarDefault department="sales">
            <Auth isDepartment="sales" site='TOYOTA'>
                <a className="row" href="/#/media/video/159156767">
                    <img src={`${STATIC_ASSETS}img/content/widget/widget4x-natskills.jpg`} width="100%"/>
                    <div className="Widget Widget-sales">National Skills Video</div>
                </a>
            </Auth>
        </DepartmentSidebarDefault>
    }
});

module.exports = SalesSidebar;
