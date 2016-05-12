import React from 'react';
import Showdown from 'showdown';
import _ from 'lodash';

Showdown.setOption('tables', true);
Showdown.setOption('tasklists', true);
Showdown.setOption('strikethrough', true);
Showdown.setOption('parseImgDimensions', true);
Showdown.setOption('simplifiedAutoLink', true);
var converter = new Showdown.Converter();

class MarkdownViewer extends React.Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        var markdownClassNames = (this.props.styling) ? 'Typography' : '';
        var content;

        if(this.props.html) {
            content = this.props.html.__content || this.props.html;
        }


        if(this.props.context) {
            _.templateSettings.escape = /{{([\s\S]+?)}}/g;
            var compiled = _.template(content);
            content = compiled(this.props.context);
        }

        if(content) {
            return <div className={markdownClassNames + ' ' + this.props.className} dangerouslySetInnerHTML={{ __html: converter.makeHtml(content)}}></div>;            
        }
        return null;
    }
}

MarkdownViewer.propTypes = {
    styling: React.PropTypes.bool
};

MarkdownViewer.defaultProps = {
    styling: true
};

export default MarkdownViewer;