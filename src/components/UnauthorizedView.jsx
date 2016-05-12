var React = require('react');
var ErrorMessage = require('trc/components/ErrorMessage'); 

var UnauthorizedView = React.createClass({
    displayName: 'UnauthorizedView',
    render: () => {
        return <ErrorMessage code={403}/>;
    }
});

module.exports = UnauthorizedView;