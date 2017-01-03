/* @flow */

import React from 'react';
import {Route, IndexRoute} from 'react-router';
import EntityEditorRoute from './EntityEditorRoute';
import EntityEditorItemRoute from './EntityEditorItemRoute';

type Params = {
    itemComponent: ?React.Element<any>,
    listComponent: ?React.Element<any>,
    paramId: ?string
};

function createEditorRoutes(params: Params): React.Element<Route> {
    const {
        itemComponent,
        listComponent,
        paramId = 'id'
    } = params;

    return <Route>
        {listComponent && <IndexRoute component={EntityEditorRoute()(listComponent)} />}
        {itemComponent && <Route path="new" component={EntityEditorItemRoute({paramId})(itemComponent)} />}
        {itemComponent && <Route path={`:${paramId}/edit`} component={EntityEditorItemRoute({paramId})(itemComponent)} />}
    </Route>;
}

export default createEditorRoutes;
