import React from 'react';
import {STATIC_ASSETS} from 'trc/constants/url';
import Auth from 'trc/components/Auth';
import ClassMixin from 'bd-stampy/mixins/ClassMixin';

var CarouselItem = React.createClass({
    displayName: 'CarouselItem',
    mixins: [
        ClassMixin
    ],
    propTypes: {
        image: React.PropTypes.string.isRequired,
        auth: React.PropTypes.object,
        width: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ]),
        href: React.PropTypes.string,
        center: React.PropTypes.bool,
        captionModifier: React.PropTypes.string
    },
    getDefaultProps() {
        return {
            width: 40,
            center: false,
            captionModifier: ''
        };
    },
    render() {
        var link = "#";
        if(this.props.href){
            link = this.props.href;
        }
        return (
            <Auth {...this.props.auth} component="li">
                <div>        
                    <a href={link}>
                        <img src={`${STATIC_ASSETS}img/content/${this.props.image}`} width="1024" height="320" />
                    </a>
                </div>
                {this.renderContent()}   
            </Auth>
        );
    },
    renderContent() {
        var content;
        var captionClass = this.createClassName('Caption').add('ui-opacity--80');
        
        this.props.captionModifier.split(' ').forEach(cc => {
            captionClass.modifier(cc);
        });

        if(this.props.center) {
            content = <div className="Carousel_solo">
                <div className="Carousel_solo_title">{this.props.title}</div>
                {this.props.children}
            </div>;
        } else {
            content = <div className={`Carousel-hero_text w${this.props.width} right`}>
                <h3 className="hug-top">{this.props.title}</h3>  
                {this.props.children}
            </div>;
        }

        return <div>
            {content}            
            <div className={captionClass.className}>{this.props.caption}</div>         
        </div>
    }
});

module.exports = CarouselItem;