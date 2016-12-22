import React from 'react';
import {connect} from 'react-redux';
import {Table} from 'stampy';

function TransactionsPage({transactions}) {

    const schema = [
        {
            heading: 'Date',
            value: 'date'
        },
        {
            heading: 'Amount',
            value: 'amount'
        },
        {
            heading: 'Description',
            value: 'desc'
        }
    ];

    return <div>
        <h1>Transactions</h1>
        <Table
            data={transactions}
            schema={schema}
        />
    </div>;
}

const withRedux = connect((state) => ({
    transactions: state.transactions.get('list')
}));

export default withRedux(TransactionsPage);
