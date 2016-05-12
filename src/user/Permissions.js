import UserStore from 'trc-client-core/src/user/UserStore';
import Permission from 'trc-client-core/src/constants/Permission';

// A small api for the Permission constants
// Applies the current UserStore object for tests

var Permissions = {
    get: function (key) {
        if(!Permission[key]) {
            console.error(key, 'is not a valid permission');
        }
        return Permission[key](UserStore);
    },
    isPermission(key) {
        return Permissions.get(key);
    },
    isntPermission(key) {
        return !Permissions.get(key);
    }
};

export default Permissions;