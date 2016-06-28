import React, { Component, PropTypes } from 'react';
import { Route, IndexRoute, Link } from 'react-router';
import { List, Map, fromJS } from 'immutable';

//
// Function to create a routing pattern for use with this editor
//

export function createEditorRoutes(params) {
    if(!params || !params.path || !params.component) {
        console.warn("Create editor routes must be passed an object with 'path' and 'component' keys, where the path is a string of the route path, and the component is the editor component to be used in the routes.");
        return null;
    }
    return (
        <Route path={params.path}>
            <Route path="new" component={EntityEditorRouter}>
                <IndexRoute component={params.component}/>
            </Route>
            <Route path=":id/edit" component={EntityEditorRouter}>
                <IndexRoute component={params.component}/>
            </Route>
            <Route path=":id/copy" component={EntityEditorRouter}>
                <IndexRoute component={params.component}/>
            </Route>
        </Route>
    );
};

//
// EntityEditorRouter class
//

class EntityEditorRouter extends Component {

    //
    // helpers
    //

    willCreateNew(props = this.props) {
        return !props.id;
    }

    willCopy(props = this.props) {
        const split = fromJS(props.routes)
            .last()
            .get('path')
            .split('/');

        return fromJS(split).last() == "copy";
    }

    createsOnSave(props = this.props) {
        return this.willCreateNew(props) || this.willCopy(props);
    }

    //
    // render
    //

    render() {
        return <div>???</div>;
    }
}

/*
EntityEditorRouter.propTypes = {
    // id
    id: PropTypes.any,
    // naming
    entityName: PropTypes.string,
    entityNamePlural: PropTypes.string,
    // data transaction states
    reading: PropTypes.bool,
    creating: PropTypes.bool,
    updating: PropTypes.bool,
    deleting: PropTypes.bool,
    // errors
    readError: PropTypes.any,
    writeError: PropTypes.any,
    // callbacks
    onRead: PropTypes.func,
    onCreate: PropTypes.func,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    // routes
    routes: PropTypes.array.isRequired,
    // options
    showHeading: PropTypes.bool
};

EntityEditorRouter.defaultProps = {
    showHeading: true
};

const autoRequest = AutoRequest(['params.id'], (props) => {
    if(props.id && props.onRead) {
        props.onRead(props.id);
    }
});*/

export default EntityEditorRouter;
