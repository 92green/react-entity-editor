import React from 'react';
import {Route, IndexRoute} from 'react-router';

import AppHandler from 'components/AppHandler';
import ErrorHandler from 'components/ErrorHandler';
import HomePage from 'pages/HomePage';
import DogsEditor from 'dogs/DogsEditor';
import CatsEditor from 'cats/CatsEditor';
import BatsEditor from 'bats/BatsEditor';

const routes = <Route component={AppHandler} path="/">
    <IndexRoute component={HomePage} />
    <Route path="dogs" component={DogsEditor} />
    <Route path="cats" component={CatsEditor} />
    <Route path="bats" component={BatsEditor} />
    <Route path="*" component={ErrorHandler}/>
</Route>;

export default routes;
