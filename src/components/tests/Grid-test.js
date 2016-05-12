import React from 'react';
var TestUtils = require('react/lib/ReactTestUtils');
var Grid = require('trc/components/Grid');


describe('Grid', () => {

    it('should render with the correct DOM', () => {
        var grid = TestUtils.renderIntoDocument(<Grid className="test"></Grid>);
        var renderedDOM = React.findDOMNode(grid);
        expect(renderedDOM.tagName).toBe('DIV');
        expect(renderedDOM.classList[0]).toBe('grid');
        expect(renderedDOM.classList[1]).toBe('test');
    });

})