import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './stores';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { createEditorRoutes } from 'react-entity-editor';


import App from './containers/App';
import Main from './components/Main';

// basic

import Basic from './basic/Basic';
import BasicEditor from './basic/BasicEditor';
const basicEditorRoutes = createEditorRoutes({
    component: BasicEditor,
    path: "basic"
});

import Error from './components/Error';

const store = configureStore();

render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Main}/>
                <Route path="basic" component={Basic} />
                {basicEditorRoutes}
                <Route path="*" component={Error}/>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('app')
);
