import React from 'react';
import ReactDOM from 'react-dom';
import 'sass/style.scss';
//import {Provider} from 'react-redux';
//import store from './store';

import {HashRouter, Route, Switch} from 'react-router-dom';
import AppHandler from 'components/AppHandler';
import ErrorHandler from 'components/ErrorHandler';
import HomePage from 'pages/HomePage';
import DogsExample from 'dogs/DogsExample';
import CatsExample from 'cats/CatsExample';
import AntsExample from 'ants/AntsExample';

const appElement = document.getElementById('app');

ReactDOM.render((
//    <Provider store={store}>
        <HashRouter>
            <AppHandler>
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route path="/dogs" component={DogsExample} />
                    <Route path="/cats" component={CatsExample} />
                    <Route path="/ants" component={AntsExample} />
                    <Route component={ErrorHandler} />
                </Switch>
            </AppHandler>
        </HashRouter>
//    </Provider>
), appElement);
