import React, {Component, PropTypes} from 'react';
import {EntityEditor, EntityEditorPropType} from 'react-entity-editor';

import DogsEntityEditorConfig from './DogsEntityEditorConfig';
import DogsList from './DogsList';
import DogsItem from './DogsItem';

class DogsEditor extends Component {
    render() {
        const {viewState, dogs, entityEditor} = this.props;
        return <div>
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
    entityEditor: EntityEditorPropType.isRequired,
    onCreate: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onGo: PropTypes.func.isRequired
};

const withEntityEditor = EntityEditor(DogsEntityEditorConfig);
// this applies React Entity Editor to the editor component using the dogs config
export default withEntityEditor(DogsEditor);
