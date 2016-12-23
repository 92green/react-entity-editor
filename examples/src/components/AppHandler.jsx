import React from 'react';
import {Link} from 'react-router';

export default (props) => {
    return <div>
        <ul className="Content">
            <li className="Content_item"><Link to="/">react-entity-editor</Link></li>
            <li className="Content_item"><Link to="/dogs">demo (with dogs)</Link></li>
        </ul>
        <div className="Wrapper">
            {props.children}
        </div>
    </div>
}
