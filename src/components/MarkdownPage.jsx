import React from 'react';
import UserStore from 'trc/user/UserStore';
import Markdown from 'trc/components/Markdown';
import Site from 'trc/constants/Site';
import * as url from 'trc/constants/url';

import {defaults} from 'lodash';

var MarkdownPage = React.createClass({
    displayName: 'MarkdownPage',
    propTypes: {
        collection: React.PropTypes.array.isRequired,
        name: React.PropTypes.string.isRequired
    },
    render() {
        var pages = this.props.collection.filter(item => item.name === this.props.name);
        var page = pages[0];
        
        if(pages.length < 1) {
            console.warn(`No markdown file matches the name of '${this.props.name}'`);
            return null;
        }

        let columnsClass = (page.columns) ? `columns-${page.columns}` : '';
        return (
            <div>
                <h1>{page.title || page.name}</h1>
                <Markdown html={page} context={defaults(Site[UserStore.get('site')], url)} styling={this.props.styling} className={columnsClass}/>
            </div>
        );
    }    
});

export default MarkdownPage;
