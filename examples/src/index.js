import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import {Router, hashHistory} from 'react-router';
import routes from './routes';
import store from './store';
import 'sass/style.scss';

/*
import {setTransactions} from './transactions/TransactionActions';
import TransactionCSV from './transactions/TransactionCSV';
*/

//
// try to load transactions from local CSV
//

/*
try {
    const transactions = require('../../transactions.csv');
    const transactionList = TransactionCSV.prepare(transactions);
    store.dispatch(setTransactions(transactionList));
} catch(e) {
    console.log("E", e);
}
*/

//
// render app
//

const appElement = document.getElementById('app');

ReactDOM.render((
    <Provider store={store}>
        <Router history={hashHistory} routes={routes}/>
    </Provider>
), appElement);
