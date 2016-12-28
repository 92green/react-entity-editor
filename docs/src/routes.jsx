import React from 'react';
import {Route, IndexRoute} from 'react-router';
import {createEditorRoutes} from 'react-entity-editor';

import AppHandler from 'components/AppHandler';
import ErrorHandler from 'components/ErrorHandler';
import HomePage from 'pages/HomePage';

import DogsOverview from 'dogs/DogsOverview';
import DogsEdit from 'dogs/DogsEdit';

const routes = <Route component={AppHandler} path="/">
    <IndexRoute component={HomePage} />
    <Route path="dogs">
        {createEditorRoutes({
            listComponent: DogsOverview,
            itemComponent: DogsEdit
        })}
    </Route>
    <Route path="*" component={ErrorHandler}/>
</Route>;

export default routes;
