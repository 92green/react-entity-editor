var React = require('react');

var ModalView = React.createClass({
    displayName: 'ModalView',
    render() {
        return (
            <div className={`Modal_content ${this.props.loading ? 'is-loading' : ''}`}>
                <div className="Modal_title">{this.props.title}</div>
                <div className="Modal_body">
                    {this.props.children}
                </div> 
            </div>
        );
    }
});

module.exports = ModalView;