import React from 'react';
import {Link} from 'react-router';

export default (props) => {
    return <div>
        <ul className="Content">
            <li className="Content_item"><Link to="/">react-entity-editor</Link></li>
            <li className="Content_item"><Link to="/dogs">demo (with dogs)</Link></li>
            <li className="Content_item">...with redux form</li>
            <li className="Content_item">...with custom error / loader</li>
            <li className="Content_item">...with custom actions</li>
            <li className="Content_item">...without router</li>
        </ul>
        <div className="Wrapper">
            {props.children}
        </div>
    </div>
}
