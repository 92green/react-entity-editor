import React, {Component, PropTypes} from 'react';
import DogsStore from './DogsStore';
import DogsEditor from './DogsEditor';
import Source from '../components/Source';

class DogsExample extends Component {
    render() {
        const {
            viewState,
            dogs,
            onCreate,
            onUpdate,
            onDelete,
            onGo
        } = this.props;

        return <div>
            <h1>Standard demo with dogs</h1>
            <p>A standard React Entity Editor example that uses no extra libraries. Its operations are synchronous. All statuses appear in the default modal prompt.</p>
            <p>Data and data manipulation functions are provided as props to the editor component.</p>
            <DogsEditor
                viewState={viewState}
                dogs={dogs}
                onCreate={onCreate}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onGo={onGo}
            />
        </div>;
    }
}

DogsExample.propTypes = {
    viewState: PropTypes.shape({
        view: PropTypes.string.isRequired,
        id: PropTypes.string
    }).isRequired,
    dogs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            toy: PropTypes.string
        })
    ).isRequired,
    onCreate: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onGo: PropTypes.func.isRequired
};

const withDogsStore = DogsStore();
// DogsStore is just a stub data store to make the examples work
// it provides data, all the functions required to modify the data,
// and state about the current view

export default withDogsStore(DogsExample);
