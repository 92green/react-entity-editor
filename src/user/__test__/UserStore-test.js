import tape from 'tape';
import TestFakeDom from 'trc-client-core/src/utils/TestFakeDom';
import UserStore from 'trc-client-core/src/user/UserStore';
import {stub} from 'sinon';

stub(document, 'getElementById', () => ({
    text: JSON.stringify({
        authorities:['ROLE_TEST', 'ROLE_OTHER_TEST'],
        jobPositionDesc: 'test',
        departmentCategory: ['testDepartment']
    })
}));

tape('UserStore.init', test => {
    test.plan(1);
    UserStore.init();
    test.ok(UserStore.get('authorities').get(0) === 'ROLE_TEST', 'sets the user object');
});

tape('UserStore.is', test => {
    test.plan(1);
    UserStore.init();
    test.ok(UserStore.is('ROLE_TEST'), 'checks if the user has a permission');
});


tape('UserStore.isnt', test => {
    test.plan(1);
    test.ok(UserStore.isnt('ROLE_WRONG'), 'checks if the user does not have a permission');
});

tape('UserStore.isAny', test => {
    test.plan(1);
    test.ok(UserStore.isAny(['ROLE_WRONG', 'ROLE_TEST']), 'checks if the user has at least one of the supplied permissions');
});

tape('UserStore.isntAny', test => {
    test.plan(1);
    test.ok(UserStore.isntAny(['ROLE_WRONG', 'ROLE_WRONG2']), 'checks if the user has at least one of the supplied permissions');
});

tape('UserStore.isDepartment', test => {
    test.plan(1);
    test.ok(UserStore.isDepartment('testDepartment'), 'checks if the is part of the supplied department');
});

tape('UserStore.isJob', test => {
    test.plan(1);
    test.ok(UserStore.isJob('test'), 'checks the user is the supplied job role');
});


tape('UserStore.isntJob', test => {
    test.plan(1);
    test.notOk(UserStore.isntJob('test'), 'checks the user is not the supplied job role');
});

tape.onFinish(document.getElementById.restore);
