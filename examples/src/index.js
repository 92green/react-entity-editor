import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './stores';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './containers/App';
import Main from './components/Main';
import Basic from './components/Basic';
import Error from './components/Error';

const store = configureStore();

render(
    <Provider store={store}>
        <Router history={browserHistory}>
           <Route path="/" component={App}>
               <IndexRoute component={Main}/>
               <Route path="basic" component={Basic} />
               <Route path="*" component={Error}/>
           </Route>
        </Router>
    </Provider>,
    document.getElementById('app')
);
