import React, {Component, PropTypes} from 'react';
import {Route, Switch} from 'react-router-dom';
import {EntityEditor, EntityEditorPropType} from 'react-entity-editor';

import AntsEntityEditorConfig from './AntsEntityEditorConfig';
import AntsList from './AntsList';
import AntsItem from './AntsItem';
import Source from '../components/Source';

class AntsEditor extends Component {
    render() {
        const {ants, entityEditor} = this.props;

        const antsList = () => <AntsList
            ants={ants}
            entityEditor={entityEditor}
        />;

        const antsEdit = (props) => <AntsItem
            ant={ants.find(ant => ant.id == props.match.params.id)}
            entityEditor={entityEditor}
        />;

        const antsNew = () => <AntsItem
            entityEditor={entityEditor}
            isNew
        />;

        return <Switch>
            <Route exact path="/ants" render={antsList} />
            <Route path="/ants/item/:id" render={antsEdit} />
            <Route path="/ants/item" render={antsNew} />
        </Switch>;
    }
}

AntsEditor.propTypes = {
    ants: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            toy: PropTypes.string
        })
    ).isRequired,
    entityEditor: EntityEditorPropType.isRequired,
    onCreate: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};

const withEntityEditor = EntityEditor(AntsEntityEditorConfig); // this applies React Entity Editor to the editor component with the ants config
export default withEntityEditor(AntsEditor);
