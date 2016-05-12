import React from 'react';
import {State} from 'react-router';
import _ from 'lodash';

import Markdown from 'trc-client-core/src/components/Markdown';
import PartialsCollection from 'trc-client-core/src/copy/PartialsCollection';
import Site from 'trc-client-core/src/constants/Site';
import UserStore from 'trc-client-core/src/user/UserStore';
import StaticCollection from 'trc-client-core/src/media/StaticCollection';


var StaticPage = React.createClass({
    displayName: 'StaticPage',
    mixins: [
        State
    ],
    replacePartials(text) {
        var partialPattern = /{{>\s?(.*)}}/g;
        var match = partialPattern.exec(text);
        var partialsToReplace = [];

        while (match) {
            partialsToReplace.push({
                str: match[0],
                filename: match[1]
            });
            match = partialPattern.exec(text);
        }

        partialsToReplace.forEach(match => {   
            text = text.replace(match.str, _(PartialsCollection).find({filename: match.filename}).__content);
        });

        return text;
    },
    getInitialState() {
        var routePath = this.props.routes[this.props.routes.length - 1].path;
        var page = _(StaticCollection).find({name: routePath});
        page.__content = this.replacePartials(page.__content);
        return {
            page: page
        };
    },
    render() {
        var {page} = this.state;
        var columnsClass = (page.columns) ? `columns-${page.columns}` : '';
        
        return (
            <div>
                <h1>{page.title || page.name}</h1>
                <Markdown html={page} context={Site[UserStore.get('site')]} className={columnsClass}/>
            </div>
        );
    }
});

module.exports = StaticPage;