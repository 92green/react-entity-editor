import React from 'react';
import {History} from 'react-router';
import Reflux from 'reflux';
import StoreMixin from 'reflux-immutable/StoreMixin';

import VideoActions from 'trc/media/VideoActions';
import VideoStore from 'trc/media/VideoStore';

import Time from 'trc/components/Time';
import Vimeo from 'trc/components/Vimeo';
import Media from 'bd-stampy/components/Media';
import Icon from 'trc/components/Icon';

var Video = React.createClass({
    displayName: 'Video',
    propTypes: {
        id: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]).isRequired,
        ribbon: React.PropTypes.string
    },
    mixins: [
        Reflux.listenTo(VideoStore, 'onStoreChange'),
        require('bd-stampy/mixins/ClassMixin'),
        StoreMixin,
        History
    ],
    getDefaultProps() {
        return {
            type: 'player',
            link: true 
        };
    },
    getStoreState() {
        return {
            video: VideoStore.get('videos').get(this.props.id)
        };
    },
    componentWillMount() {
        VideoActions.getVideo(this.props.id);  
    },
    componentWillReceiveProps(nextProps) {
        if(nextProps.id !== this.props.id){
            VideoActions.getVideo(nextProps.id);  
        }
    },
    onViewVideo() {
        if(this.props.link) {
            this.history.pushState(null, `/media/video/${this.props.id}`);            
        }
    },
    render() {
        if(!this.state.video) {
            return null;
        }

        var classes = this.createClassName('Video').add(this.props.className);

        return <div className={classes.className}>{this[`render_${this.props.type}`]()}</div>;
    },
    render_player() {
        //console.log("ID", this.state.video.video_id)
        return <Vimeo {...this.props} vimeoID={this.state.video.video_id}/>;
    },
    render_viewer() {
        var {video} = this.state;

        return (
            <div>
                <Vimeo vimeoID={video.video_id} className="l-content-hug"/>
                <h2>{this.props.title || video.title}</h2>
                <p>{this.props.description || video.description}</p>
            </div>
        );
    },
    render_list() {
        var {video} = this.state;
        var image = this.renderRibbon(video);
        return (
            <Media image={image} className="margin-bottom2" onClick={this.onViewVideo}>
                <div className="padding-top">
                    <Time value={video.duration} duration="seconds" className="right t-muted"/>
                    <h2 className="hug-top">{video.title}</h2>
                    <p>{video.description}</p>
                </div>
            </Media>
        );
    },
    renderRibbon(video) {
        var image = <div className="Video_thumbnail">
            {(this.props.disabled) ? null : <div className="Video_playIcon"><Icon modifier="large" hexCode="E174" /></div>}
            <img src={video.thumbnail_url} alt={video.title} height="180"/>
        </div>;

        if(!this.props.ribbon) {
            return image;
        }

        return (
            <div className="Ribbon">
                <div className="Ribbon_wrapper">
                    <div className="Ribbon_actual">{this.props.ribbon}</div>
                </div>
                {image}
            </div>
        );
    }
});

module.exports = Video;