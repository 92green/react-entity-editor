var React = require('react');
var Button = require('bd-stampy/components/Button');
var {Link} = require('react-router');

var FormActionsBar = React.createClass({
    displayName: 'FormActionsBar',
    propTypes: {
        onCancel: React.PropTypes.string.isRequired,
        onSave: React.PropTypes.func.isRequired,
        dirty: React.PropTypes.bool
    },
    renderDirtyStatus() {
        if(this.props.dirty) {
            return <span className="Icon padding05 t-red" data-icon={"\uE446"}></span>;            
        }
    },
    render: function () {
        return (
            <div className="padding flush-right right">
                <Link to={this.props.onCancel} className="Button Button-grey">Cancel</Link>
                <Button className="inline" color="edit" onClick={this.props.onSave} disabled={!this.props.dirty}>Save</Button>
                {this.renderDirtyStatus()}
            </div>
        );
    }
});

module.exports = FormActionsBar;