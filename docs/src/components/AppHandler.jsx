import React from 'react';
import {Link} from 'react-router-dom';

export default (props) => {
    return <div>
        <ul className="Navigation">
            <li className="Navigation_item">
                <ul className="Navigation_section">
                    <li className="Navigation_item"><a href="https://github.com/dxinteractive/react-entity-editor">github</a></li>
                </ul>
            </li>
            <li className="Navigation_item">
                <ul className="Navigation_section">
                    <li className="Navigation_item"><Link to="/">react-entity-editor</Link></li>
                    <li className="Navigation_item"><Link to="/dogs/">standard demo (with dogs)</Link></li>
                    <li className="Navigation_item"><Link to="/cats/">async demo (with cats)</Link></li>
                    <li className="Navigation_item"><Link to="/ants/">router demo (with ants)</Link></li>
                    {/*<li className="Navigation_item"><Link to="/bats/">full async (with bats)</Link></li>*/}
                </ul>
            </li>
        </ul>
        <div className="Wrapper">
            {props.children}
        </div>
    </div>
}
