/* @flow */

import React from 'react';
import {Route, IndexRoute} from 'react-router';
import EntityEditorRoute from './EntityEditorRoute';
import EntityEditorItemRoute from './EntityEditorItemRoute';

type Params = {
    itemComponent: ?React.Element<any>,
    listComponent: ?React.Element<any>,
    paramName: ?string
};

function createEditorRoutes(params: Params): React.Element<Route> {
    const {
        itemComponent,
        listComponent,
        paramName = 'id'
    } = params;

    return <Route>
        {listComponent && <IndexRoute component={EntityEditorRoute()(listComponent)} />}
        {itemComponent && <Route path="new" component={EntityEditorItemRoute({paramName})(itemComponent)} />}
        {itemComponent && <Route path={`:${paramName}/edit`} component={EntityEditorItemRoute({paramName})(itemComponent)} />}
    </Route>;
}

export default createEditorRoutes;
