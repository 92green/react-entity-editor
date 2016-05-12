import React from 'react';
import ReactDOM from 'react-dom';
import froogaloop from 'vimeo-froogaloop';
import theme from 'trc/global/ThemeStore';
import UrlStore from 'bd-stampy/utils/UrlStore';

var Vimeo = React.createClass({
    displayName: 'Vimeo',
    contextTypes: {

    },
    propTypes: {
        vimeoID: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]).isRequired,
        onVideoPlay: React.PropTypes.func,   
        onVideoPause: React.PropTypes.func,  
        onVideoFinish: React.PropTypes.func   
    },
    componentWillMount() {
        this.player = null;          
    },
    componentDidMount() {
        this.player = froogaloop(ReactDOM.findDOMNode(this.refs.video));
        this.player.addEvent('ready', this.onVimeoReady);        
    },
    componentWillUnmount() {
        this.player.removeEvent('play', this.onVideoPlay);
        this.player.removeEvent('pause', this.onVideoPause);
        this.player.removeEvent('finish', this.onVideoFinish);
        this.player.removeEvent('ready', this.onVimeoReady);
    },
    onVimeoReady(){
        this.player.addEvent('play', this.onVideoPlay);
        this.player.addEvent('pause', this.onVideoPause);
        this.player.addEvent('finish', this.onVideoFinish);
    },
    onVideoPlay(){
        if(this.props.onVideoPlay){
            this.props.onVideoPlay();
        }
    },
    onVideoPause(){
        if(this.props.onVideoPause){
            this.props.onVideoPause();
        }
    },
    onVideoFinish(){
        if(this.props.onVideoFinish){
            this.props.onVideoFinish();
        }
    },
    render() {
        var vimeoParams = {
            badge:0,
            byline:0,
            color: theme.get('hero').replace('#', ''),
            portrait:0,
            share:0,
            title:0
        };

		return (
			<div className={`${this.props.className} Video l-ratio--16-9`}>
				<iframe
                    ref="video"
					className="l-ratio_child" 
					src={`https://player.vimeo.com/video/${this.props.vimeoID}?${this.props.search}`} 
					width="100%"
					height="100%"
                    frameBorder="0"
                    webkitAllowFullScreen
                    mozAllowFullScreen
                    allowFullScreen
                >
				</iframe>
			</div>
		);
    }
});

module.exports = Vimeo;


        