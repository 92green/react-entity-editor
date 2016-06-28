import React, { Component, PropTypes } from 'react';
import { Route, IndexRoute, Link } from 'react-router';
import { fromJS } from 'immutable';

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

    willCopy(props = this.props) {
        const split = fromJS(props.routes)
            .get(props.routes.length - 2) // route containing :id and edit / copy
            .get('path')
            .split('/');

        return fromJS(split).last() == "copy";
    }

    //
    // navigation
    //

    getEditorRoute(type, id) {

        return "TEST:"+type+"..."+id;

        /*

        // only used to allow people to navigate from a newly created item to its edit page
        if(!id) {
            return null;
        }
        const link = "/"+fromJS(this.props.routes)
            .filter(ii => ii.has('path') && ii.get('path') != "/")
            .map(ii => ii.get('path'))
            .join("/");

        return link.replace(/(\/new|\/:id\/(edit|copy))/i, "/"+id+"/edit");*/
    }

    //
    // render
    //

    render() {
        const propsToAddToChildren = {
            id: this.props.params.id,
            willCopy: this.willCopy(),
            getEditorRoute: this.getEditorRoute
        };

        const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, propsToAddToChildren));
        return <div>{childrenWithProps}</div>;
    }
}

EntityEditorRouter.propTypes = {
    // routes
    routes: PropTypes.array.isRequired,
    params: PropTypes.array.isRequired
};

export default EntityEditorRouter;
