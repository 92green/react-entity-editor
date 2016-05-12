import React from 'react';
import {Link} from 'react-router';
import UserStore from 'trc/user/UserStore';

export default function NavigationHeading(props) {
    return (
        <div className="NavigationView_heading">
            {props.children}
            <div className="NavigationView_heading_title beta">Training Resource Centre</div>
            <Link to="/" className="NavigationView_heading_logo">
                <img className="l-block" src={`http://static.toyotainstituteaustralia.com.au/img/ui/navigation/logo@${UserStore.get('site') || props.site}.png`} alt={UserStore.get('site')} width="287" height="56"/>
            </Link>
        </div>
    );
}
