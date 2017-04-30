import React, {Component, PropTypes} from 'react';
import CatsStore from './CatsStore';
import CatsEditor from './CatsEditor';
import Source from '../components/Source';

class CatsExample extends Component {
    render() {
        const {
            viewState,
            cats,
            onCreateAsync,
            onUpdateAsync,
            onDeleteAsync,
            onGo
        } = this.props;

        return <div>
            <h1>Async demo with cats</h1>
            <p>The write operations are asynchronous in this example. Also most statuses appear in the default modal prompt, but the saving statuses are passed as props and rendered next to the save button.</p>
            <p><Source exampleDir="cats">Source</Source></p>
            <CatsEditor
                viewState={viewState}
                cats={cats}
                onCreate={onCreateAsync}
                onUpdate={onUpdateAsync}
                onDelete={onDeleteAsync}
                onGo={onGo}
            />
        </div>;
    }
}

CatsExample.propTypes = {
    viewState: PropTypes.shape({
        view: PropTypes.string.isRequired,
        id: PropTypes.string
    }).isRequired,
    cats: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            toy: PropTypes.string
        })
    ).isRequired,
    onCreateAsync: PropTypes.func.isRequired,
    onUpdateAsync: PropTypes.func.isRequired,
    onDeleteAsync: PropTypes.func.isRequired,
    onGo: PropTypes.func.isRequired
};

const withCatsStore = CatsStore();
// CatsStore is just a stub data store to make the examples work
// it provides data, all the functions required to modify the data,
// and state about the current view

export default withCatsStore(CatsExample);
