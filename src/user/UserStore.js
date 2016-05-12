import Reflux from 'reflux';
import xhr from 'trc/utils/xhr';
import {fromJS, List} from 'immutable';
import AuthMap from 'trc/constants/AuthMap';

// Make strings a stringy array.
function makeList(data) {
    if(typeof data === 'string') {
        return List([data]);
    } else if (data.size === undefined) {
        return List(data);
    } else {
        return data;
    }
}

// perm should be a subset of auth;
function is(perm, auth) {
    return makeList(perm).isSubset(auth);
}



var UserStore = Reflux.createStore({
    mixins: [
        require('reflux-immutable/ImmutableStoreMixin')
    ],
    init() {
        var script = document.getElementById("perm");
        if(script) {
            this.setState(JSON.parse(script.text));
        }
    },
    is: function (perm) {
        return is(perm, this.get('authorities').toJS());
    },
    isnt: function (perm) {
        return !UserStore.is(perm);
    },
    isAny: function (perm) {
        // The intersection of the two arrays will be greater than 1 if they share
        // the contents of `perm`
        return makeList(perm).toSet().intersect(this.get('authorities').toSet()).size >= 1;
    },
    isntAny: function (perm) {
        return makeList(perm).toSet().intersect(this.get('authorities').toSet()).size === 0;
    },
    isDepartment: function (perm) {
        return is(perm, this.get('departmentCategory').toJS());
    },
    isJob: (perm) => {
        return perm === UserStore.get('jobPositionDesc')
    },
    isAnyDepartment: function (perm) {
        return makeList(perm).toSet().intersect(this.get('departmentCategory').toSet()).size >= 1;
    },
    isntJob: (perm) => !UserStore.isJob(perm),
    isSite: function (perm) {
        return perm.toLowerCase() === this.get('site').toLowerCase();
    },
    match(testMap) {
        for (var key in testMap) {
            if(testMap.hasOwnProperty(key)){
                const authMap = AuthMap(testMap)
                if (authMap[key] && !authMap[key]()) {
                    return false;
                }
            }
        }

        return true
    }
});


export default UserStore;
