import React, {Component, PropTypes} from 'react';
import AntsStore from './AntsStore';
import AntsEditor from './AntsEditor';
import Source from '../components/Source';

class AntsExample extends Component {
    render() {
        const {
            ants,
            onCreateAsync,
            onUpdateAsync,
            onDeleteAsync,
            history
        } = this.props;

        return <div>
            <h1>Router demo with ants</h1>
            <p>A standard React Entity Editor example that uses <a href="https://reacttraining.com/react-router/">react-router v4</a> to control the current view instead of the viewState prop found in the other examples.</p>
            <p><Source exampleDir="ants">Source</Source></p>
            <AntsEditor
                ants={ants}
                onCreate={onCreateAsync}
                onUpdate={onUpdateAsync}
                onDelete={onDeleteAsync}
                history={history}
            />
        </div>;
    }
}

AntsExample.propTypes = {
    ants: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            legs: PropTypes.string
        })
    ).isRequired,
    onCreateAsync: PropTypes.func.isRequired,
    onUpdateAsync: PropTypes.func.isRequired,
    onDeleteAsync: PropTypes.func.isRequired,
    history: PropTypes.object // react-router history object
};

const withAntsStore = AntsStore();

// AntsStore is just a stub data store to make the examples work
// it provides data and all the functions required to modify the data

// this example uses react-router, so the state of the view and methods to change the view
// are not provided by AntsStore
export default withAntsStore(AntsExample);
