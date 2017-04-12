import React from 'react';
import {Link} from 'react-router';

export default (props) => {
    return <div>
        <ul className="Content">
            <li className="Content_item">
                <ul className="Content_section">
                    <li className="Content_item"><a href="https://github.com/dxinteractive/react-entity-editor">github</a></li>
                </ul>
            </li>
            <li className="Content_item">
                <ul className="Content_section">
                    <li className="Content_item"><Link to="/">react-entity-editor</Link></li>
                    <li className="Content_item"><Link to="/dogs">standard demo (with dogs)</Link></li>
                    <li className="Content_item"><Link to="/cats">async demo (with cats)</Link></li>
                </ul>
            </li>
        </ul>
        <div className="Wrapper">
            {props.children}
        </div>
    </div>
}
