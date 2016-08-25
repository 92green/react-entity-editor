require('normalize.css/normalize.css');
require('styles/App.css');

import React, {Component} from 'react';

class App extends Component {
    render() {
        return <div className="Wrapper">
            {this.props.children}
        </div>;
    }
}

export default App;
