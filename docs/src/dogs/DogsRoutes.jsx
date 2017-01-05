import React from 'react';
import {Route, IndexRoute} from 'react-router';
import {createEditorRoutes} from 'react-entity-editor';

import DogsOverview from './DogsOverview';
import DogsEdit from './DogsEdit';

const DogsRoutes = <Route path="dogs">
    {createEditorRoutes({
        listComponent: DogsOverview,
        itemComponent: DogsEdit
    })}
</Route>;

export default DogsRoutes;
