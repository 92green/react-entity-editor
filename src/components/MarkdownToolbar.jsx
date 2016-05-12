var React = require('react');

var MarkdownToolbar = React.createClass({
    mixins: [require('bd-stampy/mixins/ClassMixin')],
    render: function() {
        var classes = this.createClassName('Toolbar');
        return (
            <div className={classes.className}>
                <a className="Toolbar_button Icon Icon-small is-right" data-icon={String.fromCharCode(57477)} target="_blank" href="/#/admin/markdown"></a>
                {this.renderBold()}        
                {this.renderItalic()}        
                {this.renderQuotes()}        
                {this.renderLink()}
            </div> 
        );
    },
    renderBold(){
        if(this.props.bold){
            return (
                <div className="Toolbar_button Icon Icon-small" data-icon={String.fromCharCode(57416)} onClick={this.props.bold}></div>
            );
        }
    },
    renderItalic(){
        if(this.props.italic){
            return (
                <div className="Toolbar_button Icon Icon-small" data-icon={String.fromCharCode(57417)} onClick={this.props.italic} ></div>
            );
        }
    },
    renderQuotes(){
        if(this.props.quotes){
            return (
                <div className="Toolbar_button" onClick={this.props.quotes} data-tag=">">{String.fromCharCode(8220) + " " + String.fromCharCode(8221)}</div>
            );
        }
    },
    renderLink(){
        if(this.props.link){
            return (
                <div className="Toolbar_button Icon Icon-small" data-icon={String.fromCharCode(57668)} onClick={this.props.link}></div>
            );  
        }
    }

});

module.exports = MarkdownToolbar;