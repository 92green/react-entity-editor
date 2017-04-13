import React, {Component, PropTypes} from 'react';
import {EntityEditor, EntityEditorPropType} from 'react-entity-editor';

import DogsStore from './DogsStore';
import DogsEntityEditorConfig from './DogsEntityEditorConfig';
import DogsList from './DogsList';
import DogsItem from './DogsItem';
import Source from '../components/Source';

class DogsEditor extends Component {
    render() {
        const {viewState, dogs, entityEditor} = this.props;
        return <div>
            <h1>Standard demo with dogs</h1>
            <p>A standard React Entity Editor example that uses no extra libraries. Its operations are synchronous. All statuses appear in the default modal prompt.</p>
            <p>Data and data manipulation functions are provided as props to the editor component.</p>
            <p><Source exampleDir="dogs">Source</Source></p>
            {viewState.view == "list" &&
                <DogsList
                    dogs={dogs}
                    entityEditor={entityEditor}
                />
            }
            {viewState.view == "item" &&
                <DogsItem
                    dog={dogs.find(dog => dog.id == viewState.id)}
                    entityEditor={entityEditor}
                />
            }
        </div>;
    }
}

DogsEditor.propTypes = {
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
    entityEditor: EntityEditorPropType.isRequired
};

const withDogsStore = DogsStore(); // DogsStore is just a stub data store to make the examples work
const withEntityEditor = EntityEditor(DogsEntityEditorConfig); // this applies React Entity Editor to the editor component
export default withDogsStore(withEntityEditor(DogsEditor));
