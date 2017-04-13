import React, {Component, PropTypes} from 'react';
import {EntityEditor, EntityEditorPropType} from 'react-entity-editor';

import BatsStore from './BatsStore';
import BatsEntityEditorConfig from './BatsEntityEditorConfig';
import BatsList from './BatsList';
import BatsItemLoader from './BatsItemLoader';
import Source from '../components/Source';

class BatsEditor extends Component {
    render() {
        const {viewState, bats, bat, entityEditor} = this.props;
        // the bats and bat props will only contain data once it is requested from the BatsStore

        return <div>
            <h1>Full async with bats</h1>
            <p>Both the read and the write operations are asynchronous in this example. Lifecycle methods in <code>BatsList</code> and <code>BatsItemLoader</code> request data from the <code>BatsStore</code>, which loads with a short delay.</p>
            <p><Source exampleDir="bats">Source</Source></p>
            {viewState.view == "list" &&
                <BatsList
                    bats={bats}
                    entityEditor={entityEditor}
                />
            }
            {viewState.view == "item" &&
                // An id is passed instead of a bat object because the BatsItemLoader component loads its own data on mount
                <BatsItemLoader
                    id={viewState.id}
                    bat={bat}
                    entityEditor={entityEditor}
                />
            }
        </div>;
    }
}

BatsEditor.propTypes = {
    viewState: PropTypes.shape({
        view: PropTypes.string.isRequired,
        id: PropTypes.string
    }).isRequired,
    bats: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            toy: PropTypes.string
        })
    ),
    entityEditor: EntityEditorPropType.isRequired
};

const withBatsStore = BatsStore(); // BatsStore is just a stub data store to make the examples work
const withEntityEditor = EntityEditor(BatsEntityEditorConfig); // this applies React Entity Editor to the editor component
export default withBatsStore(withEntityEditor(BatsEditor));
