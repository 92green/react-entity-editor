
var React = require('react');
var Input = require('bd-stampy/components/InputElement');

var RadioButton = React.createClass({
    displayName: 'RadioButton',
    mixins: [
        require('bd-stampy/mixins/ClassMixin')
    ],
    render: function () {
        var classes = this.createClassName('Radio');

        var defaultChecked = this.props.defaultChecked;
        if(this.props.defaultCheckedFromValue === this.props.value) {
            defaultChecked = true;
        }
        
        return (
            <div className="Star">
                <Input 
                    type="radio"
                    name={this.props.name}
                    value={this.props.value}
                    onChange={this.props.onChange}
                    defaultChecked={defaultChecked}
                    className={classes.child('input')}
                />
                <span className={classes.child('label')}>{this.props.children}</span>
            </div>
        );
    },
    
});

module.exports = RadioButton;