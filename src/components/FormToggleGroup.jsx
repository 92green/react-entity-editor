
var React = require('react');
var _ = require('lodash');

var ToggleGroup = require('trc/components/ToggleGroup');

var FormToggleGroup = React.createClass({
    displayName: 'FormToggleGroup',
    propTypes: {
        name: React.PropTypes.string.isRequired,
        toggles: React.PropTypes.array.isRequired,
        value: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func.isRequired
    },
    getDetails(e, selected) {
        var key = _.findKey(selected.value, data => {
            return data === true;         
        });

        // var details =  _.map(selected.value, (data, key) => { 
        //     // console.log(data, key);
        //     // return (a) ? b : null;
        // });
        // console.log(details);
        return {key: this.props.name, value: key};
    },
    onChange(e, details) {

        if(this.props.onChange) {
            this.props.onChange(e, this.getDetails(e, details));
        }
    },
    render() {
        var {name, toggles, value} = this.props;
        var togglesObject = toggles.map(data => ({value: _.camelCase(data), label: data}));

        return (
            <ToggleGroup
                {...this.props}
                name={name}
                toggles={togglesObject}
                value={[value]} 
                onChange={this.onChange} 
                defaultToggle={null} 
            />
        );
    }
});

module.exports = FormToggleGroup;