import React, {PropTypes} from 'react';
import {Link} from 'react-router';

import {FaultyApiSync} from '../api/Api';
import DodosList from './DodosList';

import Source from '../components/Source';

function DodosOverview(props) {
    const {
        dodos_list,
        fetch,
        error
    } = props;

    return <div>
        <h1>Errors with dodos</h1>
        <p>This example shows how errors work, building upon the basic structure of the <Link to="/dogs">dogs example</Link>.</p>
        <p>Loading the list here, or loading an extsing dodo will fail about half the time to demonstrate errors being displayed in the page.</p>
        <p>Create, updated and delete fail all the time to demonstrate error prompts.</p>
        <p><strong>Keep refreshing the page to see this fail!</strong></p>

        <p><Source exampleDir="dodos">Source</Source></p>
        <DodosList
            dodos_list={dodos_list}
            receivedWhen={props => !!props.dodos_list}
            fetch={fetch}
            error={error}
        />
    </div>;
}

DodosOverview.propTypes = {
    dodos_list: PropTypes.array,
    fetch: PropTypes.bool,
    error: PropTypes.object
};

const withSync = FaultyApiSync.dodos.list();
export default withSync(DodosOverview);
