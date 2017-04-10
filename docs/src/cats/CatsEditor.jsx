import React, {Component} from 'react';
import {EntityEditor} from 'react-entity-editor';
import CatsStateHock from './CatsStateHock';
import CatsEntityEditorConfig from './CatsEntityEditorConfig';

import CatsList from './CatsList';
import CatsItem from './CatsItem';
import Source from '../components/Source';
//import js from '!!raw!./CatsEditor.jsx';

class CatsEditor extends Component {
    render() {
        const {view, cats, entityEditor} = this.props;
        return <div>
            <h1>Cats</h1>
            <p>A standard Entity Editor example that uses no extra libraries. Its operations are synchronous.</p>
            <p>Data and data manipulation functions are provided as props to the editor component.</p>
            <p><Source exampleDir="cats">Source</Source></p>
            {view.name == "list" &&
                <CatsList
                    cats={cats}
                    entityEditor={entityEditor}
                />
            }
            {view.name == "item" &&
                <CatsItem
                    cat={cats.find(cat => cat.id == view.id)}
                    entityEditor={entityEditor}
                />
            }
        </div>;
    }
}

const withCatsStateHock = CatsStateHock();
const withEntityEditor = EntityEditor({
    config: CatsEntityEditorConfig,
    operationProps: (props) => ({
        onCreateCat: props.onCreateAsync,
        onUpdateCat: props.onUpdateAsync,
        onDeleteCat: props.onDeleteAsync,
        onGoCat: props.onGo,
        onGoList: () => props.onGo({id: null, name: "list"}),
        onGoItem: (id) => props.onGo({id, name: "item"})
    })
});

export default withCatsStateHock(withEntityEditor(CatsEditor));
