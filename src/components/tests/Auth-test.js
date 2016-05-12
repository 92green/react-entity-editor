// import React from 'react';
// import TestUtils from 'react/lib/ReactTestUtils';

// import Auth from 'trc/components/Auth';
// import UserStore from 'trc/user/UserStore';
// import Permissions from 'trc/user/Permissions';

// describe('Auth', () => {

//     beforeEach(() => {
//         spyOn(UserStore, 'is').and.returnValue(false);
//         spyOn(UserStore, 'isAny').and.returnValue(false);
//         spyOn(UserStore, 'isnt').and.returnValue(false);
//         spyOn(UserStore, 'isntAny').and.returnValue(false);
//         spyOn(Permissions, 'get').and.returnValue(false);
//     });

//     it('should with no props just render it\'s children', () => {
//         var renderedDOM = React.findDOMNode(TestUtils.renderIntoDocument(<Auth><div/></Auth>));
//         expect(renderedDOM.tagName).toBe('DIV');
//     });

//     it('should test UserStore.is if given the `is` prop', () => {
//         var renderedDOM = React.findDOMNode(TestUtils.renderIntoDocument(<Auth is="FAKE_ROLE"><div/></Auth>));
//         expect(UserStore.is).toHaveBeenCalled();
//         expect(renderedDOM).toBe(null);
//     });

//     it('should test UserStore.isAny if given the `isAny` prop', () => {
//         var renderedDOM = React.findDOMNode(TestUtils.renderIntoDocument(<Auth isAny={["FAKE_ROLE", 'SECOND_FAKE_ROLE']}><div/></Auth>));
//         expect(UserStore.isAny).toHaveBeenCalled();
//         expect(renderedDOM).toBe(null);
//     });

//     it('should test UserStore.isnt if given the `isnt` prop', () => {
//         var renderedDOM = React.findDOMNode(TestUtils.renderIntoDocument(<Auth isnt={"FAKE_ROLE"}><div/></Auth>));
//         expect(UserStore.isnt).toHaveBeenCalled();
//         expect(renderedDOM).toBe(null);
//     });

//     it('should test UserStore.isntAny if given the `isntAny` prop', () => {
//         var renderedDOM = React.findDOMNode(TestUtils.renderIntoDocument(<Auth isntAny={["FAKE_ROLE", 'SECOND_FAKE_ROLE']}><div/></Auth>));
//         expect(UserStore.isntAny).toHaveBeenCalled();
//         expect(renderedDOM).toBe(null);
//     });

//     it('should test Permissions.get if given the `get` prop', () => {
//         var renderedDOM = React.findDOMNode(TestUtils.renderIntoDocument(<Auth perm={"FAKE_PERMISSION"}><div/></Auth>));
//         expect(Permissions.get).toHaveBeenCalled();
//         expect(renderedDOM).toBe(null);
//     });

//     it('should render the prop type of the prop component', () => {
//         var renderedDOM = React.findDOMNode(TestUtils.renderIntoDocument(<Auth component="li"><div/></Auth>));
//         expect(renderedDOM.tagName).toBe('LI');
//     });

// })