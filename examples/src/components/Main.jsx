import React from 'react';
import {Link} from 'react-router';

class AppComponent extends React.Component {
    render() {
        return <div>
            <h1>react-entity-editor</h1>
            <Link to="basic">Basic example</Link>
        </div>;
    }
}

export default AppComponent;
