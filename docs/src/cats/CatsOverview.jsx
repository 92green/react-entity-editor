import React, {Component} from 'react';
import {EntityEditorHock} from 'react-entity-editor';
import CatsStateHock from './CatsStateHock';
import CatsEntityEditorConfig from './CatsEntityEditorConfig';

import CatsList from './CatsList';
import CatsItem from './CatsItem';
import Source from '../components/Source';
//import js from '!!raw!./CatsOverview.jsx';

class CatsOverview extends Component {
    render() {
        const {
            view,
            cats,
            entityEditor
        } = this.props;

        return <div>
            <h1>Cats</h1>
            <p>This example exists just to dev the new structure.</p>
            <p><Source exampleDir="cats">Source</Source></p>
            {view.name == "list" &&
                <div>
                    <p>List:</p>
                    <CatsList
                        cats={cats}
                        entityEditor={entityEditor}
                    />
                </div>
            }
            {view.name == "item" &&
                <div>
                    <p>Item {view.id}:</p>
                    <CatsItem
                        cat={cats.find(cat => cat.id == view.id)}
                        entityEditor={entityEditor}
                    />
                </div>
            }
        </div>;
    }
}

const withCatsStateHock = CatsStateHock();
const withEntityEditor = EntityEditorHock({
    config: CatsEntityEditorConfig,
    operationProps: (props) => {
        return {
            onGoCat: props.onGo,
            onCreateCat: props.onCreate,
            onUpdateCat: props.onUpdate,
            onDeleteCat: props.onDelete
        };
    }
});

export default withCatsStateHock(withEntityEditor(CatsOverview));
