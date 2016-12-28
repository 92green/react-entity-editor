import React, {PropTypes} from 'react';
import Source from '../components/Source';
//import js from '!!raw!./DogsOverview.jsx';

import {ApiSync} from '../api/Api';
import DogsList from './DogsList';

function DogsOverview(props) {
    const {
        dogs_list,
        fetch,
        error
    } = props;

    return <div>
        <h1>Dogs</h1>
        <h5>Under development</h5>
        <p>This example demonstrates a standard setup with <code>list</code> and <code>item</code> pages.
        <br/>It uses <a href="https://github.com/reactjs/redux">redux</a> for state management and actions and <a href="https://github.com/ReactTraining/react-router">react-router v3</a> for routing.</p>
        <p><Source exampleDir="dogs">Source</Source></p>
        <DogsList
            dogs_list={dogs_list.toJS()}
            receivedWhen={props => !!props.dogs_list}
            fetch={fetch}
            error={error}
        />
    </div>;
}

DogsOverview.propTypes = {
    dogs_list: PropTypes.object,
    fetch: PropTypes.bool,
    error: PropTypes.object
};

const withSync = ApiSync.dogs.list();
export default withSync(DogsOverview);
