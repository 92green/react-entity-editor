// import React from 'react';
// import TestUtils from 'react/lib/ReactTestUtils';

// import {ASK_FORM} from 'trc-client-core/src/constants/Endpoints';

// import AskForm from 'trc-client-core/src/components/AskForm';
// import UserStore from 'trc-client-core/src/user/UserStore';
// import Permissions from 'trc-client-core/src/user/Permissions';

// describe('AskForm', () => {

//     beforeEach(() => {
//         spyOn(UserStore, 'get').and.returnValue('NAME');
//     });

//     it('should post to the correct url', () => {
//         var dom = React.findDOMNode(TestUtils.renderIntoDocument(<AskForm/>));
//         expect(dom.querySelector('form').action).toBe(window.location.origin + ASK_FORM);
//         expect(dom.querySelector('input[name=firstName]').value).toBe('NAME');
//         expect(dom.querySelector('input[name=lastName]').value).toBe('NAME');
//     });

// })