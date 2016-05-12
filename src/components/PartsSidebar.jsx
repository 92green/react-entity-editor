import React from 'react';
import Auth from 'trc/components/Auth';
import UserStore from 'trc/user/UserStore';
import {STATIC_ASSETS} from 'trc/constants/url';
import DepartmentSidebarDefault from 'trc/components/DepartmentSidebarDefault';

var PartsSidebar = React.createClass({
    displayName: 'PartsSidebar',
    render() {
        return <DepartmentSidebarDefault department="parts">
            <Auth isDepartment="parts">
                <a className="row" href="/#/parts-21">
                    <img src={`${STATIC_ASSETS}img/content/widget/widget4x-parts21@${UserStore.get('site')}.jpg`} width="100%"/>
                    <div className="Widget Widget-parts">Achieve Your PARTS21 <br/> Certification.</div>
                </a>
            </Auth>
            <a href="/#/supplier-branded-accessories" className="row block">
                <img src={`${STATIC_ASSETS}img/banners/supplier-branded-accessories.jpg`} alt="Service Advisor Certification Brochure" width="100%"/>
                <div className="Widget Widget-parts">Supplier Branded Accessory Information</div>
            </a>
        </DepartmentSidebarDefault>
    }
});

module.exports = PartsSidebar;
