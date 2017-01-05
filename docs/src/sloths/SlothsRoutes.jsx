import React from 'react';
import {Route, IndexRoute} from 'react-router';
import {createEditorRoutes} from 'react-entity-editor';

import SlothsOverview from './SlothsOverview';
import SlothsEdit from './SlothsEdit';

const SlothsRoutes = <Route path="sloths">
    {createEditorRoutes({
        listComponent: SlothsOverview,
        itemComponent: SlothsEdit
    })}
</Route>;

export default SlothsRoutes;
