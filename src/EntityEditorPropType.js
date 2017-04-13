import {PropTypes} from 'react';

export default PropTypes.shape({
    actions: PropTypes.objectOf(
        PropTypes.func
    ).isRequired,
    abilities: PropTypes.objectOf(
        PropTypes.bool
    ).isRequired,
    status: PropTypes.object
});
