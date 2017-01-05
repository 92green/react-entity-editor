import React from 'react';
import {Route, IndexRoute} from 'react-router';

import AppHandler from 'components/AppHandler';
import ErrorHandler from 'components/ErrorHandler';
import HomePage from 'pages/HomePage';

import DogsRoutes from 'dogs/DogsRoutes';
import SlothsRoutes from 'sloths/SlothsRoutes';

const routes = <Route component={AppHandler} path="/">
    <IndexRoute component={HomePage} />
    {DogsRoutes}
    {SlothsRoutes}
    <Route path="*" component={ErrorHandler}/>
</Route>;

export default routes;
