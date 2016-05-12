var React = require('react');
var Textarea = require('bd-stampy/components/Textarea');
var MarkdownToolbar = require('trc/components/MarkdownToolbar');
var TextareaMixin = require('trc/mixins/TextareaMixin');

function addhttp(url) {
   if (!/^(f|ht)tps?:\/\//i.test(url)) {
      url = "http://" + url;
   }
   return url;
}

function wrapText(key) {
    this.markUpData(this.TextareaMixin_wrapSelection(this.state.value, this.state.currentTextSelection, key));
}

function prependText(key) {
    this.markUpData(this.TextareaMixin_prependParagraph(this.state.value, this.state.currentTextSelection, key));
}

var MarkdownTextarea = React.createClass({
    display : 'MarkdownTextarea',
    mixins:[
        TextareaMixin
    ],
    getInitialState: function () {
        return {
            currentTextSelection : null,
            value: this.props.value || this.props.defaultValue
        };
    },
    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) {
            this.setState({
                value: nextProps.value
            });
        }  
    },
    markUpData(text) {
        this.setState({
            value: text
        });
    },
    onChange(e, details) {
        this.setState({
            value: details.value
        }, this.updateUpstream);
    },
    updateUpstream() {
        if(this.props.onChange) {
            this.props.onChange(null, this.getDetails());
        }
    },
    getDetails() {
        return {
            key: this.props.name,
            value: this.state.value
        };
    },
    onSelection(selection) {
        this.setState({currentTextSelection: selection});
    },
    onClickLink(){
        if(this.state.currentTextSelection.length === 0) {
            var link = addhttp(window.prompt('Enter link address'));
            var title = window.prompt('Enter link Title');
            this.markUpData(this.props.value + ' [' + title + '](' + link + ')');
        } else {
            var url = '](' + addhttp(window.prompt('Enter link address')) + ')';
            this.markUpData(this.TextareaMixin_wrapSelection(this.props.value, this.state.currentTextSelection, '[', url));       
        }   
    },
    render: function() {

        return (
            <div>           
                <label className="Label">{this.props.label}</label>
                <MarkdownToolbar 
                    modifier={this.props.modifier}
                    bold={wrapText.bind(this, '**')}
                    italic={wrapText.bind(this, '_')}
                    quotes={prependText.bind(this, '> ')} 
                    link={this.onClickLink}
                />
                <Textarea 
                    {...this.props} 
                    ref="textarea"
                    value={this.state.value}
                    onChange={this.onChange}
                    onSelection={this.onSelection} 
                />
            </div>
        );
    }

});

module.exports = MarkdownTextarea;