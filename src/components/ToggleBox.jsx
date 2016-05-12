
var React = require('react');
var ClassMixin = require('bd-stampy/mixins/ClassMixin.jsx');
// require('../../../../client/sass/StampyUI/modules/_ToggleBox.scss');

var ToggleBox = React.createClass({
    displayName: 'ToggleBox',
    mixins: [
        ClassMixin,
        require('bd-stampy/mixins/ARIAMixin')
    ],
    propTypes: {
        toggle: React.PropTypes.bool,
        checked: React.PropTypes.bool,
        disabled: React.PropTypes.bool,
        name: React.PropTypes.string,
        canToggleOff: React.PropTypes.bool
    },
    getDefaultProps: function () {
        return {
            checked: false,
            disabled: false,
            name: null,
            canToggleOff: true //TODO: Needs to be removed once we stop using state and only use props
        };
    },
    getInitialState: function() {
        return {
            checked: this.props.checked,
            focused: false
        };
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState({checked: nextProps.checked});
    },
    onClick: function(e) {
        if (!this.props.disabled) {
            var state = { checked: !this.state.checked };

            if (state.checked || this.props.canToggleOff) {
                this.setState(state);
            }

            if (this.props.onChange) {
                this.props.onChange(e, state);
            }
            else if (this.props.onClick) {
                console.warn('ToggleBox', 'onClick will be deprecated. Use onChange instead');
                this.props.onClick(e, state);
            }
        }
    },
    onFocus: function () {
        this.setState({focused: true});
    },
    onBlur: function () {
        this.setState({focused: false});
    },
    onChange: function() {
        // Need to stub this so react warnings go. Check implementation in onClick
    },
    render: function() {
        var classes = this.createClassName('ToggleBox');
        classes.is(this.state.focused, 'focused');


        if (!this.state.checked) {
            classes.modifier('inactive');
        }

        if (this.props.disabled) {
            classes.modifier('disabled');
        }

        return <div className={classes.className} onClick={this.onClick}>
            <label>{this.props.children}</label>
            <input
                className="ToggleBox_input"
                type="checkbox"
                checked={this.state.checked}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                onChange={this.onChange}
            />
        </div>;
    }
});

module.exports = ToggleBox;
