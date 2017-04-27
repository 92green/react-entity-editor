/* @flow */

import PropTypes from 'prop-types';

export default PropTypes.shape({
    actions: PropTypes.objectOf(
        PropTypes.func
    ).isRequired,
    operations: PropTypes.objectOf(
        PropTypes.func
    ).isRequired,
    actionable: PropTypes.bool,
    status: PropTypes.object,
    names: PropTypes.shape({
        item: PropTypes.string,
        items: PropTypes.string,
        Item: PropTypes.string,
        Items: PropTypes.string
    }),
    state: PropTypes.object
});
