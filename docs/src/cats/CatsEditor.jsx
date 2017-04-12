import React, {Component, PropTypes} from 'react';
import {EntityEditor, EntityEditorPropType} from 'react-entity-editor';

import CatsStore from './CatsStore';
import CatsEntityEditorConfig from './CatsEntityEditorConfig';
import CatsList from './CatsList';
import CatsItem from './CatsItem';
import Source from '../components/Source';

class CatsEditor extends Component {
    render() {
        const {viewState, cats, entityEditor} = this.props;
        return <div>
            <h1>Async demo with cats</h1>
            <p>The write operations are asynchronous in this example. Also most statuses appear in the default modal prompt, but the saving statuses are passed as props and rendered next to the save button.</p>
            <p><Source exampleDir="cats">Source</Source></p>
            {viewState.view == "list" &&
                <CatsList
                    cats={cats}
                    entityEditor={entityEditor}
                />
            }
            {viewState.view == "item" &&
                <CatsItem
                    cat={cats.find(cat => cat.id == viewState.id)}
                    entityEditor={entityEditor}
                />
            }
        </div>;
    }
}

CatsEditor.propTypes = {
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
    entityEditor: EntityEditorPropType.isRequired
};

const withCatsStore = CatsStore(); // CatsStore is just a stub data store to make the examples work
const withEntityEditor = EntityEditor(CatsEntityEditorConfig); // this applies React Entity Editor to the editor component
export default withCatsStore(withEntityEditor(CatsEditor));
