import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './stores';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { createEditorRoutes } from '../../dist/index'; // normally this would be "from 'react-entity-editor'"


import App from './containers/App';
import Main from './components/Main';

// basic
import BasicExample from './basic/BasicExample';

// routes
import RouterExampleList from './router/RouterExampleList';
import RouterExampleEditor from './router/RouterExampleEditor';
const routerEditorRoutes = createEditorRoutes({
    component: RouterExampleEditor,
    path: "router"
});

import Error from './components/Error';

const store = configureStore();

render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Main}/>
                {/* basic example */}
                <Route path="basic" component={BasicExample} />
                {/* react router example */}
                <Route path="router" component={RouterExampleList} />
                {routerEditorRoutes}
                <Route path="*" component={Error}/>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('app')
);
