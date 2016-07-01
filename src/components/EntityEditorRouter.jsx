import React, { Component, PropTypes } from 'react';
import { Route, IndexRoute } from 'react-router';
import { fromJS, List } from 'immutable';

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

    getBaseRoute() {
        const routesLength = this.props.routes.length;
        return "/" + fromJS(this.props.routes)
            .filter(ii => !!ii.get('path') && ii.get('path') != "/") // remove routes that don't add to the path
            .map(ii => ii.get('path')) // get path for each route
            .pop() // remove last route (the 'new' or 'edit' route) to get base
            .join("/")
    }

    getEditorRoute(type, id = false) {
        const base = this.getBaseRoute();
        if(!id) {
            id = this.props.params.id;
        }
        if(type == 'close') {
            return base;
        }
        if(!id || type == 'new') {
            return `${base}/new`;
        }
        if(type == 'edit') {
            return `${base}/${id}/${type}`;
        }
        return null;
    }

    onClose() {
        this.props.history.push(this.getEditorRoute('close'));
    }

    onGotoEdit(id = false) {
        this.props.history.push(this.getEditorRoute('edit', id));
    }

    //
    // render
    //

    render() {
        const propsToAddToChildren = {
            id: this.props.params.id,
            willCopy: this.willCopy(),
            onClose: this.onClose.bind(this),
            onGotoEdit: this.onGotoEdit.bind(this),
            getEditorRoute: this.getEditorRoute.bind(this)
        };

        const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, propsToAddToChildren));
        return <div>{childrenWithProps}</div>;
    }
}

EntityEditorRouter.propTypes = {
    // routes
    routes: PropTypes.array.isRequired,
    params: PropTypes.array.isRequired,
    history: PropTypes.object
};

export default EntityEditorRouter;
