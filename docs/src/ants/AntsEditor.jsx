import React, {Component, PropTypes} from 'react';
import {Route, Switch} from 'react-router-dom';
import {EntityEditor, EntityEditorPropType} from 'react-entity-editor';

import AntsStore from './AntsStore';
import AntsEntityEditorConfig from './AntsEntityEditorConfig';
import AntsList from './AntsList';
import AntsItem from './AntsItem';
import Source from '../components/Source';

class AntsEditor extends Component {
    render() {
        const {match, ants, entityEditor} = this.props;

        return <div>
            <h1>Router demo with ants</h1>
            <p>A standard React Entity Editor example that uses <a href="https://reacttraining.com/react-router/">react-router v4</a> to control the current view instead of the viewState prop found in the other examples.</p>
            <p><Source exampleDir="ants">Source</Source></p>

            <Switch>
                <Route exact path={`${match.path}`} render={() => {
                    return <AntsList
                        ants={ants}
                        entityEditor={entityEditor}
                    />;
                }} />
                <Route path={`${match.path}/item/:id`} render={({match}) => {
                    return <AntsItem
                        ant={ants.find(ant => ant.id == match.params.id)}
                        entityEditor={entityEditor}
                    />;
                }} />
                <Route path={`${match.path}/item`} render={() => {
                    return <AntsItem
                        entityEditor={entityEditor}
                        isNew
                    />;
                }} />
            </Switch>
        </div>;
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
    match: PropTypes.shape({
        path: PropTypes.string
    })
};

const withAntsStore = AntsStore(); // AntsStore is just a stub data store to make the examples work
const withEntityEditor = EntityEditor(AntsEntityEditorConfig); // this applies React Entity Editor to the editor component
export default withAntsStore(withEntityEditor(AntsEditor));
