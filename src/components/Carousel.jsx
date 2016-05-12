import React from 'react';
import BasicCarousel from 'react-basic-carousel';
import classNames from 'classnames';
import UserStore from 'trc-client-core/src/user/UserStore';

var Carousel = React.createClass({
    displayName: 'Carousel',
    propTypes: {
        speed: React.PropTypes.number,
        delay: React.PropTypes.number,
        arrows: React.PropTypes.bool,
        dots: React.PropTypes.bool
    },
    getDefaultProps: function() {
        return {
            delay: 5000,
            arrows: true,
            dots: true
        };
    },
    collectChildren(children) {
        return children.filter(item => {
            return UserStore.match(item.props.auth);
        });
    },
    render() {
        
        var next = null;
        var prev = null;

        if(this.props.arrows) {
            next = <div className="Carousel_arrow Carousel_arrow-next Icon"></div>;
            prev = <div className="Carousel_arrow Carousel_arrow-prev Icon"></div>;            
        }

        var classes = classNames(this.props.modifier.split(' ').map(ii => `Carousel-${ii}`), {
            'Carousel-oneSlide': (!this.props.children.length)
        });

        var wrapperClasses = classNames(this.props.className, {
            'hidden--feather l-content-hug': (this.props.modifier && this.props.modifier.indexOf('hero') !== -1)
        });

        return (
            <div className={wrapperClasses} style={{
                width: this.props.width,
                height: this.props.height
            }}>
                <BasicCarousel 
                    {...this.props} 
                    collectChildren={this.collectChildren}
                    className={classes} 
                    nextArrow={next} 
                    previousArrow={prev}>
                    {this.props.children}
                </BasicCarousel>                    
            </div>
        );
    }
});

module.exports = Carousel;


