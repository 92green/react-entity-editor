import React from 'react';
import {Route, IndexRoute} from 'react-router';
import {createEditorRoutes} from 'react-entity-editor';

import AppHandler from 'components/AppHandler';
import ErrorHandler from 'components/ErrorHandler';
import HomePage from 'pages/HomePage';
import TagsOverview from 'tags/TagsOverview';
import TagsEdit from 'tags/TagsEdit';
import TransactionsPage from 'pages/TransactionsPage';

const routes = <Route component={AppHandler} path="/">
    <IndexRoute component={HomePage} />
    <Route path="tags">
        {createEditorRoutes({
            listComponent: TagsOverview,
            itemComponent: TagsEdit
        })}
    </Route>
    <Route path="transactions" component={TransactionsPage} />
    <Route path="*" component={ErrorHandler}/>
</Route>;

export default routes;
