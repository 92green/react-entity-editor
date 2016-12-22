import React from 'react';
import {Link} from 'react-router';

export default (props) => {
    return <ul className="Navigation">
        <li><Link to="/" className="Link">Home</Link></li>
        <li><Link to="transactions" className="Link">Transactions</Link></li>
        <li><Link to="tags" className="Link">Tags</Link></li>
    </ul>
}
