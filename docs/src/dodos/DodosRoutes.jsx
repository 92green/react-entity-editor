import React from 'react';
import {Route, IndexRoute} from 'react-router';
import {createEditorRoutes} from 'react-entity-editor';

import DodosOverview from './DodosOverview';
import DodosEdit from './DodosEdit';

const DodosRoutes = <Route path="dodos">
    {createEditorRoutes({
        listComponent: DodosOverview,
        itemComponent: DodosEdit
    })}
</Route>;

export default DodosRoutes;
