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

// routes

import Routes from './routes/Routes';
import RoutesEditor from './routes/RoutesEditor';
const routesEditorRoutes = createEditorRoutes({
    component: RoutesEditor,
    path: "routes"
});

import Error from './components/Error';

const store = configureStore();

render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Main}/>
                <Route path="basic" component={Basic} />
                <Route path="routes" component={Routes} />
                {routesEditorRoutes}
                <Route path="*" component={Error}/>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('app')
);
