import React from'react';

import NewsCollection from'trc/media/NewsCollection';
import UserStore from'trc/user/UserStore';

import _ from'lodash';
import moment from'moment';

var NewsFeed = React.createClass({
    displayName: 'NewsFeed',
    mixins: [require('bd-stampy/mixins/ClassMixin')],
    propTypes: {
        filter: React.PropTypes.array
    },
    render: function () {
        var site = UserStore.get('site').toLowerCase();

        var newsItems = _(NewsCollection)
            .filter(item => {
                // the news item's filters must contain the current site and one of the props.filter tags
                return _.contains(item.filter, site) && _.intersection(item.filter, this.props.filter).length > 0;
            })
            .sortBy('date')
            .reverse()
            .take(5).value();

        var classes = this.createClassName('NewsList');
        return (
            <ul className={classes.className}>
                {this.renderNewsItems(newsItems)}
            </ul>
        );
    },
    renderNewsItems(items) {
        var count = this.props.count;
        if(!this.props.count){
            count = 999;
        }
        return items.map((item, key) => {
            if(key < count){
                var lead = (key === 0) ? <a href={`/#/media/news/${item.title}`} className="NewsList_item_lead">{item.lead}</a> : null;
                return <li className="NewsList_item" key={key}>
                    <a href={`/#/media/news/${item.title}`}>
                        <div className="NewsList_date">{moment(new Date(item.date)).format('MMM DD')}</div>
                        {item.title}
                    </a>
                    {lead}
                </li>;
            }
        });
    } 
});

module.exports = NewsFeed;