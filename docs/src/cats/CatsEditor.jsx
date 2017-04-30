import React, {Component, PropTypes} from 'react';
import {EntityEditor, EntityEditorPropType} from 'react-entity-editor';

import CatsEntityEditorConfig from './CatsEntityEditorConfig';
import CatsList from './CatsList';
import CatsItem from './CatsItem';

class CatsEditor extends Component {
    render() {
        const {viewState, cats, entityEditor} = this.props;
        return <div>
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
    entityEditor: EntityEditorPropType.isRequired,
    onCreate: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onGo: PropTypes.func.isRequired
};

const withEntityEditor = EntityEditor(CatsEntityEditorConfig);
// this applies React Entity Editor to the editor component using the cats config
export default withEntityEditor(CatsEditor);
