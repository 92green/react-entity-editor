import React from 'react';
import {Route, IndexRoute} from 'react-router';

import AppHandler from 'components/AppHandler';
import ErrorHandler from 'components/ErrorHandler';
import HomePage from 'pages/HomePage';

import CatsRoutes from 'cats/CatsRoutes';
//import DogsRoutes from 'dogs/DogsRoutes';
//import SlothsRoutes from 'sloths/SlothsRoutes';
//import DodosRoutes from 'dodos/DodosRoutes';

const routes = <Route component={AppHandler} path="/">
    <IndexRoute component={HomePage} />
    {CatsRoutes}
    {/*DogsRoutes}
    {SlothsRoutes}
    {DodosRoutes*/}
    <Route path="*" component={ErrorHandler}/>
</Route>;

export default routes;
