/* @flow */

import EntityEditorHock from './EntityEditorHock';
import Compose from 'stampy/lib/util/Compose';

export default (config: EntityEditorConfig) => Compose(
    ...config.get('composeComponents')(config)
);
