import React from 'react';
import {Link} from 'react-router';

class AppComponent extends React.Component {
    render() {
        return <div>
            <h1>react-entity-editor</h1>
            <ul>
            	<li><Link to="basic">Basic example</Link></li>
            	<li><Link to="router">React router example</Link></li>
            </ul>
        </div>;
    }
}

export default AppComponent;
