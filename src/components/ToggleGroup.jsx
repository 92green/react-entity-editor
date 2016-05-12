var React = require('react'),
    _ = require('lodash');

var ToggleBox = require('./ToggleBox');
var ClassMixin = require('bd-stampy/mixins/ClassMixin.jsx');

var ToggleGroup = React.createClass({
    displayName: 'ToggleGroup',
    mixins:[ClassMixin],
    propTypes: {
        name: React.PropTypes.string.isRequired,
        grouped: React.PropTypes.bool,
        toggles: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
        value: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ]),
        disabled: React.PropTypes.bool,
        multiple: React.PropTypes.bool,
        onChange: React.PropTypes.func.isRequired
    },
    getDefaultProps: function() {
        return {
            value: [],
            grouped: false,
            toggles: [],
            disabled: false,
            defaultToggle: 'all',
            multiple: false
        };
    },
    getInitialState: function() {
        return this.resetState();
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState(this.resetState(nextProps));
    },
    // componentDidMount: function() {
    //     // Return form state based on default values passed to toggles (checked=true/false)
    //     if (this.props.onChange) {
    //         this.props.onChange(null, {
    //             key: this.props.name,
    //             value: this.state.selected
    //         });
    //     }
    // },
    // shouldComponentUpdate: function (nextProps, nextState) {
    //     return false;
    // },
    resetState: function(nextProps) {
        var props = nextProps || this.props;

        var selected = {};
        var values = [];

        if (_.isArray(props.value)) {
            values = _.clone(props.value);
        }
        else {
            for (var k in props.value) {
                if (props.value[k]) {
                    values.push(k);
                }
            }
        }

        props.toggles.forEach(function(t) {
            var match = _.find(values, function(v) {
                return v  === t.value;
            });

            if (match) {
                selected[t.value] = true;
            }
            else if (values.length > 0) {
                selected[t.value] = false;
            }
            else {
                // Use default value
                selected[t.value] = t.checked || false;
            }
        });

        return {
            selected: selected
        };
    },
    onToggle: function(toggle, e, buttonState) {
        // Remember the state of each toggle
        var selected = this.state.selected;
        // console.log(toggle, e, buttonState)
        if (!this.props.multiple || toggle === 'all') {
            // Reset all toggles
            for(var key in selected) {
                selected[key] = false;
            }
        }

        if (selected[toggle.value] !== undefined) {
            selected[toggle.value] = buttonState.checked;
        }

        this.setState({selected: selected});
        if (this.props.onChange) {
            this.props.onChange(e, {
                key: this.props.name,
                value: selected
            });
        }
    },
    render: function() {
        var classes = this.createClassName('ToggleGroup');

        if (this.props.grouped) {
            classes.modifier('grouped');
            return (
                <div className={classes.className} {...this.props}>
                    {this.renderToggles()}
                </div>
            );
        }

        return (
            <div className={classes.className} {...this.props}>
                {this.renderToggles()}
            </div>
        );

    },
    renderToggles: function() {
        var selected = this.state.selected;

        var toggles = this.props.toggles.map(function(t) {
            return <ToggleBox key={t.value} checked={selected[t.value]} disabled={this.props.disabled} onChange={this.onToggle.bind(this, t)}>{t.label || t.value}</ToggleBox>;
        }.bind(this));

        var allSelected = !_.contains(selected, true);

        if(this.props.defaultToggle) {
            toggles.unshift(<ToggleBox key={this.props.defaultToggle} checked={allSelected} onChange={this.onToggle.bind(this, this.props.defaultToggle)}>{this.props.defaultToggle}</ToggleBox>);
        }

        return toggles;
    }
});

module.exports = ToggleGroup;
