
var React = require('react');

var InformationModal = React.createClass({
    displayName: 'InformationModal',
    propTypes: {
        title: React.PropTypes.string
    },    
    render: function() {
        return (
            <div>
                <div className="modal_title">{this.props.title}</div>
                <div className="modal_body">
                    {this.props.children}
                    <a className="Button l-right" onClick={this.props.onClose}>Okay</a>
                </div>
            </div>
        );        
    }
});

module.exports = InformationModal;


