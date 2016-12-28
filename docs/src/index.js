import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import {Router, hashHistory} from 'react-router';
import routes from './routes';
import store from './store';
import 'sass/style.scss';

const appElement = document.getElementById('app');

ReactDOM.render((
    <Provider store={store}>
        <Router history={hashHistory} routes={routes}/>
    </Provider>
), appElement);
