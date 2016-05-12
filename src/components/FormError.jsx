var React = require('react');
var _ = require('lodash');
var Icon = require('trc/components/Icon');


var TestComponent = React.createClass({
    displayName: 'TestComponent',
    render: function () {
        var errors = _.chain(this.props.children).map((value) => {
            if (value) {
                return <li><Icon name="no" size="small"></Icon> {value}</li>;                
            }
        }).compact().value();

        console.log(errors);

        if(errors.length && !this.props.hide) {
            return <ul className="FormError InfoBox InfoBox-error">{errors}</ul>;
        }

        return null;
    }
});

module.exports = TestComponent;