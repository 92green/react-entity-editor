var React = require('react');

var Modal = React.createClass({
    displayName: 'Modal',
    propTypes: {
        tags: React.PropTypes.array.isRequired,
        formData: React.PropTypes.object
    },
    render: function() {
        var actions = [<div onClick={this.onCancel} className="Button Button-grey">Cancel</div>];

        if (this.props.formData) {
            actions.push(<div onClick={this.onSave} className="Button inline">Save</div>);
            actions.push(<div onClick={this.onDelete} className="Button Button-clear inline">Delete</div>);
        } else {
            actions.push(<div onClick={this.onCreate} className="Button inline">Create</div>);
        }
            
        return (
            <div className='js-legendModal modal animate-fadein' data-js="modal">
                <div className="js-modalContent modal_content" data-js="modal_content">
                
                </div>
            </div>
        );        
    }
});

module.exports = Modal;