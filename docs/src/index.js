import React from 'react';
import ReactDOM from 'react-dom';
import 'sass/style.scss';
//import {Provider} from 'react-redux';
//import store from './store';

import {BrowserRouter, Route, Switch} from 'react-router-dom';
import AppHandler from 'components/AppHandler';
import ErrorHandler from 'components/ErrorHandler';
import HomePage from 'pages/HomePage';
import DogsEditor from 'dogs/DogsEditor';
import CatsEditor from 'cats/CatsEditor';
import BatsEditor from 'bats/BatsEditor';

const appElement = document.getElementById('app');

ReactDOM.render((
//    <Provider store={store}>
        <BrowserRouter>
            <AppHandler>
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route path="/dogs" component={DogsEditor}/>
                    <Route path="/cats" component={CatsEditor}/>
                    <Route path="/bats" component={BatsEditor}/>
                    <Route component={ErrorHandler} />
                </Switch>
            </AppHandler>
        </BrowserRouter>
//    </Provider>
), appElement);
